import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Filter, Download, Upload, Search, Calendar, DollarSign, Tag, FileText, Check, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Transaction } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface TransactionManagerProps {
  transactions: Transaction[];
  onTransactionsChange: (transactions: Transaction[]) => void;
}

export const TransactionManager: React.FC<TransactionManagerProps> = ({
  transactions,
  onTransactionsChange
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const { toast } = useToast();
  
  const form = useForm<Partial<Transaction>>({
    defaultValues: {
      type: 'expense',
      amount: 0,
      category: '',
      account: 'checking',
      description: '',
      tags: [],
      isRecurring: false,
    }
  });

  // Filter and sort transactions
  const filteredAndSortedTransactions = React.useMemo(() => {
    let filtered = transactions.filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || transaction.type === filterType;
      const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
      
      return matchesSearch && matchesType && matchesCategory;
    });

    return filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [transactions, searchTerm, filterType, filterCategory, sortBy, sortOrder]);

  // Add new transaction
  const handleAddTransaction = useCallback((data: Partial<Transaction>) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      amount: data.amount || 0,
      type: data.type || 'expense',
      category: data.category || 'Other',
      account: data.account || 'checking',
      description: data.description || '',
      tags: data.tags || [],
      isRecurring: data.isRecurring || false,
      isReconciled: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data
    };

    const updatedTransactions = [...transactions, newTransaction];
    onTransactionsChange(updatedTransactions);
    
    toast({
      title: "Transaction Added",
      description: `${newTransaction.type} transaction for $${newTransaction.amount} added successfully.`,
    });

    setIsAddDialogOpen(false);
    form.reset();
  }, [transactions, onTransactionsChange, toast, form]);

  // Edit transaction
  const handleEditTransaction = useCallback((data: Partial<Transaction>) => {
    if (!editingTransaction) return;

    const updatedTransaction = {
      ...editingTransaction,
      ...data,
      updatedAt: new Date().toISOString()
    };

    const updatedTransactions = transactions.map(t => 
      t.id === editingTransaction.id ? updatedTransaction : t
    );
    
    onTransactionsChange(updatedTransactions);
    
    toast({
      title: "Transaction Updated",
      description: "Transaction has been updated successfully.",
    });

    setEditingTransaction(null);
    form.reset();
  }, [editingTransaction, transactions, onTransactionsChange, toast, form]);

  // Delete transaction
  const handleDeleteTransaction = useCallback((id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    onTransactionsChange(updatedTransactions);
    
    toast({
      title: "Transaction Deleted",
      description: "Transaction has been deleted successfully.",
    });
  }, [transactions, onTransactionsChange, toast]);

  // Bulk import transactions
  const handleBulkImport = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvData = e.target?.result as string;
        const lines = csvData.split('\n');
        const headers = lines[0].split(',');
        
        const newTransactions: Transaction[] = lines.slice(1)
          .filter(line => line.trim())
          .map((line, index) => {
            const values = line.split(',');
            return {
              id: `import-${Date.now()}-${index}`,
              date: values[0] || new Date().toISOString().split('T')[0],
              amount: parseFloat(values[1]) || 0,
              type: (values[2] as any) || 'expense',
              category: values[3] || 'Other',
              account: values[4] || 'checking',
              description: values[5] || '',
              tags: values[6] ? values[6].split(';') : [],
              isRecurring: values[7] === 'true',
              isReconciled: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
          });

        onTransactionsChange([...transactions, ...newTransactions]);
        
        toast({
          title: "Import Successful",
          description: `${newTransactions.length} transactions imported successfully.`,
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Failed to parse CSV file. Please check the format.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  }, [transactions, onTransactionsChange, toast]);

  // Export transactions
  const handleExport = useCallback(() => {
    const csvContent = [
      ['Date', 'Amount', 'Type', 'Category', 'Account', 'Description', 'Tags', 'Recurring'].join(','),
      ...filteredAndSortedTransactions.map(t => [
        t.date,
        t.amount.toString(),
        t.type,
        t.category,
        t.account,
        t.description,
        t.tags.join(';'),
        t.isRecurring.toString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Transactions exported to CSV file.",
    });
  }, [filteredAndSortedTransactions, toast]);

  const categories = Array.from(new Set(transactions.map(t => t.category)));
  const accounts = ['checking', 'savings', 'credit', 'investment', 'cash'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Transaction Manager</h2>
          <p className="text-muted-foreground">Add, edit, and manage all your financial transactions</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <TransactionForm
              onSubmit={handleAddTransaction}
              form={form}
              categories={categories}
              accounts={accounts}
              title="Add New Transaction"
            />
          </Dialog>

          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <Button variant="outline" asChild>
            <label className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleBulkImport(file);
                }}
              />
            </label>
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <Label>Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <Label>Type</Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Category</Label>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Sort By</Label>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Order</Label>
            <Select value={sortOrder} onValueChange={(value: any) => setSortOrder(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Transaction List */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Transactions ({filteredAndSortedTransactions.length})
            </h3>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Total: </span>
              <span className="font-bold">
                ${filteredAndSortedTransactions.reduce((sum, t) => 
                  t.type === 'income' ? sum + t.amount : sum - t.amount, 0
                ).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              {filteredAndSortedTransactions.map((transaction) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'income' ? 'bg-green-100 text-green-600' :
                      transaction.type === 'expense' ? 'bg-red-100 text-red-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {transaction.type === 'income' ? <DollarSign className="h-4 w-4" /> :
                       transaction.type === 'expense' ? <DollarSign className="h-4 w-4" /> :
                       <DollarSign className="h-4 w-4" />}
                    </div>

                    <div>
                      <div className="font-medium">{transaction.description}</div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{transaction.date}</span>
                        <Badge variant="outline" className="text-xs">
                          {transaction.category}
                        </Badge>
                        {transaction.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className={`font-bold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.account}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      {transaction.isReconciled ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-red-600" />
                      )}

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingTransaction(transaction);
                              form.reset(transaction);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <TransactionForm
                          onSubmit={handleEditTransaction}
                          form={form}
                          categories={categories}
                          accounts={accounts}
                          title="Edit Transaction"
                          initialData={transaction}
                        />
                      </Dialog>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTransaction(transaction.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredAndSortedTransactions.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No transactions found matching your criteria.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  Add your first transaction
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

// Transaction Form Component
const TransactionForm: React.FC<{
  onSubmit: (data: Partial<Transaction>) => void;
  form: any;
  categories: string[];
  accounts: string[];
  title: string;
  initialData?: Transaction;
}> = ({ onSubmit, form, categories, accounts, title, initialData }) => {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Transaction description" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="account"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accounts.map(acc => (
                        <SelectItem key={acc} value={acc}>
                          {acc.charAt(0).toUpperCase() + acc.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <DialogTrigger asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogTrigger>
            <Button type="submit">
              {initialData ? 'Update' : 'Add'} Transaction
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
};

export default TransactionManager;
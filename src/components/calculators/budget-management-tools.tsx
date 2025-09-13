import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, BarChart3, TrendingUp, Bell, FileText, CreditCard, PiggyBank, Calendar, DollarSign, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import InteractiveChart from '@/components/charts/interactive-chart';

interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  color: string;
}

interface Expense {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'yearly';
  nextDue: string;
}

interface Asset {
  type: 'asset' | 'liability';
  name: string;
  value: number;
}

export const BudgetManagementTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState('budget');
  const [income, setIncome] = useState(5000);
  
  // Budget Categories
  const [categories, setCategories] = useState<BudgetCategory[]>([
    { id: '1', name: 'Housing', allocated: 1500, spent: 1450, color: '#641220' },
    { id: '2', name: 'Food', allocated: 600, spent: 580, color: '#85182a' },
    { id: '3', name: 'Transportation', allocated: 400, spent: 380, color: '#a11d33' },
    { id: '4', name: 'Entertainment', allocated: 300, spent: 320, color: '#bd1f36' },
    { id: '5', name: 'Savings', allocated: 800, spent: 800, color: '#da1e37' },
    { id: '6', name: 'Utilities', allocated: 200, spent: 185, color: '#e01e37' },
  ]);

  // Recurring Expenses
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', name: 'Netflix', amount: 15.99, frequency: 'monthly', nextDue: '2024-02-01' },
    { id: '2', name: 'Spotify', amount: 9.99, frequency: 'monthly', nextDue: '2024-02-05' },
    { id: '3', name: 'Car Insurance', amount: 120, frequency: 'monthly', nextDue: '2024-02-15' },
    { id: '4', name: 'Gym Membership', amount: 45, frequency: 'monthly', nextDue: '2024-02-10' },
  ]);

  // Assets and Liabilities
  const [assets, setAssets] = useState<Asset[]>([
    { type: 'asset', name: 'Checking Account', value: 5000 },
    { type: 'asset', name: 'Savings Account', value: 15000 },
    { type: 'asset', name: 'Investment Portfolio', value: 25000 },
    { type: 'asset', name: 'Real Estate', value: 250000 },
    { type: 'liability', name: 'Credit Card', value: -2500 },
    { type: 'liability', name: 'Student Loan', value: -15000 },
    { type: 'liability', name: 'Mortgage', value: -180000 },
  ]);

  // Cash Flow Data (last 12 months)
  const [cashFlowData] = useState([
    { name: 'Jan', income: 5000, expenses: 4200, net: 800 },
    { name: 'Feb', income: 5000, expenses: 4100, net: 900 },
    { name: 'Mar', income: 5200, expenses: 4300, net: 900 },
    { name: 'Apr', income: 5000, expenses: 4000, net: 1000 },
    { name: 'May', income: 5100, expenses: 4250, net: 850 },
    { name: 'Jun', income: 5000, expenses: 4100, net: 900 },
    { name: 'Jul', income: 5300, expenses: 4400, net: 900 },
    { name: 'Aug', income: 5000, expenses: 4050, net: 950 },
    { name: 'Sep', income: 5000, expenses: 4200, net: 800 },
    { name: 'Oct', income: 5200, expenses: 4300, net: 900 },
    { name: 'Nov', income: 5000, expenses: 4150, net: 850 },
    { name: 'Dec', income: 5500, expenses: 4600, net: 900 },
  ]);

  const totalAllocated = categories.reduce((sum, cat) => sum + cat.allocated, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const remainingBudget = income - totalAllocated;

  const totalAssets = assets.filter(a => a.type === 'asset').reduce((sum, a) => sum + a.value, 0);
  const totalLiabilities = Math.abs(assets.filter(a => a.type === 'liability').reduce((sum, a) => sum + a.value, 0));
  const netWorth = totalAssets - totalLiabilities;

  const monthlyExpenses = expenses.reduce((sum, exp) => {
    switch (exp.frequency) {
      case 'monthly': return sum + exp.amount;
      case 'quarterly': return sum + (exp.amount / 3);
      case 'yearly': return sum + (exp.amount / 12);
      default: return sum;
    }
  }, 0);

  const addCategory = () => {
    const newCategory: BudgetCategory = {
      id: Date.now().toString(),
      name: 'New Category',
      allocated: 0,
      spent: 0,
      color: '#' + Math.floor(Math.random()*16777215).toString(16)
    };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (id: string, field: keyof BudgetCategory, value: any) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, [field]: value } : cat
    ));
  };

  const addExpense = () => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      name: 'New Expense',
      amount: 0,
      frequency: 'monthly',
      nextDue: new Date().toISOString().split('T')[0]
    };
    setExpenses([...expenses, newExpense]);
  };

  const updateExpense = (id: string, field: keyof Expense, value: any) => {
    setExpenses(expenses.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const addAsset = (type: 'asset' | 'liability') => {
    const newAsset: Asset = {
      type,
      name: type === 'asset' ? 'New Asset' : 'New Liability',
      value: 0
    };
    setAssets([...assets, newAsset]);
  };

  const updateAsset = (index: number, field: keyof Asset, value: any) => {
    const updatedAssets = [...assets];
    updatedAssets[index] = { ...updatedAssets[index], [field]: value };
    setAssets(updatedAssets);
  };

  const tabs = [
    { id: 'budget', name: 'Budget Planner', icon: PieChart },
    { id: 'cashflow', name: 'Cash Flow', icon: TrendingUp },
    { id: 'balance', name: 'Balance Sheet', icon: BarChart3 },
    { id: 'recurring', name: 'Recurring Expenses', icon: Calendar },
    { id: 'allocator', name: 'Savings Allocator', icon: PiggyBank },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Budget & Money Management</h2>
          <p className="text-muted-foreground">Comprehensive financial planning tools</p>
        </div>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-muted/50 rounded-lg">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center space-x-2"
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.name}</span>
          </Button>
        ))}
      </div>

      {/* Monthly Budget Planner */}
      {activeTab === 'budget' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Monthly Budget</h3>
              <Button onClick={addCategory} size="sm">Add Category</Button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <Label>Monthly Income</Label>
                <Input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="space-y-2 p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <Input
                      value={category.name}
                      onChange={(e) => updateCategory(category.id, 'name', e.target.value)}
                      className="font-medium border-none p-0 h-auto"
                    />
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        value={category.allocated}
                        onChange={(e) => updateCategory(category.id, 'allocated', Number(e.target.value))}
                        className="w-20 text-right"
                      />
                      <Input
                        type="number"
                        value={category.spent}
                        onChange={(e) => updateCategory(category.id, 'spent', Number(e.target.value))}
                        className="w-20 text-right"
                      />
                    </div>
                  </div>
                  <Progress
                    value={(category.spent / category.allocated) * 100}
                    className="h-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Spent: ${category.spent}</span>
                    <span>Budget: ${category.allocated}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Income:</span>
                  <div className="font-bold text-lg">${income.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Allocated:</span>
                  <div className="font-bold text-lg">${totalAllocated.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Spent:</span>
                  <div className="font-bold text-lg">${totalSpent.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Remaining:</span>
                  <div className={`font-bold text-lg ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${remainingBudget.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Budget Visualization</h3>
            <InteractiveChart
              data={categories.map(cat => ({
                name: cat.name,
                value: cat.allocated,
                spent: cat.spent,
                remaining: cat.allocated - cat.spent
              }))}
              title="Budget Allocation"
              type="pie"
              height={350}
            />
            
            <div className="mt-4 space-y-2">
              {categories.map((category) => {
                const percentage = (category.spent / category.allocated) * 100;
                const isOverBudget = category.spent > category.allocated;
                
                return (
                  <div key={category.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span>{category.name}</span>
                    </div>
                    <Badge variant={isOverBudget ? "destructive" : "default"}>
                      {percentage.toFixed(0)}%
                    </Badge>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Cash Flow Tracker */}
      {activeTab === 'cashflow' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Cash Flow Analysis</h3>
          <InteractiveChart
            data={cashFlowData.map(d => ({ ...d, value: d.income }))}
            title="Income vs Expenses"
            subtitle="Monthly cash flow over the last 12 months"
            type="bar"
            dataKeys={['income', 'expenses', 'net']}
            height={400}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">
                ${cashFlowData.reduce((sum, d) => sum + d.income, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Income (12M)</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">
                ${cashFlowData.reduce((sum, d) => sum + d.expenses, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Expenses (12M)</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">
                ${cashFlowData.reduce((sum, d) => sum + d.net, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Net Savings (12M)</div>
            </div>
          </div>
        </Card>
      )}

      {/* Balance Sheet */}
      {activeTab === 'balance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Assets & Liabilities</h3>
              <div className="space-x-2">
                <Button onClick={() => addAsset('asset')} size="sm" variant="outline">Add Asset</Button>
                <Button onClick={() => addAsset('liability')} size="sm" variant="outline">Add Liability</Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-green-600 mb-2">Assets</h4>
                {assets.filter(a => a.type === 'asset').map((asset, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <Input
                      value={asset.name}
                      onChange={(e) => updateAsset(assets.indexOf(asset), 'name', e.target.value)}
                      className="border-none p-0 h-auto flex-1"
                    />
                    <Input
                      type="number"
                      value={asset.value}
                      onChange={(e) => updateAsset(assets.indexOf(asset), 'value', Number(e.target.value))}
                      className="w-32 text-right"
                    />
                  </div>
                ))}
              </div>

              <div>
                <h4 className="font-medium text-red-600 mb-2">Liabilities</h4>
                {assets.filter(a => a.type === 'liability').map((liability, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <Input
                      value={liability.name}
                      onChange={(e) => updateAsset(assets.indexOf(liability), 'name', e.target.value)}
                      className="border-none p-0 h-auto flex-1"
                    />
                    <Input
                      type="number"
                      value={Math.abs(liability.value)}
                      onChange={(e) => updateAsset(assets.indexOf(liability), 'value', -Number(e.target.value))}
                      className="w-32 text-right"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-600">Total Assets:</span>
                  <span className="font-bold">${totalAssets.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Total Liabilities:</span>
                  <span className="font-bold">${totalLiabilities.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-bold">Net Worth:</span>
                  <span className={`font-bold text-lg ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${netWorth.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Net Worth Breakdown</h3>
            <InteractiveChart
              data={[
                { name: 'Assets', value: totalAssets },
                { name: 'Liabilities', value: totalLiabilities }
              ]}
              title="Assets vs Liabilities"
              type="pie"
              height={300}
            />
            
            <div className="mt-6 space-y-3">
              {assets.map((asset, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{asset.name}</span>
                  <span className={asset.type === 'asset' ? 'text-green-600' : 'text-red-600'}>
                    ${Math.abs(asset.value).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Recurring Expenses */}
      {activeTab === 'recurring' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recurring Expenses Tracker</h3>
            <Button onClick={addExpense} size="sm">Add Expense</Button>
          </div>

          <div className="space-y-3 mb-6">
            {expenses.map((expense) => (
              <div key={expense.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                <Input
                  value={expense.name}
                  onChange={(e) => updateExpense(expense.id, 'name', e.target.value)}
                  placeholder="Expense name"
                />
                <Input
                  type="number"
                  value={expense.amount}
                  onChange={(e) => updateExpense(expense.id, 'amount', Number(e.target.value))}
                  placeholder="Amount"
                />
                <select
                  value={expense.frequency}
                  onChange={(e) => updateExpense(expense.id, 'frequency', e.target.value as any)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
                <Input
                  type="date"
                  value={expense.nextDue}
                  onChange={(e) => updateExpense(expense.id, 'nextDue', e.target.value)}
                />
                <div className="flex items-center">
                  <Bell className="h-4 w-4 text-yellow-500 mr-2" />
                  <span className="text-sm">
                    {Math.ceil((new Date(expense.nextDue).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold">${monthlyExpenses.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Estimated Monthly Recurring Expenses</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default BudgetManagementTools;
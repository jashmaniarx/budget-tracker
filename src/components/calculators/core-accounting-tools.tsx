import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, DollarSign, Percent, TrendingUp, PiggyBank, Users, Target, Activity, BarChart3, FileText, Maximize, Minimize } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CalculatorResult {
  [key: string]: number | string;
}

export const CoreAccountingTools: React.FC = () => {
  const [activeCalculator, setActiveCalculator] = useState('basic');
  const [results, setResults] = useState<Record<string, CalculatorResult>>({});

  // Basic Calculator State
  const [basicCalc, setBasicCalc] = useState({ a: '', b: '', operation: '+' });

  // Currency Converter State
  const [currencyCalc, setCurrencyCalc] = useState({ amount: '', from: 'USD', to: 'EUR', rate: '0.85' });

  // Tax Calculator State
  const [taxCalc, setTaxCalc] = useState({ income: '', taxRate: '', taxType: 'income' });

  // Loan Calculator State
  const [loanCalc, setLoanCalc] = useState({ principal: '', rate: '', term: '', frequency: 'monthly' });

  // Savings Goal Tracker State
  const [savingsCalc, setSavingsCalc] = useState({ target: '', current: '', monthly: '', timeline: '' });

  // Compound Interest Calculator State
  const [compoundCalc, setCompoundCalc] = useState({ principal: '', rate: '', years: '', frequency: '12' });

  // Expense Splitter State
  const [splitterCalc, setSplitterCalc] = useState({ total: '', people: '', tip: '0' });

  // Break-Even Calculator State
  const [breakevenCalc, setBreakevenCalc] = useState({ fixedCosts: '', variableCost: '', price: '' });

  // Profit Margin Calculator State
  const [profitCalc, setProfitCalc] = useState({ revenue: '', costs: '', type: 'gross' });

  // Depreciation Calculator State
  const [depreciationCalc, setDepreciationCalc] = useState({ cost: '', salvage: '', years: '', method: 'straight' });

  // Calculator Functions
  const calculateBasic = () => {
    const a = parseFloat(basicCalc.a);
    const b = parseFloat(basicCalc.b);
    let result = 0;

    switch (basicCalc.operation) {
      case '+': result = a + b; break;
      case '-': result = a - b; break;
      case '*': result = a * b; break;
      case '/': result = b !== 0 ? a / b : 0; break;
      default: result = 0;
    }

    setResults({ ...results, basic: { result: result.toFixed(2) } });
  };

  const calculateCurrency = () => {
    const amount = parseFloat(currencyCalc.amount);
    const rate = parseFloat(currencyCalc.rate);
    const converted = amount * rate;

    setResults({ 
      ...results, 
      currency: { 
        converted: converted.toFixed(2),
        rate: rate,
        from: currencyCalc.from,
        to: currencyCalc.to
      } 
    });
  };

  const calculateTax = () => {
    const income = parseFloat(taxCalc.income);
    const rate = parseFloat(taxCalc.taxRate) / 100;
    const tax = income * rate;
    const afterTax = income - tax;

    setResults({ 
      ...results, 
      tax: { 
        tax: tax.toFixed(2),
        afterTax: afterTax.toFixed(2),
        rate: (rate * 100).toFixed(1) + '%'
      } 
    });
  };

  const calculateLoan = () => {
    const principal = parseFloat(loanCalc.principal);
    const annualRate = parseFloat(loanCalc.rate) / 100;
    const years = parseFloat(loanCalc.term);
    
    const monthlyRate = annualRate / 12;
    const totalPayments = years * 12;
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                          (Math.pow(1 + monthlyRate, totalPayments) - 1);
    
    const totalPaid = monthlyPayment * totalPayments;
    const totalInterest = totalPaid - principal;

    setResults({ 
      ...results, 
      loan: { 
        monthlyPayment: monthlyPayment.toFixed(2),
        totalPaid: totalPaid.toFixed(2),
        totalInterest: totalInterest.toFixed(2)
      } 
    });
  };

  const calculateSavingsGoal = () => {
    const target = parseFloat(savingsCalc.target);
    const current = parseFloat(savingsCalc.current);
    const monthly = parseFloat(savingsCalc.monthly);
    
    const remaining = target - current;
    const monthsToGoal = Math.ceil(remaining / monthly);
    const progress = (current / target) * 100;

    setResults({ 
      ...results, 
      savings: { 
        remaining: remaining.toFixed(2),
        monthsToGoal: monthsToGoal,
        progress: progress.toFixed(1) + '%'
      } 
    });
  };

  const calculateCompoundInterest = () => {
    const principal = parseFloat(compoundCalc.principal);
    const rate = parseFloat(compoundCalc.rate) / 100;
    const years = parseFloat(compoundCalc.years);
    const frequency = parseInt(compoundCalc.frequency);
    
    const amount = principal * Math.pow(1 + (rate / frequency), frequency * years);
    const interest = amount - principal;

    setResults({ 
      ...results, 
      compound: { 
        finalAmount: amount.toFixed(2),
        totalInterest: interest.toFixed(2),
        growth: ((interest / principal) * 100).toFixed(1) + '%'
      } 
    });
  };

  const calculateExpenseSplit = () => {
    const total = parseFloat(splitterCalc.total);
    const people = parseInt(splitterCalc.people);
    const tip = parseFloat(splitterCalc.tip) / 100;
    
    const totalWithTip = total + (total * tip);
    const perPerson = totalWithTip / people;
    const tipAmount = total * tip;

    setResults({ 
      ...results, 
      splitter: { 
        perPerson: perPerson.toFixed(2),
        totalWithTip: totalWithTip.toFixed(2),
        tipAmount: tipAmount.toFixed(2)
      } 
    });
  };

  const calculateBreakEven = () => {
    const fixedCosts = parseFloat(breakevenCalc.fixedCosts);
    const variableCost = parseFloat(breakevenCalc.variableCost);
    const price = parseFloat(breakevenCalc.price);
    
    const contributionMargin = price - variableCost;
    const breakEvenUnits = fixedCosts / contributionMargin;
    const breakEvenRevenue = breakEvenUnits * price;

    setResults({ 
      ...results, 
      breakeven: { 
        units: Math.ceil(breakEvenUnits),
        revenue: breakEvenRevenue.toFixed(2),
        contributionMargin: contributionMargin.toFixed(2)
      } 
    });
  };

  const calculateProfitMargin = () => {
    const revenue = parseFloat(profitCalc.revenue);
    const costs = parseFloat(profitCalc.costs);
    
    const profit = revenue - costs;
    const margin = (profit / revenue) * 100;

    setResults({ 
      ...results, 
      profit: { 
        profit: profit.toFixed(2),
        margin: margin.toFixed(2) + '%',
        type: profitCalc.type
      } 
    });
  };

  const calculateDepreciation = () => {
    const cost = parseFloat(depreciationCalc.cost);
    const salvage = parseFloat(depreciationCalc.salvage);
    const years = parseFloat(depreciationCalc.years);
    
    const annualDepreciation = (cost - salvage) / years;
    const totalDepreciation = annualDepreciation * years;
    const currentValue = cost - totalDepreciation;

    setResults({ 
      ...results, 
      depreciation: { 
        annualDepreciation: annualDepreciation.toFixed(2),
        totalDepreciation: totalDepreciation.toFixed(2),
        currentValue: Math.max(currentValue, salvage).toFixed(2)
      } 
    });
  };

  const calculators = [
    { id: 'basic', name: 'Basic Calculator', icon: Calculator, color: 'bg-blue-500' },
    { id: 'currency', name: 'Currency Converter', icon: DollarSign, color: 'bg-green-500' },
    { id: 'tax', name: 'Tax Calculator', icon: Percent, color: 'bg-red-500' },
    { id: 'loan', name: 'Loan Calculator', icon: TrendingUp, color: 'bg-purple-500' },
    { id: 'savings', name: 'Savings Goal Tracker', icon: PiggyBank, color: 'bg-yellow-500' },
    { id: 'compound', name: 'Compound Interest', icon: Activity, color: 'bg-indigo-500' },
    { id: 'splitter', name: 'Expense Splitter', icon: Users, color: 'bg-pink-500' },
    { id: 'breakeven', name: 'Break-Even Calculator', icon: Target, color: 'bg-orange-500' },
    { id: 'profit', name: 'Profit Margin', icon: BarChart3, color: 'bg-teal-500' },
    { id: 'depreciation', name: 'Depreciation', icon: FileText, color: 'bg-gray-500' }
  ];

  const [isFullscreen, setIsFullscreen] = useState(false);

  const exportToPDF = () => {
    const element = document.getElementById('calculator-results');
    if (element) {
      // Create PDF export functionality
      const printWindow = window.open('', '', 'height=600,width=800');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Calculator Results</title>');
        printWindow.document.write('<style>body{font-family:Arial,sans-serif;padding:20px;}</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write('<h1>Calculator Results</h1>');
        printWindow.document.write(element.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`w-full transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 bg-background p-6 overflow-auto' : ''}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Core Accounting Tools</h2>
          <p className="text-muted-foreground">Professional calculators for financial management</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={toggleFullscreen} variant="outline" size="sm">
            {isFullscreen ? <Minimize className="h-4 w-4 mr-2" /> : <Maximize className="h-4 w-4 mr-2" />}
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </Button>
          <Button onClick={exportToPDF} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {calculators.map((calc) => (
          <Button
            key={calc.id}
            variant={activeCalculator === calc.id ? "default" : "outline"}
            className="h-auto p-3 flex flex-col items-center space-y-2"
            onClick={() => setActiveCalculator(calc.id)}
          >
            <div className={`p-2 rounded-lg ${calc.color}`}>
              <calc.icon className="h-4 w-4 text-white" />
            </div>
            <span className="text-xs text-center">{calc.name}</span>
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator Input */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {calculators.find(c => c.id === activeCalculator)?.name}
          </h3>

          {activeCalculator === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <Input
                  type="number"
                  placeholder="First number"
                  value={basicCalc.a}
                  onChange={(e) => setBasicCalc({ ...basicCalc, a: e.target.value })}
                />
                <Select value={basicCalc.operation} onValueChange={(value) => setBasicCalc({ ...basicCalc, operation: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+">+</SelectItem>
                    <SelectItem value="-">−</SelectItem>
                    <SelectItem value="*">×</SelectItem>
                    <SelectItem value="/">÷</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Second number"
                  value={basicCalc.b}
                  onChange={(e) => setBasicCalc({ ...basicCalc, b: e.target.value })}
                />
              </div>
              <Button onClick={calculateBasic} className="w-full">Calculate</Button>
            </div>
          )}

          {activeCalculator === 'currency' && (
            <div className="space-y-4">
              <div>
                <Label>Amount</Label>
                <Input
                  type="number"
                  value={currencyCalc.amount}
                  onChange={(e) => setCurrencyCalc({ ...currencyCalc, amount: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>From</Label>
                  <Select value={currencyCalc.from} onValueChange={(value) => setCurrencyCalc({ ...currencyCalc, from: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="JPY">JPY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>To</Label>
                  <Select value={currencyCalc.to} onValueChange={(value) => setCurrencyCalc({ ...currencyCalc, to: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="JPY">JPY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Exchange Rate</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={currencyCalc.rate}
                  onChange={(e) => setCurrencyCalc({ ...currencyCalc, rate: e.target.value })}
                />
              </div>
              <Button onClick={calculateCurrency} className="w-full">Convert</Button>
            </div>
          )}

          {activeCalculator === 'loan' && (
            <div className="space-y-4">
              <div>
                <Label>Principal Amount ($)</Label>
                <Input
                  type="number"
                  value={loanCalc.principal}
                  onChange={(e) => setLoanCalc({ ...loanCalc, principal: e.target.value })}
                />
              </div>
              <div>
                <Label>Annual Interest Rate (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={loanCalc.rate}
                  onChange={(e) => setLoanCalc({ ...loanCalc, rate: e.target.value })}
                />
              </div>
              <div>
                <Label>Loan Term (Years)</Label>
                <Input
                  type="number"
                  value={loanCalc.term}
                  onChange={(e) => setLoanCalc({ ...loanCalc, term: e.target.value })}
                />
              </div>
              <Button onClick={calculateLoan} className="w-full">Calculate</Button>
            </div>
          )}

          {activeCalculator === 'tax' && (
            <div className="space-y-4">
              <div>
                <Label>Income Amount ($)</Label>
                <Input
                  type="number"
                  value={taxCalc.income}
                  onChange={(e) => setTaxCalc({ ...taxCalc, income: e.target.value })}
                />
              </div>
              <div>
                <Label>Tax Rate (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={taxCalc.taxRate}
                  onChange={(e) => setTaxCalc({ ...taxCalc, taxRate: e.target.value })}
                />
              </div>
              <div>
                <Label>Tax Type</Label>
                <Select value={taxCalc.taxType} onValueChange={(value) => setTaxCalc({ ...taxCalc, taxType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income Tax</SelectItem>
                    <SelectItem value="vat">VAT/Sales Tax</SelectItem>
                    <SelectItem value="property">Property Tax</SelectItem>
                    <SelectItem value="capital">Capital Gains</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={calculateTax} className="w-full">Calculate</Button>
            </div>
          )}

          {activeCalculator === 'savings' && (
            <div className="space-y-4">
              <div>
                <Label>Target Amount ($)</Label>
                <Input
                  type="number"
                  value={savingsCalc.target}
                  onChange={(e) => setSavingsCalc({ ...savingsCalc, target: e.target.value })}
                />
              </div>
              <div>
                <Label>Current Savings ($)</Label>
                <Input
                  type="number"
                  value={savingsCalc.current}
                  onChange={(e) => setSavingsCalc({ ...savingsCalc, current: e.target.value })}
                />
              </div>
              <div>
                <Label>Monthly Contribution ($)</Label>
                <Input
                  type="number"
                  value={savingsCalc.monthly}
                  onChange={(e) => setSavingsCalc({ ...savingsCalc, monthly: e.target.value })}
                />
              </div>
              <Button onClick={calculateSavingsGoal} className="w-full">Calculate</Button>
            </div>
          )}

          {activeCalculator === 'compound' && (
            <div className="space-y-4">
              <div>
                <Label>Principal Amount ($)</Label>
                <Input
                  type="number"
                  value={compoundCalc.principal}
                  onChange={(e) => setCompoundCalc({ ...compoundCalc, principal: e.target.value })}
                />
              </div>
              <div>
                <Label>Annual Interest Rate (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={compoundCalc.rate}
                  onChange={(e) => setCompoundCalc({ ...compoundCalc, rate: e.target.value })}
                />
              </div>
              <div>
                <Label>Time Period (Years)</Label>
                <Input
                  type="number"
                  value={compoundCalc.years}
                  onChange={(e) => setCompoundCalc({ ...compoundCalc, years: e.target.value })}
                />
              </div>
              <div>
                <Label>Compounding Frequency</Label>
                <Select value={compoundCalc.frequency} onValueChange={(value) => setCompoundCalc({ ...compoundCalc, frequency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Annually</SelectItem>
                    <SelectItem value="2">Semi-Annually</SelectItem>
                    <SelectItem value="4">Quarterly</SelectItem>
                    <SelectItem value="12">Monthly</SelectItem>
                    <SelectItem value="365">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={calculateCompoundInterest} className="w-full">Calculate</Button>
            </div>
          )}

          {activeCalculator === 'splitter' && (
            <div className="space-y-4">
              <div>
                <Label>Total Amount ($)</Label>
                <Input
                  type="number"
                  value={splitterCalc.total}
                  onChange={(e) => setSplitterCalc({ ...splitterCalc, total: e.target.value })}
                />
              </div>
              <div>
                <Label>Number of People</Label>
                <Input
                  type="number"
                  min="1"
                  value={splitterCalc.people}
                  onChange={(e) => setSplitterCalc({ ...splitterCalc, people: e.target.value })}
                />
              </div>
              <div>
                <Label>Tip Percentage (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={splitterCalc.tip}
                  onChange={(e) => setSplitterCalc({ ...splitterCalc, tip: e.target.value })}
                />
              </div>
              <Button onClick={calculateExpenseSplit} className="w-full">Calculate</Button>
            </div>
          )}

          {activeCalculator === 'breakeven' && (
            <div className="space-y-4">
              <div>
                <Label>Fixed Costs ($)</Label>
                <Input
                  type="number"
                  value={breakevenCalc.fixedCosts}
                  onChange={(e) => setBreakevenCalc({ ...breakevenCalc, fixedCosts: e.target.value })}
                />
              </div>
              <div>
                <Label>Variable Cost per Unit ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={breakevenCalc.variableCost}
                  onChange={(e) => setBreakevenCalc({ ...breakevenCalc, variableCost: e.target.value })}
                />
              </div>
              <div>
                <Label>Selling Price per Unit ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={breakevenCalc.price}
                  onChange={(e) => setBreakevenCalc({ ...breakevenCalc, price: e.target.value })}
                />
              </div>
              <Button onClick={calculateBreakEven} className="w-full">Calculate</Button>
            </div>
          )}

          {activeCalculator === 'profit' && (
            <div className="space-y-4">
              <div>
                <Label>Revenue ($)</Label>
                <Input
                  type="number"
                  value={profitCalc.revenue}
                  onChange={(e) => setProfitCalc({ ...profitCalc, revenue: e.target.value })}
                />
              </div>
              <div>
                <Label>Costs ($)</Label>
                <Input
                  type="number"
                  value={profitCalc.costs}
                  onChange={(e) => setProfitCalc({ ...profitCalc, costs: e.target.value })}
                />
              </div>
              <div>
                <Label>Margin Type</Label>
                <Select value={profitCalc.type} onValueChange={(value) => setProfitCalc({ ...profitCalc, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gross">Gross Margin</SelectItem>
                    <SelectItem value="net">Net Margin</SelectItem>
                    <SelectItem value="operating">Operating Margin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={calculateProfitMargin} className="w-full">Calculate</Button>
            </div>
          )}

          {activeCalculator === 'depreciation' && (
            <div className="space-y-4">
              <div>
                <Label>Asset Cost ($)</Label>
                <Input
                  type="number"
                  value={depreciationCalc.cost}
                  onChange={(e) => setDepreciationCalc({ ...depreciationCalc, cost: e.target.value })}
                />
              </div>
              <div>
                <Label>Salvage Value ($)</Label>
                <Input
                  type="number"
                  value={depreciationCalc.salvage}
                  onChange={(e) => setDepreciationCalc({ ...depreciationCalc, salvage: e.target.value })}
                />
              </div>
              <div>
                <Label>Useful Life (Years)</Label>
                <Input
                  type="number"
                  value={depreciationCalc.years}
                  onChange={(e) => setDepreciationCalc({ ...depreciationCalc, years: e.target.value })}
                />
              </div>
              <div>
                <Label>Depreciation Method</Label>
                <Select value={depreciationCalc.method} onValueChange={(value) => setDepreciationCalc({ ...depreciationCalc, method: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="straight">Straight Line</SelectItem>
                    <SelectItem value="declining">Declining Balance</SelectItem>
                    <SelectItem value="units">Units of Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={calculateDepreciation} className="w-full">Calculate</Button>
            </div>
          )}
        </Card>

        {/* Results */}
        <Card className="p-6" id="calculator-results">
          <h3 className="text-lg font-semibold mb-4">Results</h3>
          
          {results[activeCalculator] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {Object.entries(results[activeCalculator]).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="font-bold text-primary">{value}</span>
                </div>
              ))}
            </motion.div>
          )}

          {!results[activeCalculator] && (
            <div className="text-center text-muted-foreground py-8">
              Enter values and calculate to see results
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CoreAccountingTools;
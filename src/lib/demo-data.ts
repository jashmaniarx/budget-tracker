// Demo Data Generator for Budget Tracker - Production Scale
import { v4 as uuidv4 } from 'uuid';
import { Transaction, Account, Category, KPI, ChartData, ForecastData } from '@/types';

// Generate demo transactions (1000+ for performance testing)
export const generateDemoTransactions = (count: number = 1000): Transaction[] => {
  const categories = [
    'Groceries', 'Transportation', 'Utilities', 'Entertainment', 'Healthcare',
    'Education', 'Shopping', 'Dining', 'Travel', 'Insurance', 'Investment',
    'Salary', 'Freelance', 'Interest', 'Dividends', 'Rental Income'
  ];
  
  const accounts = ['Checking', 'Savings', 'Credit Card', 'Investment'];
  const descriptions = {
    'Groceries': ['Whole Foods', 'Trader Joes', 'Walmart', 'Target', 'Local Market'],
    'Transportation': ['Uber', 'Gas Station', 'Public Transit', 'Car Maintenance', 'Parking'],
    'Utilities': ['Electric Bill', 'Water Bill', 'Internet', 'Phone', 'Gas Bill'],
    'Entertainment': ['Netflix', 'Movie Theater', 'Concert', 'Gaming', 'Books'],
    'Dining': ['Restaurant', 'Coffee Shop', 'Food Delivery', 'Bar', 'Fast Food'],
    'Salary': ['Monthly Salary', 'Bonus', 'Commission', 'Overtime Pay'],
    'Investment': ['Stock Purchase', 'Bond Purchase', 'Mutual Fund', 'ETF', '401k Contribution']
  };

  const transactions: Transaction[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const isIncome = ['Salary', 'Freelance', 'Interest', 'Dividends', 'Rental Income'].includes(category);
    const baseAmount = isIncome ? 
      Math.random() * 5000 + 500 : // Income: $500-$5500
      Math.random() * 300 + 10;   // Expense: $10-$310
    
    const daysBack = Math.floor(Math.random() * 365);
    const transactionDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    
    const transaction: Transaction = {
      id: uuidv4(),
      date: transactionDate.toISOString().split('T')[0],
      amount: Math.round(baseAmount * 100) / 100,
      type: isIncome ? 'income' : 'expense',
      category,
      account: accounts[Math.floor(Math.random() * accounts.length)],
      description: descriptions[category as keyof typeof descriptions]?.[
        Math.floor(Math.random() * (descriptions[category as keyof typeof descriptions]?.length || 1))
      ] || category,
      tags: [],
      isRecurring: Math.random() > 0.8,
      isReconciled: Math.random() > 0.1,
      createdAt: transactionDate.toISOString(),
      updatedAt: transactionDate.toISOString(),
    };

    // Add some tags randomly
    if (Math.random() > 0.7) {
      const tags = ['business', 'personal', 'tax-deductible', 'subscription', 'one-time'];
      transaction.tags = [tags[Math.floor(Math.random() * tags.length)]];
    }

    transactions.push(transaction);
  }

  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const demoAccounts: Account[] = [
  {
    id: 'acc-1',
    name: 'Main Checking',
    type: 'checking',
    balance: 12847.32,
    currency: 'USD',
    isActive: true,
    bankName: 'Chase Bank',
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 'acc-2',
    name: 'Emergency Savings',
    type: 'savings',
    balance: 25000.00,
    currency: 'USD',
    isActive: true,
    bankName: 'Ally Bank',
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 'acc-3',
    name: 'Investment Portfolio',
    type: 'investment',
    balance: 45230.18,
    currency: 'USD',
    isActive: true,
    bankName: 'Fidelity',
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 'acc-4',
    name: 'Credit Card',
    type: 'credit',
    balance: -2340.45,
    currency: 'USD',
    isActive: true,
    bankName: 'Chase',
    createdAt: '2023-01-01T00:00:00Z',
  },
];

export const demoCategories: Category[] = [
  { id: 'cat-1', name: 'Groceries', type: 'expense', color: '#10b981', icon: '🛒', subcategories: ['Produce', 'Meat', 'Dairy'], budgetAmount: 600, isActive: true },
  { id: 'cat-2', name: 'Transportation', type: 'expense', color: '#3b82f6', icon: '🚗', subcategories: ['Gas', 'Maintenance', 'Parking'], budgetAmount: 400, isActive: true },
  { id: 'cat-3', name: 'Utilities', type: 'expense', color: '#f59e0b', icon: '💡', subcategories: ['Electric', 'Gas', 'Water', 'Internet'], budgetAmount: 300, isActive: true },
  { id: 'cat-4', name: 'Entertainment', type: 'expense', color: '#8b5cf6', icon: '🎬', subcategories: ['Movies', 'Games', 'Concerts'], budgetAmount: 200, isActive: true },
  { id: 'cat-5', name: 'Salary', type: 'income', color: '#059669', icon: '💰', subcategories: ['Base', 'Bonus', 'Overtime'], isActive: true },
  { id: 'cat-6', name: 'Investment', type: 'income', color: '#dc2626', icon: '📈', subcategories: ['Dividends', 'Capital Gains'], isActive: true },
];

export const calculateKPIs = (transactions: Transaction[]): KPI[] => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const lastMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
  });

  const currentIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const currentExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const lastIncome = lastMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const lastExpenses = lastMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netWorth = demoAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const savingsRate = currentIncome > 0 ? ((currentIncome - currentExpenses) / currentIncome) * 100 : 0;

  return [
    {
      id: 'kpi-1',
      name: 'Total Income',
      value: currentIncome,
      previousValue: lastIncome,
      change: currentIncome - lastIncome,
      changePercent: lastIncome > 0 ? ((currentIncome - lastIncome) / lastIncome) * 100 : 0,
      trend: currentIncome > lastIncome ? 'up' : currentIncome < lastIncome ? 'down' : 'stable',
      format: 'currency',
      description: 'Total income for current month',
    },
    {
      id: 'kpi-2',
      name: 'Total Expenses',
      value: currentExpenses,
      previousValue: lastExpenses,
      change: currentExpenses - lastExpenses,
      changePercent: lastExpenses > 0 ? ((currentExpenses - lastExpenses) / lastExpenses) * 100 : 0,
      trend: currentExpenses > lastExpenses ? 'up' : currentExpenses < lastExpenses ? 'down' : 'stable',
      format: 'currency',
      description: 'Total expenses for current month',
    },
    {
      id: 'kpi-3',
      name: 'Net Worth',
      value: netWorth,
      trend: 'up',
      format: 'currency',
      description: 'Total value of all accounts',
    },
    {
      id: 'kpi-4',
      name: 'Savings Rate',
      value: savingsRate,
      trend: savingsRate > 20 ? 'up' : savingsRate > 10 ? 'stable' : 'down',
      format: 'percentage',
      description: 'Percentage of income saved',
    },
    {
      id: 'kpi-5',
      name: 'Monthly Burn Rate',
      value: currentExpenses / 30,
      trend: 'stable',
      format: 'currency',
      description: 'Average daily spending',
    },
    {
      id: 'kpi-6',
      name: 'Emergency Fund Runway',
      value: Math.floor((demoAccounts.find(a => a.type === 'savings')?.balance || 0) / (currentExpenses || 1)),
      trend: 'up',
      format: 'number',
      description: 'Months of expenses covered by emergency fund',
    },
  ];
};

export const generateChartData = (transactions: Transaction[]): ChartData[] => {
  const monthlyData: { [key: string]: { income: number; expenses: number } } = {};
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expenses: 0 };
    }
    
    if (transaction.type === 'income') {
      monthlyData[monthKey].income += transaction.amount;
    } else if (transaction.type === 'expense') {
      monthlyData[monthKey].expenses += transaction.amount;
    }
  });

  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12) // Last 12 months
    .map(([month, data]) => ({
      name: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      income: Math.round(data.income),
      expenses: Math.round(data.expenses),
      net: Math.round(data.income - data.expenses),
      value: Math.round(data.income - data.expenses),
    }));
};

export const generateForecastData = (transactions: Transaction[]): ForecastData[] => {
  // Simple linear forecast - in production this would use ML
  const monthlyData = generateChartData(transactions);
  const lastSixMonths = monthlyData.slice(-6);
  
  if (lastSixMonths.length < 3) return [];

  // Calculate trend
  const avgIncome = lastSixMonths.reduce((sum, d) => sum + (d.income || 0), 0) / lastSixMonths.length;
  const avgExpenses = lastSixMonths.reduce((sum, d) => sum + (d.expenses || 0), 0) / lastSixMonths.length;
  const avgNet = avgIncome - avgExpenses;

  // Generate next 6 months forecast
  const forecast: ForecastData[] = [];
  const now = new Date();
  
  for (let i = 1; i <= 6; i++) {
    const futureDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const seasonalMultiplier = 0.9 + (Math.random() * 0.2); // ±10% seasonal variation
    const predicted = avgNet * seasonalMultiplier;
    const confidence = Math.abs(predicted) * 0.2; // ±20% confidence interval

    forecast.push({
      date: futureDate.toISOString().split('T')[0],
      predicted: Math.round(predicted),
      confidence: {
        lower: Math.round(predicted - confidence),
        upper: Math.round(predicted + confidence),
      },
    });
  }

  return forecast;
};

// Category breakdown for pie charts
export const generateCategoryBreakdown = (transactions: Transaction[]): ChartData[] => {
  const categoryTotals: { [key: string]: number } = {};
  
  transactions
    .filter(t => t.type === 'expense')
    .forEach(transaction => {
      categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
    });

  return Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10) // Top 10 categories
    .map(([name, value]) => ({
      name,
      value: Math.round(value),
    }));
};

// Initialize demo data
export const demoTransactions = generateDemoTransactions(1000);
export const demoKPIs = calculateKPIs(demoTransactions);
export const demoChartData = generateChartData(demoTransactions);
export const demoForecastData = generateForecastData(demoTransactions);
export const demoCategoryData = generateCategoryBreakdown(demoTransactions);
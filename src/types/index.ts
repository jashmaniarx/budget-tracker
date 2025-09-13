// Budget Tracker Core Types - Production Ready
export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  subcategory?: string;
  account: string;
  description: string;
  tags: string[];
  isRecurring: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  splits?: TransactionSplit[];
  attachments?: string[];
  isReconciled: boolean;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export interface TransactionSplit {
  id: string;
  amount: number;
  category: string;
  description: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'loan' | 'cash';
  balance: number;
  currency: string;
  isActive: boolean;
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
  subcategories: string[];
  budgetAmount?: number;
  isActive: boolean;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface KPI {
  id: string;
  name: string;
  value: number;
  previousValue?: number;
  change?: number;
  changePercent?: number;
  trend: 'up' | 'down' | 'stable';
  format: 'currency' | 'percentage' | 'number';
  description: string;
}

export interface ChartData {
  name: string;
  value: number;
  date?: string;
  category?: string;
  [key: string]: any;
}

export interface ForecastData {
  date: string;
  predicted: number;
  confidence: {
    lower: number;
    upper: number;
  };
  actual?: number;
}

export interface ReconciliationItem {
  id: string;
  transactionId: string;
  statementAmount: number;
  transactionAmount: number;
  difference: number;
  status: 'matched' | 'unmatched' | 'pending';
  matchedDate?: string;
}

export interface CalculatorState {
  display: string;
  previousValue: number;
  operation: string | null;
  waitingForOperand: boolean;
  memory: number;
}

export interface Filter {
  dateRange: {
    start: string;
    end: string;
  };
  accounts: string[];
  categories: string[];
  types: string[];
  amountRange: {
    min: number;
    max: number;
  };
  tags: string[];
  searchQuery: string;
}

export interface DashboardConfig {
  layout: 'default' | 'compact' | 'detailed';
  widgets: string[];
  refreshInterval: number;
  defaultDateRange: string;
}

export interface AuditEntry {
  id: string;
  entityType: 'transaction' | 'account' | 'category' | 'budget';
  entityId: string;
  action: 'created' | 'updated' | 'deleted';
  changes: Record<string, any>;
  timestamp: string;
  userId: string;
}

export interface AutoRule {
  id: string;
  name: string;
  conditions: {
    field: string;
    operator: 'equals' | 'contains' | 'starts_with' | 'regex';
    value: string;
  }[];
  actions: {
    field: string;
    value: string;
  }[];
  isActive: boolean;
  priority: number;
}

export interface Alert {
  id: string;
  type: 'budget_exceeded' | 'low_balance' | 'unusual_spending' | 'bill_due';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export type TimeFrame = '7d' | '30d' | '90d' | '1y' | 'all' | 'custom';
export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'waterfall' | 'heatmap';
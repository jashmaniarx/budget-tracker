import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  PieChart, 
  Calculator,
  FileText,
  Filter,
  Download,
  Plus,
  RefreshCw,
  Settings,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import KPICard from '@/components/ui/kpi-card';
import InteractiveChart from '@/components/charts/interactive-chart';
import BudgetCalculator from '@/components/calculator/budget-calculator';
import TransactionTable from '@/components/transactions/transaction-table';
import { 
  demoKPIs, 
  demoChartData, 
  demoCategoryData, 
  demoTransactions,
  demoForecastData 
} from '@/lib/demo-data';
import CoreAccountingTools from '@/components/calculators/core-accounting-tools';
import BudgetManagementTools from '@/components/calculators/budget-management-tools';
import AdvancedFinancialTools from '@/components/calculators/advanced-financial-tools';
import TransactionManager from '@/components/financial-hub/transaction-manager';
import { TimeFrame } from '@/types';

export const MainDashboard: React.FC = () => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>('30d');
  const [showCalculator, setShowCalculator] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [transactions, setTransactions] = useState(demoTransactions);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const timeFrameOptions: { value: TimeFrame; label: string }[] = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' },
    { value: 'all', label: 'All Time' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="dashboard" className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-6">
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
        >
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Financial Dashboard
            </h2>
            <p className="text-muted-foreground">
              Complete overview of your financial health and performance
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4 lg:mt-0">
            {/* Time Frame Selector */}
            <div className="flex bg-muted/50 rounded-lg p-1">
              {timeFrameOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setSelectedTimeFrame(option.value)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    selectedTimeFrame === option.value
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCalculator(!showCalculator)}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculator
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            <Button size="sm" className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Content Area */}
          <div className="col-span-12 lg:col-span-9">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* KPI Cards Grid */}
              <motion.div variants={itemVariants}>
                <div className="bento-grid mb-6">
                  {demoKPIs.map((kpi, index) => (
                    <motion.div
                      key={kpi.id}
                      variants={itemVariants}
                      className={`${
                        index === 0 || index === 1 ? 'bento-item-md' : 'bento-item-sm'
                      }`}
                    >
                      <KPICard kpi={kpi} size={index < 2 ? 'md' : 'sm'} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Chart Tabs */}
              <motion.div variants={itemVariants}>
                <Tabs defaultValue="overview" className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <TabsList className="bg-muted/50">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="categories">Categories</TabsTrigger>
                      <TabsTrigger value="forecast">Forecast</TabsTrigger>
                      <TabsTrigger value="comparison">Comparison</TabsTrigger>
                    </TabsList>

                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>

                  <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <InteractiveChart
                        data={demoChartData}
                        title="Income vs Expenses"
                        subtitle="Monthly comparison for the last 12 months"
                        type="bar"
                        dataKeys={['income', 'expenses']}
                        height={350}
                      />
                      <InteractiveChart
                        data={demoChartData}
                        title="Net Worth Trend"
                        subtitle="Your financial growth over time"
                        type="area"
                        dataKeys={['net']}
                        height={350}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="categories" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <InteractiveChart
                        data={demoCategoryData}
                        title="Expense Categories"
                        subtitle="Breakdown of spending by category"
                        type="pie"
                        height={350}
                      />
                      <InteractiveChart
                        data={demoCategoryData.slice(0, 6)}
                        title="Top Categories"
                        subtitle="Your biggest expense categories"
                        type="bar"
                        height={350}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="forecast" className="space-y-6">
                    <InteractiveChart
                      data={demoForecastData.map(f => ({ 
                        name: new Date(f.date).toLocaleDateString('en-US', { month: 'short' }),
                        predicted: f.predicted,
                        lower: f.confidence.lower,
                        upper: f.confidence.upper,
                        value: f.predicted, // Required by ChartData type
                      }))}
                      title="Financial Forecast"
                      subtitle="AI-powered predictions for the next 6 months"
                      type="line"
                      dataKeys={['predicted', 'lower', 'upper']}
                      height={350}
                    />
                  </TabsContent>

                  <TabsContent value="comparison" className="space-y-6">
                    <InteractiveChart
                      data={demoChartData}
                      title="Year-over-Year Comparison"
                      subtitle="Compare performance against previous periods"
                      type="line"
                      dataKeys={['income', 'expenses']}
                      height={350}
                    />
                  </TabsContent>
                </Tabs>
              </motion.div>

              {/* Financial Hub Sections */}
              {activeSection === 'calculators' && (
                <motion.div variants={itemVariants}>
                  <CoreAccountingTools />
                </motion.div>
              )}

              {activeSection === 'budget-tools' && (
                <motion.div variants={itemVariants}>
                  <BudgetManagementTools />
                </motion.div>
              )}

              {activeSection === 'advanced-tools' && (
                <motion.div variants={itemVariants}>
                  <AdvancedFinancialTools />
                </motion.div>
              )}

              {activeSection === 'transactions' && (
                <motion.div variants={itemVariants}>
                  <TransactionManager 
                    transactions={transactions}
                    onTransactionsChange={setTransactions}
                  />
                </motion.div>
              )}

              {/* Recent Transactions */}
              <motion.div variants={itemVariants}>
                <div className="card-gradient rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      Recent Transactions
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">
                        {demoTransactions.length.toLocaleString()} total
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View All
                      </Button>
                    </div>
                  </div>
                  
                  <TransactionTable 
                    transactions={demoTransactions.slice(0, 10)}
                    showPagination={false}
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Calculator Widget */}
              {showCalculator && (
                <motion.div
                  variants={itemVariants}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <BudgetCalculator />
                </motion.div>
              )}

              {/* Quick Actions */}
              <motion.div variants={itemVariants} className="card-gradient rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Financial Tools Hub
                </h3>
                <div className="space-y-3">
                  {[
                    { icon: Calculator, label: 'Core Calculators', section: 'calculators', color: 'bg-blue-500' },
                    { icon: PieChart, label: 'Budget Tools', section: 'budget-tools', color: 'bg-green-500' },
                    { icon: TrendingUp, label: 'Advanced Analytics', section: 'advanced-tools', color: 'bg-purple-500' },
                    { icon: Plus, label: 'Manage Transactions', section: 'transactions', color: 'bg-orange-500' },
                  ].map((action, index) => (
                    <Button
                      key={index}
                      variant={activeSection === action.section ? "default" : "ghost"}
                      className="w-full justify-start p-3 h-auto"
                      onClick={() => setActiveSection(action.section)}
                    >
                      <div className={`p-2 rounded-lg ${action.color} mr-3`}>
                        <action.icon className="h-4 w-4 text-white" />
                      </div>
                      {action.label}
                    </Button>
                  ))}
                </div>
              </motion.div>

              {/* Alerts */}
              <motion.div variants={itemVariants} className="card-gradient rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Alerts & Notifications
                </h3>
                <div className="space-y-3">
                  {[
                    { type: 'warning', message: 'Budget exceeded in Dining category', time: '2h ago' },
                    { type: 'info', message: 'Monthly report is ready', time: '1d ago' },
                    { type: 'success', message: 'Savings goal reached!', time: '3d ago' },
                  ].map((alert, index) => (
                    <div key={index} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex items-start space-x-2">
                        <Bell className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{alert.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainDashboard;
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Target,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  Settings,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InteractiveChart from '@/components/charts/interactive-chart';
import { Transaction, ChartData, ForecastData } from '@/types';
import { cn } from '@/lib/utils';

interface PredictiveModelsProps {
  transactions: Transaction[];
  className?: string;
}

// Simple ML Models for Demo (In production, these would use real ML backends)
class SimpleForecastingModel {
  static linearTrend(data: number[]): { slope: number; intercept: number; r2: number } {
    const n = data.length;
    const xSum = (n * (n + 1)) / 2;
    const ySum = data.reduce((sum, val) => sum + val, 0);
    const xySum = data.reduce((sum, val, index) => sum + val * (index + 1), 0);
    const x2Sum = (n * (n + 1) * (2 * n + 1)) / 6;

    const slope = (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum);
    const intercept = (ySum - slope * xSum) / n;

    // Calculate R-squared
    const yMean = ySum / n;
    const ssRes = data.reduce((sum, val, index) => {
      const predicted = slope * (index + 1) + intercept;
      return sum + Math.pow(val - predicted, 2);
    }, 0);
    const ssTot = data.reduce((sum, val) => sum + Math.pow(val - yMean, 2), 0);
    const r2 = 1 - ssRes / ssTot;

    return { slope, intercept, r2 };
  }

  static seasonalDecomposition(data: number[], period: number = 12) {
    const trend = [];
    const seasonal = [];
    const residual = [];

    // Simple moving average for trend
    for (let i = 0; i < data.length; i++) {
      if (i >= period / 2 && i < data.length - period / 2) {
        const sum = data.slice(i - Math.floor(period / 2), i + Math.ceil(period / 2)).reduce((a, b) => a + b, 0);
        trend.push(sum / period);
      } else {
        trend.push(data[i]);
      }
    }

    // Calculate seasonal component
    const seasonalPattern = new Array(period).fill(0);
    const seasonalCount = new Array(period).fill(0);

    for (let i = 0; i < data.length; i++) {
      const seasonIndex = i % period;
      seasonalPattern[seasonIndex] += data[i] - trend[i];
      seasonalCount[seasonIndex]++;
    }

    for (let i = 0; i < period; i++) {
      seasonalPattern[i] = seasonalCount[i] > 0 ? seasonalPattern[i] / seasonalCount[i] : 0;
    }

    // Apply seasonal pattern and calculate residual
    for (let i = 0; i < data.length; i++) {
      const seasonIndex = i % period;
      seasonal.push(seasonalPattern[seasonIndex]);
      residual.push(data[i] - trend[i] - seasonal[i]);
    }

    return { trend, seasonal, residual, seasonalPattern };
  }

  static anomalyDetection(data: number[], threshold: number = 2): number[] {
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const stdDev = Math.sqrt(
      data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length
    );

    return data.map((val, index) => {
      const zScore = Math.abs(val - mean) / stdDev;
      return zScore > threshold ? index : -1;
    }).filter(index => index !== -1);
  }
}

export const PredictiveModels: React.FC<PredictiveModelsProps> = ({
  transactions,
  className
}) => {
  const [selectedModel, setSelectedModel] = useState<'forecast' | 'anomaly' | 'recommendations'>('forecast');
  const [isTraining, setIsTraining] = useState(false);
  const [confidence, setConfidence] = useState(0.85);

  // Process transaction data for ML models
  const processedData = useMemo(() => {
    // Group transactions by month
    const monthlyData: { [key: string]: { income: number; expenses: number; net: number } } = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expenses: 0, net: 0 };
      }
      
      if (transaction.type === 'income') {
        monthlyData[monthKey].income += transaction.amount;
      } else if (transaction.type === 'expense') {
        monthlyData[monthKey].expenses += transaction.amount;
      }
      
      monthlyData[monthKey].net = monthlyData[monthKey].income - monthlyData[monthKey].expenses;
    });

    const sortedMonths = Object.keys(monthlyData).sort();
    const monthlyExpenses = sortedMonths.map(month => monthlyData[month].expenses);
    const monthlyIncome = sortedMonths.map(month => monthlyData[month].income);
    const monthlyNet = sortedMonths.map(month => monthlyData[month].net);

    return {
      months: sortedMonths,
      expenses: monthlyExpenses,
      income: monthlyIncome,
      net: monthlyNet,
      monthlyData
    };
  }, [transactions]);

  // Forecasting Model
  const forecastData = useMemo(() => {
    if (processedData.expenses.length < 3) return [];

    const expenseTrend = SimpleForecastingModel.linearTrend(processedData.expenses);
    const incomeTrend = SimpleForecastingModel.linearTrend(processedData.income);
    
    // Generate 6 months of forecast
    const forecast: ChartData[] = [];
    const lastMonthIndex = processedData.expenses.length;

    for (let i = 1; i <= 6; i++) {
      const futureIndex = lastMonthIndex + i;
      const predictedExpenses = expenseTrend.slope * futureIndex + expenseTrend.intercept;
      const predictedIncome = incomeTrend.slope * futureIndex + incomeTrend.intercept;
      
      // Add some realistic variance
      const variance = 0.1; // 10% variance
      const expenseVariance = predictedExpenses * variance;
      const incomeVariance = predictedIncome * variance;

      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + i);

      forecast.push({
        name: futureDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        value: Math.round(predictedIncome - predictedExpenses),
        expenses: Math.round(predictedExpenses),
        income: Math.round(predictedIncome),
        expensesLower: Math.round(predictedExpenses - expenseVariance),
        expensesUpper: Math.round(predictedExpenses + expenseVariance),
        incomeLower: Math.round(predictedIncome - incomeVariance),
        incomeUpper: Math.round(predictedIncome + incomeVariance),
        confidence: Math.max(0.6, confidence - (i * 0.05)), // Decreasing confidence over time
      });
    }

    return forecast;
  }, [processedData, confidence]);

  // Anomaly Detection
  const anomalies = useMemo(() => {
    const expenseAnomalies = SimpleForecastingModel.anomalyDetection(processedData.expenses, 2);
    const incomeAnomalies = SimpleForecastingModel.anomalyDetection(processedData.income, 2);

    return {
      expenses: expenseAnomalies.map(index => ({
        month: processedData.months[index],
        value: processedData.expenses[index],
        type: 'expense' as const,
        severity: 'high' as const,
      })),
      income: incomeAnomalies.map(index => ({
        month: processedData.months[index],
        value: processedData.income[index],
        type: 'income' as const,
        severity: 'medium' as const,
      })),
    };
  }, [processedData]);

  // Smart Recommendations
  const recommendations = useMemo(() => {
    const avgExpenses = processedData.expenses.reduce((sum, val) => sum + val, 0) / processedData.expenses.length;
    const avgIncome = processedData.income.reduce((sum, val) => sum + val, 0) / processedData.income.length;
    const savingsRate = ((avgIncome - avgExpenses) / avgIncome) * 100;

    const recommendations = [];

    if (savingsRate < 10) {
      recommendations.push({
        type: 'warning',
        title: 'Low Savings Rate',
        description: `Your current savings rate is ${savingsRate.toFixed(1)}%. Consider reducing expenses or increasing income.`,
        impact: 'high',
        actionable: true,
      });
    }

    if (processedData.expenses.slice(-3).some(expense => expense > avgExpenses * 1.2)) {
      recommendations.push({
        type: 'alert',
        title: 'Spending Spike Detected',
        description: 'Recent expenses are 20% above average. Review recent transactions for optimization opportunities.',
        impact: 'medium',
        actionable: true,
      });
    }

    if (savingsRate > 20) {
      recommendations.push({
        type: 'success',
        title: 'Excellent Savings Rate',
        description: `Your ${savingsRate.toFixed(1)}% savings rate is excellent. Consider investing surplus funds for growth.`,
        impact: 'positive',
        actionable: true,
      });
    }

    // Seasonal analysis
    const seasonal = SimpleForecastingModel.seasonalDecomposition(processedData.expenses);
    const maxSeasonalIndex = seasonal.seasonalPattern.indexOf(Math.max(...seasonal.seasonalPattern));
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    recommendations.push({
      type: 'info',
      title: 'Seasonal Spending Pattern',
      description: `Your highest spending typically occurs in ${monthNames[maxSeasonalIndex]}. Plan ahead to manage cash flow.`,
      impact: 'low',
      actionable: false,
    });

    return recommendations;
  }, [processedData]);

  const trainModel = async () => {
    setIsTraining(true);
    // Simulate model training
    await new Promise(resolve => setTimeout(resolve, 2000));
    setConfidence(Math.min(0.95, confidence + 0.05));
    setIsTraining(false);
  };

  const models = [
    { id: 'forecast', label: 'Forecasting', icon: TrendingUp, color: 'text-blue-500' },
    { id: 'anomaly', label: 'Anomaly Detection', icon: AlertTriangle, color: 'text-orange-500' },
    { id: 'recommendations', label: 'AI Recommendations', icon: Brain, color: 'text-purple-500' },
  ];

  return (
    <Card className={cn('p-6', className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">AI-Powered Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Machine learning insights and predictions
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            Confidence: {Math.round(confidence * 100)}%
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={trainModel}
            disabled={isTraining}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isTraining ? 'animate-spin' : ''}`} />
            {isTraining ? 'Training...' : 'Retrain'}
          </Button>
        </div>
      </div>

      <Tabs value={selectedModel} onValueChange={(value) => setSelectedModel(value as any)}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          {models.map(model => (
            <TabsTrigger key={model.id} value={model.id} className="flex items-center space-x-2">
              <model.icon className={`h-4 w-4 ${model.color}`} />
              <span className="hidden sm:inline">{model.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="forecast" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InteractiveChart
              data={forecastData}
              title="Expense Forecast"
              subtitle="6-month prediction with confidence intervals"
              type="line"
              dataKeys={['expenses', 'expensesLower', 'expensesUpper']}
              height={300}
            />
            <InteractiveChart
              data={forecastData}
              title="Income Forecast"
              subtitle="6-month income projection"
              type="area"
              dataKeys={['income', 'incomeLower', 'incomeUpper']}
              height={300}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {forecastData.slice(0, 3).map((month, index) => (
              <Card key={month.name} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground">{month.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {Math.round((month.confidence || 0.8) * 100)}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Expected Net:</span>
                    <span className={`font-medium ${month.value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {month.value >= 0 ? '+' : ''}${month.value?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Income Range:</span>
                    <span className="text-foreground">
                      ${month.incomeLower?.toLocaleString()} - ${month.incomeUpper?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="anomaly" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4">
              <h4 className="font-semibold text-foreground mb-4 flex items-center">
                <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
                Expense Anomalies
              </h4>
              <div className="space-y-3">
                {anomalies.expenses.length > 0 ? (
                  anomalies.expenses.map((anomaly, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div>
                        <div className="font-medium text-foreground">{anomaly.month}</div>
                        <div className="text-sm text-muted-foreground">Unusual spending detected</div>
                      </div>
                      <div className="text-lg font-bold text-orange-600">
                        ${anomaly.value.toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No expense anomalies detected
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-semibold text-foreground mb-4 flex items-center">
                <Activity className="h-4 w-4 text-blue-500 mr-2" />
                Income Anomalies
              </h4>
              <div className="space-y-3">
                {anomalies.income.length > 0 ? (
                  anomalies.income.map((anomaly, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div>
                        <div className="font-medium text-foreground">{anomaly.month}</div>
                        <div className="text-sm text-muted-foreground">Unusual income detected</div>
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        ${anomaly.value.toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No income anomalies detected
                  </div>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          {recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="p-4">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${
                    rec.type === 'warning' ? 'bg-red-100 dark:bg-red-900/20' :
                    rec.type === 'success' ? 'bg-green-100 dark:bg-green-900/20' :
                    rec.type === 'alert' ? 'bg-orange-100 dark:bg-orange-900/20' :
                    'bg-blue-100 dark:bg-blue-900/20'
                  }`}>
                    {rec.type === 'warning' && <AlertTriangle className="h-5 w-5 text-red-600" />}
                    {rec.type === 'success' && <Target className="h-5 w-5 text-green-600" />}
                    {rec.type === 'alert' && <Zap className="h-5 w-5 text-orange-600" />}
                    {rec.type === 'info' && <Brain className="h-5 w-5 text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-foreground">{rec.title}</h4>
                      <Badge variant="outline" className="text-xs capitalize">
                        {rec.impact} Impact
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {rec.description}
                    </p>
                    {rec.actionable && (
                      <Button variant="ghost" size="sm" className="mt-3 p-0 h-auto">
                        Take Action <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default PredictiveModels;
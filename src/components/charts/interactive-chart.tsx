import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { 
  TrendingUp, 
  Download, 
  Maximize2, 
  Filter,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartData, ChartType } from '@/types';
import { cn } from '@/lib/utils';

interface InteractiveChartProps {
  data: ChartData[];
  title: string;
  subtitle?: string;
  type?: ChartType;
  dataKeys?: string[];
  colors?: string[];
  height?: number;
  showControls?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
  enableZoom?: boolean;
  onDataPointClick?: (data: any) => void;
  className?: string;
}

const CHART_COLORS = [
  'hsl(var(--gradient-10))',
  'hsl(var(--gradient-6))',
  'hsl(var(--gradient-3))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--gradient-8))',
];

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  data,
  title,
  subtitle,
  type = 'line',
  dataKeys = ['value'],
  colors = CHART_COLORS,
  height = 300,
  showControls = true,
  showGrid = true,
  showLegend = true,
  enableZoom = false,
  onDataPointClick,
  className,
}) => {
  const [chartType, setChartType] = useState<ChartType>(type);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(dataKeys);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const chartIcons = {
    line: Activity,
    bar: BarChart3,
    area: TrendingUp,
    pie: PieChartIcon,
    waterfall: Target,
    heatmap: Filter,
  };

  const formatValue = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    } else {
      return `$${value.toLocaleString()}`;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="p-3 shadow-lg border bg-popover/95 backdrop-blur-sm">
          <p className="font-medium text-sm text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.dataKey}:</span>
              <span className="font-medium text-foreground">
                {formatValue(entry.value)}
              </span>
            </div>
          ))}
        </Card>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data,
      height,
      onClick: onDataPointClick,
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatValue}
            />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
            {selectedKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 4, fill: colors[index % colors.length] }}
                activeDot={{ r: 6, stroke: colors[index % colors.length], strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatValue}
            />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
            {selectedKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatValue}
            />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
            {selectedKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart {...commonProps}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={Math.min(height * 0.35, 120)}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        );

      default:
        return null;
    }
  };

  const ChartTypeButton = ({ chartTypeOption, icon: Icon }: { chartTypeOption: ChartType; icon: any }) => (
    <Button
      variant={chartType === chartTypeOption ? 'default' : 'ghost'}
      size="sm"
      onClick={() => setChartType(chartTypeOption)}
      className="h-8 w-8 p-0"
    >
      <Icon className="h-4 w-4" />
    </Button>
  );

  const exportChart = () => {
    // Export functionality - would integrate with actual export library
    console.log('Exporting chart:', { title, data, type: chartType });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'chart-container relative',
        isFullscreen && 'fixed inset-4 z-50',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>

        {showControls && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-muted/50 rounded-lg p-1">
              <ChartTypeButton chartTypeOption="line" icon={chartIcons.line} />
              <ChartTypeButton chartTypeOption="bar" icon={chartIcons.bar} />
              <ChartTypeButton chartTypeOption="area" icon={chartIcons.area} />
              <ChartTypeButton chartTypeOption="pie" icon={chartIcons.pie} />
            </div>
            
            <Button variant="ghost" size="sm" onClick={exportChart}>
              <Download className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="w-full" style={{ height: isFullscreen ? '80vh' : height }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Data insights */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {data.length > 0 && (
          <>
            <Badge variant="secondary" className="text-xs">
              {data.length} data points
            </Badge>
            {chartType !== 'pie' && (
              <Badge variant="outline" className="text-xs">
                Range: {formatValue(Math.min(...data.map(d => d.value)))} - {formatValue(Math.max(...data.map(d => d.value)))}
              </Badge>
            )}
          </>
        )}
      </div>

      {isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsFullscreen(false)}
        />
      )}
    </motion.div>
  );
};

export default InteractiveChart;
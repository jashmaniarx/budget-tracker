import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { KPI } from '@/types';
import { cn } from '@/lib/utils';

interface KPICardProps {
  kpi: KPI;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const KPICard: React.FC<KPICardProps> = ({ 
  kpi, 
  className,
  size = 'md'
}) => {
  const formatValue = (value: number, format: KPI['format']) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'number':
        return value.toLocaleString();
      default:
        return value.toString();
    }
  };

  const getTrendIcon = () => {
    switch (kpi.trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = () => {
    switch (kpi.trend) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const textSizes = {
    sm: { title: 'text-sm', value: 'text-lg', change: 'text-xs' },
    md: { title: 'text-sm', value: 'text-2xl', change: 'text-sm' },
    lg: { title: 'text-base', value: 'text-3xl', change: 'text-base' }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className={cn(
        'kpi-card relative overflow-hidden',
        sizeClasses[size],
        className
      )}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <h3 className={cn(
            'font-medium text-muted-foreground',
            textSizes[size].title
          )}>
            {kpi.name}
          </h3>
          {getTrendIcon()}
        </div>

        <div className={cn(
          'font-bold text-foreground mb-2',
          textSizes[size].value
        )}>
          {formatValue(kpi.value, kpi.format)}
        </div>

        {kpi.changePercent !== undefined && (
          <div className="flex items-center space-x-2">
            <span className={cn(
              'font-medium',
              getTrendColor(),
              textSizes[size].change
            )}>
              {kpi.changePercent > 0 ? '+' : ''}{kpi.changePercent.toFixed(1)}%
            </span>
            {kpi.change !== undefined && (
              <span className={cn(
                'text-muted-foreground',
                textSizes[size].change
              )}>
                ({kpi.change > 0 ? '+' : ''}{formatValue(kpi.change, kpi.format)})
              </span>
            )}
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          {kpi.description}
        </p>
      </div>

      {/* Subtle pulse animation for important KPIs */}
      {kpi.trend === 'up' && kpi.changePercent && kpi.changePercent > 10 && (
        <motion.div
          className="absolute inset-0 rounded-xl border border-success/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};

export default KPICard;
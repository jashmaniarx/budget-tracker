import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Delete, Plus, Minus, X, Divide, Percent, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalculatorState } from '@/types';
import { cn } from '@/lib/utils';

interface BudgetCalculatorProps {
  className?: string;
  onValueChange?: (value: number) => void;
  mode?: 'standard' | 'currency' | 'percentage';
}

export const BudgetCalculator: React.FC<BudgetCalculatorProps> = ({
  className,
  onValueChange,
  mode = 'currency'
}) => {
  const [state, setState] = useState<CalculatorState>({
    display: '0',
    previousValue: 0,
    operation: null,
    waitingForOperand: false,
    memory: 0,
  });

  const [history, setHistory] = useState<string[]>([]);

  const inputNumber = useCallback((num: string) => {
    setState(prevState => {
      if (prevState.waitingForOperand) {
        return {
          ...prevState,
          display: num,
          waitingForOperand: false,
        };
      }
      
      const newDisplay = prevState.display === '0' ? num : prevState.display + num;
      return {
        ...prevState,
        display: newDisplay.slice(0, 12), // Limit display length
      };
    });
  }, []);

  const inputDecimal = useCallback(() => {
    setState(prevState => {
      if (prevState.waitingForOperand) {
        return {
          ...prevState,
          display: '0.',
          waitingForOperand: false,
        };
      }
      
      if (prevState.display.indexOf('.') === -1) {
        return {
          ...prevState,
          display: prevState.display + '.',
        };
      }
      
      return prevState;
    });
  }, []);

  const clear = useCallback(() => {
    setState({
      display: '0',
      previousValue: 0,
      operation: null,
      waitingForOperand: false,
      memory: 0,
    });
  }, []);

  const clearEntry = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      display: '0',
    }));
  }, []);

  const performOperation = useCallback((nextOperation: string) => {
    const inputValue = parseFloat(state.display);

    setState(prevState => {
      if (prevState.previousValue === 0) {
        return {
          ...prevState,
          previousValue: inputValue,
          operation: nextOperation,
          waitingForOperand: true,
        };
      }

      if (prevState.operation) {
        const currentValue = prevState.previousValue;
        const newValue = calculate(currentValue, inputValue, prevState.operation);

        // Add to history
        const calculation = `${currentValue} ${getOperationSymbol(prevState.operation)} ${inputValue} = ${newValue}`;
        setHistory(prev => [calculation, ...prev.slice(0, 9)]); // Keep last 10

        onValueChange?.(newValue);

        return {
          ...prevState,
          display: String(newValue),
          previousValue: newValue,
          operation: nextOperation,
          waitingForOperand: true,
        };
      }

      return prevState;
    });
  }, [state.display, onValueChange]);

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      case '%':
        return (firstValue * secondValue) / 100;
      default:
        return secondValue;
    }
  };

  const getOperationSymbol = (operation: string): string => {
    switch (operation) {
      case '+': return '+';
      case '-': return '-';
      case '*': return '×';
      case '/': return '÷';
      case '%': return '%';
      default: return operation;
    }
  };

  const performEquals = useCallback(() => {
    const inputValue = parseFloat(state.display);

    setState(prevState => {
      if (prevState.operation && !prevState.waitingForOperand) {
        const newValue = calculate(prevState.previousValue, inputValue, prevState.operation);
        
        // Add to history
        const calculation = `${prevState.previousValue} ${getOperationSymbol(prevState.operation)} ${inputValue} = ${newValue}`;
        setHistory(prev => [calculation, ...prev.slice(0, 9)]);

        onValueChange?.(newValue);

        return {
          ...prevState,
          display: String(newValue),
          previousValue: 0,
          operation: null,
          waitingForOperand: true,
        };
      }

      return prevState;
    });
  }, [state.display, state.operation, state.previousValue, state.waitingForOperand, onValueChange]);

  const formatDisplay = (value: string): string => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;

    switch (mode) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: value.includes('.') ? 2 : 0,
          maximumFractionDigits: 2,
        }).format(num);
      case 'percentage':
        return `${num.toFixed(2)}%`;
      default:
        return num.toLocaleString();
    }
  };

  const CalculatorButton: React.FC<{
    onClick: () => void;
    className?: string;
    variant?: 'default' | 'operation' | 'special';
    children: React.ReactNode;
  }> = ({ onClick, className, variant = 'default', children }) => {
    const variantClasses = {
      default: 'bg-secondary hover:bg-secondary/80 text-secondary-foreground',
      operation: 'bg-primary hover:bg-primary-hover text-primary-foreground',
      special: 'bg-accent hover:bg-accent/80 text-accent-foreground',
    };

    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="ghost"
          className={cn(
            'h-12 w-full text-lg font-medium transition-all',
            variantClasses[variant],
            className
          )}
          onClick={onClick}
        >
          {children}
        </Button>
      </motion.div>
    );
  };

  return (
    <Card className={cn('p-6 bg-card/50 backdrop-blur border-border/50', className)}>
      <div className="flex items-center space-x-2 mb-4">
        <Calculator className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Budget Calculator</h3>
        <Badge variant="outline" className="text-xs">
          {mode.toUpperCase()}
        </Badge>
      </div>

      {/* Display */}
      <div className="bg-muted/50 rounded-lg p-4 mb-4">
        <div className="text-right">
          <div className="text-2xl font-mono font-bold text-foreground break-all">
            {formatDisplay(state.display)}
          </div>
          {state.operation && (
            <div className="text-sm text-muted-foreground">
              {formatDisplay(String(state.previousValue))} {getOperationSymbol(state.operation)}
            </div>
          )}
        </div>
      </div>

      {/* Calculator Grid */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {/* Row 1 */}
        <CalculatorButton onClick={clear} variant="special">
          AC
        </CalculatorButton>
        <CalculatorButton onClick={clearEntry} variant="special">
          CE
        </CalculatorButton>
        <CalculatorButton onClick={() => performOperation('%')} variant="operation">
          <Percent className="h-4 w-4" />
        </CalculatorButton>
        <CalculatorButton onClick={() => performOperation('/')} variant="operation">
          <Divide className="h-4 w-4" />
        </CalculatorButton>

        {/* Row 2 */}
        <CalculatorButton onClick={() => inputNumber('7')}>7</CalculatorButton>
        <CalculatorButton onClick={() => inputNumber('8')}>8</CalculatorButton>
        <CalculatorButton onClick={() => inputNumber('9')}>9</CalculatorButton>
        <CalculatorButton onClick={() => performOperation('*')} variant="operation">
          <X className="h-4 w-4" />
        </CalculatorButton>

        {/* Row 3 */}
        <CalculatorButton onClick={() => inputNumber('4')}>4</CalculatorButton>
        <CalculatorButton onClick={() => inputNumber('5')}>5</CalculatorButton>
        <CalculatorButton onClick={() => inputNumber('6')}>6</CalculatorButton>
        <CalculatorButton onClick={() => performOperation('-')} variant="operation">
          <Minus className="h-4 w-4" />
        </CalculatorButton>

        {/* Row 4 */}
        <CalculatorButton onClick={() => inputNumber('1')}>1</CalculatorButton>
        <CalculatorButton onClick={() => inputNumber('2')}>2</CalculatorButton>
        <CalculatorButton onClick={() => inputNumber('3')}>3</CalculatorButton>
        <CalculatorButton onClick={() => performOperation('+')} variant="operation">
          <Plus className="h-4 w-4" />
        </CalculatorButton>

        {/* Row 5 */}
        <CalculatorButton onClick={() => inputNumber('0')} className="col-span-2">
          0
        </CalculatorButton>
        <CalculatorButton onClick={inputDecimal}>.</CalculatorButton>
        <CalculatorButton onClick={performEquals} variant="operation">
          =
        </CalculatorButton>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">History</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setHistory([])}
              className="h-6 w-6 p-0"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {history.slice(0, 5).map((calc, index) => (
              <div
                key={index}
                className="text-xs text-muted-foreground font-mono p-1 hover:bg-muted/30 rounded cursor-pointer"
                onClick={() => {
                  const result = calc.split(' = ')[1];
                  if (result) {
                    setState(prev => ({ ...prev, display: result, waitingForOperand: true }));
                  }
                }}
              >
                {calc}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default BudgetCalculator;
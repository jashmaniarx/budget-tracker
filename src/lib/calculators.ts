// Advanced Financial Calculators - Production Ready
export interface LoanCalculatorResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  amortizationSchedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
}

export interface ROICalculatorResult {
  roi: number;
  roiPercentage: number;
  totalReturn: number;
  annualizedReturn: number;
  cagr: number;
}

export interface CompoundInterestResult {
  finalAmount: number;
  totalInterest: number;
  yearlyBreakdown: Array<{
    year: number;
    startBalance: number;
    interest: number;
    endBalance: number;
    totalContributions: number;
  }>;
}

// Loan Payment Calculator with Amortization Schedule
export const calculateLoanPayment = (
  principal: number,
  annualRate: number,
  years: number,
  extraPayment: number = 0
): LoanCalculatorResult => {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  
  // Calculate monthly payment using formula
  const monthlyPayment = 
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);

  let balance = principal;
  const schedule = [];
  let totalPaid = 0;

  for (let month = 1; month <= numPayments && balance > 0; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = Math.min(
      monthlyPayment - interestPayment + extraPayment,
      balance
    );
    
    balance -= principalPayment;
    totalPaid += monthlyPayment + extraPayment;

    schedule.push({
      month,
      payment: monthlyPayment + extraPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, balance),
    });
  }

  return {
    monthlyPayment,
    totalPayment: totalPaid,
    totalInterest: totalPaid - principal,
    amortizationSchedule: schedule,
  };
};

// ROI and CAGR Calculator
export const calculateROI = (
  initialInvestment: number,
  finalValue: number,
  years: number,
  dividends: number = 0
): ROICalculatorResult => {
  const totalReturn = finalValue - initialInvestment + dividends;
  const roi = totalReturn;
  const roiPercentage = (totalReturn / initialInvestment) * 100;
  
  // Calculate CAGR (Compound Annual Growth Rate)
  const cagr = (Math.pow(finalValue / initialInvestment, 1 / years) - 1) * 100;
  
  // Annualized return including dividends
  const annualizedReturn = (Math.pow((finalValue + dividends) / initialInvestment, 1 / years) - 1) * 100;

  return {
    roi,
    roiPercentage,
    totalReturn,
    annualizedReturn,
    cagr,
  };
};

// Compound Interest Calculator with Regular Contributions
export const calculateCompoundInterest = (
  principal: number,
  annualRate: number,
  years: number,
  monthlyContribution: number = 0,
  compoundingFrequency: number = 12 // Monthly compounding
): CompoundInterestResult => {
  const rate = annualRate / 100;
  const yearlyBreakdown = [];
  let currentBalance = principal;
  let totalContributions = principal;

  for (let year = 1; year <= years; year++) {
    const startBalance = currentBalance;
    
    // Calculate compound interest with regular contributions
    for (let period = 1; period <= compoundingFrequency; period++) {
      const periodRate = rate / compoundingFrequency;
      currentBalance = currentBalance * (1 + periodRate) + monthlyContribution;
      totalContributions += monthlyContribution;
    }

    const yearInterest = currentBalance - startBalance - (monthlyContribution * compoundingFrequency);
    
    yearlyBreakdown.push({
      year,
      startBalance,
      interest: yearInterest,
      endBalance: currentBalance,
      totalContributions,
    });
  }

  return {
    finalAmount: currentBalance,
    totalInterest: currentBalance - totalContributions,
    yearlyBreakdown,
  };
};

// Retirement Calculator
export const calculateRetirement = (
  currentAge: number,
  retirementAge: number,
  currentSavings: number,
  monthlyContribution: number,
  expectedReturn: number,
  inflationRate: number = 3
): {
  finalAmount: number;
  monthlyIncomeAt4Percent: number;
  purchasingPowerToday: number;
  shortfall: number;
  recommendedMonthlyContribution: number;
} => {
  const yearsToRetirement = retirementAge - currentAge;
  
  const result = calculateCompoundInterest(
    currentSavings,
    expectedReturn,
    yearsToRetirement,
    monthlyContribution
  );

  // 4% rule for retirement income
  const monthlyIncomeAt4Percent = (result.finalAmount * 0.04) / 12;
  
  // Adjust for inflation
  const inflationMultiplier = Math.pow(1 + inflationRate / 100, yearsToRetirement);
  const purchasingPowerToday = monthlyIncomeAt4Percent / inflationMultiplier;

  // Calculate shortfall (assuming need $5000/month in today's dollars)
  const targetMonthlyIncome = 5000;
  const targetAmount = (targetMonthlyIncome * inflationMultiplier * 12) / 0.04;
  const shortfall = Math.max(0, targetAmount - result.finalAmount);
  
  // Calculate recommended contribution to meet target
  const recommendedMonthlyContribution = shortfall > 0 
    ? calculateRequiredContribution(currentSavings, targetAmount, yearsToRetirement, expectedReturn)
    : monthlyContribution;

  return {
    finalAmount: result.finalAmount,
    monthlyIncomeAt4Percent,
    purchasingPowerToday,
    shortfall,
    recommendedMonthlyContribution,
  };
};

// Helper function to calculate required monthly contribution
const calculateRequiredContribution = (
  presentValue: number,
  futureValue: number,
  years: number,
  annualRate: number
): number => {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  
  const futureValueOfPresentValue = presentValue * Math.pow(1 + monthlyRate, numPayments);
  const remainingAmount = futureValue - futureValueOfPresentValue;
  
  if (remainingAmount <= 0) return 0;
  
  // Future value of annuity formula solved for payment
  const monthlyPayment = remainingAmount / 
    (((Math.pow(1 + monthlyRate, numPayments) - 1) / monthlyRate));
  
  return monthlyPayment;
};

// Debt Payoff Calculator (Debt Snowball vs Avalanche)
export const calculateDebtPayoff = (
  debts: Array<{
    name: string;
    balance: number;
    minimumPayment: number;
    interestRate: number;
  }>,
  extraPayment: number,
  strategy: 'snowball' | 'avalanche' = 'avalanche'
): {
  totalTime: number;
  totalInterest: number;
  payoffOrder: Array<{
    name: string;
    monthsPaid: number;
    totalInterest: number;
  }>;
} => {
  // Sort debts based on strategy
  const sortedDebts = [...debts].sort((a, b) => {
    if (strategy === 'snowball') {
      return a.balance - b.balance; // Smallest balance first
    } else {
      return b.interestRate - a.interestRate; // Highest interest rate first
    }
  });

  let remainingDebts = sortedDebts.map(debt => ({ ...debt }));
  let totalExtraPayment = extraPayment;
  let totalMonths = 0;
  let totalInterest = 0;
  const payoffOrder = [];

  while (remainingDebts.length > 0) {
    totalMonths++;
    
    // Apply minimum payments and extra payment to first debt
    remainingDebts = remainingDebts.map((debt, index) => {
      const payment = debt.minimumPayment + (index === 0 ? totalExtraPayment : 0);
      const interestCharge = debt.balance * (debt.interestRate / 100 / 12);
      const principalPayment = Math.min(payment - interestCharge, debt.balance);
      
      totalInterest += interestCharge;
      
      return {
        ...debt,
        balance: debt.balance - principalPayment,
      };
    });

    // Remove paid off debts and add their minimum payment to extra payment
    const paidOffDebts = remainingDebts.filter(debt => debt.balance <= 0);
    paidOffDebts.forEach(debt => {
      totalExtraPayment += debt.minimumPayment;
      payoffOrder.push({
        name: debt.name,
        monthsPaid: totalMonths,
        totalInterest: 0, // Would need more complex tracking for individual debt interest
      });
    });
    
    remainingDebts = remainingDebts.filter(debt => debt.balance > 0);
  }

  return {
    totalTime: totalMonths,
    totalInterest,
    payoffOrder,
  };
};

// Percentage Change Calculator
export const calculatePercentageChange = (
  originalValue: number,
  newValue: number
): {
  absoluteChange: number;
  percentageChange: number;
  isIncrease: boolean;
} => {
  const absoluteChange = newValue - originalValue;
  const percentageChange = originalValue !== 0 ? (absoluteChange / Math.abs(originalValue)) * 100 : 0;
  
  return {
    absoluteChange,
    percentageChange,
    isIncrease: absoluteChange >= 0,
  };
};

// Tax Calculator (Basic US Federal)
export const calculateTax = (
  income: number,
  filingStatus: 'single' | 'marriedJoint' | 'marriedSeparate' | 'headOfHousehold' = 'single',
  year: number = 2024
): {
  taxOwed: number;
  effectiveRate: number;
  marginalRate: number;
  afterTaxIncome: number;
  taxBrackets: Array<{
    min: number;
    max: number;
    rate: number;
    taxOnBracket: number;
  }>;
} => {
  // Simplified 2024 tax brackets for single filers
  const brackets = [
    { min: 0, max: 11000, rate: 0.10 },
    { min: 11000, max: 44725, rate: 0.12 },
    { min: 44725, max: 95375, rate: 0.22 },
    { min: 95375, max: 182050, rate: 0.24 },
    { min: 182050, max: 231250, rate: 0.32 },
    { min: 231250, max: 578125, rate: 0.35 },
    { min: 578125, max: Infinity, rate: 0.37 },
  ];

  let taxOwed = 0;
  let marginalRate = 0;
  const taxBrackets = [];

  for (const bracket of brackets) {
    if (income > bracket.min) {
      const taxableInBracket = Math.min(income - bracket.min, bracket.max - bracket.min);
      const taxOnBracket = taxableInBracket * bracket.rate;
      
      taxOwed += taxOnBracket;
      marginalRate = bracket.rate;
      
      taxBrackets.push({
        min: bracket.min,
        max: bracket.max,
        rate: bracket.rate,
        taxOnBracket,
      });
    }
  }

  const effectiveRate = income > 0 ? (taxOwed / income) * 100 : 0;
  const afterTaxIncome = income - taxOwed;

  return {
    taxOwed,
    effectiveRate,
    marginalRate: marginalRate * 100,
    afterTaxIncome,
    taxBrackets,
  };
};
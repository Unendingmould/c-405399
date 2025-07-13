import { firestore } from 'firebase-admin';
import { db } from '../config/firebase';
import InvestmentModel from './FirebaseInvestment';
import { Transaction, TransactionType } from './transactionModel';

/**
 * Portfolio performance data structure
 */
export interface PortfolioPerformance {
  totalValue: number;
  initialInvestment: number;
  returns: number;
  returnPercentage: number;
  valueHistory: Array<{
    date: firestore.Timestamp;
    value: number;
  }>;
  assetAllocation: {
    [key: string]: {
      percentage: number;
      value: number;
    };
  };
}

/**
 * Asset class performance data structure
 */
export interface AssetClassPerformance {
  name: string;
  currentValue: number;
  initialValue: number;
  returns: number;
  returnPercentage: number;
  allocation: number; // percentage of portfolio
}

/**
 * Investment performance data structure
 */
export interface InvestmentPerformance {
  id: string;
  name: string;
  currentValue: number;
  initialInvestment: number;
  returns: number;
  returnPercentage: number;
  startDate: firestore.Timestamp;
  lastValuationDate: firestore.Timestamp;
  riskLevel: string;
}

/**
 * Portfolio summary data structure
 */
export interface PortfolioSummary {
  totalValue: number;
  totalInvestments: number;
  totalReturns: number;
  returnPercentage: number;
  bestPerforming: InvestmentPerformance | null;
  worstPerforming: InvestmentPerformance | null;
  assetAllocation: {
    [key: string]: number; // percentage
  };
}

/**
 * Analytics model for portfolio insights
 */
export class Analytics {
  private transactionModel = new Transaction();
  
  /**
   * Get user's portfolio performance
   * @param userId User ID
   * @param period Period for historical data (in days)
   * @returns Portfolio performance data
   */
  async getPortfolioPerformance(userId: string, period: number = 30): Promise<PortfolioPerformance> {
    // Get all user investments
    const investments = await InvestmentModel.getUserInvestments(userId);
    
    // Initialize portfolio data
    let totalValue = 0;
    let initialInvestment = 0;
    const assetAllocation: { [key: string]: { percentage: number; value: number } } = {
      stocks: { percentage: 0, value: 0 },
      bonds: { percentage: 0, value: 0 },
      cash: { percentage: 0, value: 0 },
      alternatives: { percentage: 0, value: 0 }
    };
    
    // Process each investment
    for (const investment of investments) {
      // Get investment plan details for asset allocation
      const plan = await InvestmentModel.getInvestmentPlanById(investment.planId);
      if (!plan) continue;
      
      // Add to total value
      totalValue += investment.currentValue;
      
      // Get initial investment (sum of deposits minus withdrawals)
      const deposits = await this.transactionModel.getSumByType(userId, TransactionType.DEPOSIT);
      const withdrawals = await this.transactionModel.getSumByType(userId, TransactionType.WITHDRAWAL);
      initialInvestment += deposits - withdrawals;
      
      // Calculate asset allocation
      const { assetAllocation: planAllocation } = plan;
      
      // Add weighted values to each asset class
      assetAllocation.stocks.value += (planAllocation.stocks / 100) * investment.currentValue;
      assetAllocation.bonds.value += (planAllocation.bonds / 100) * investment.currentValue;
      assetAllocation.cash.value += (planAllocation.cash / 100) * investment.currentValue;
      assetAllocation.alternatives.value += (planAllocation.alternatives / 100) * investment.currentValue;
    }
    
    // Calculate percentages for asset allocation
    if (totalValue > 0) {
      assetAllocation.stocks.percentage = (assetAllocation.stocks.value / totalValue) * 100;
      assetAllocation.bonds.percentage = (assetAllocation.bonds.value / totalValue) * 100;
      assetAllocation.cash.percentage = (assetAllocation.cash.value / totalValue) * 100;
      assetAllocation.alternatives.percentage = (assetAllocation.alternatives.value / totalValue) * 100;
    }
    
    // Calculate returns
    const returns = totalValue - initialInvestment;
    const returnPercentage = initialInvestment > 0 
      ? (returns / initialInvestment) * 100 
      : 0;
    
    // Generate dummy historical data for now
    // In a real system, this would come from stored historical snapshots
    const valueHistory = this.generateHistoricalData(totalValue, period);
    
    return {
      totalValue,
      initialInvestment,
      returns,
      returnPercentage,
      valueHistory,
      assetAllocation
    };
  }
  
  /**
   * Get performance breakdown by asset class
   * @param userId User ID
   * @returns Asset class performance data
   */
  async getAssetClassPerformance(userId: string): Promise<AssetClassPerformance[]> {
    // Get portfolio performance which has asset allocation
    const portfolio = await this.getPortfolioPerformance(userId);
    
    // Format the data for asset classes
    const result: AssetClassPerformance[] = [];
    
    for (const [name, data] of Object.entries(portfolio.assetAllocation)) {
      // For simplicity, we'll use the overall return rate for each asset class
      // In a real system, each asset class would have its own tracked performance
      const returnPercentage = portfolio.returnPercentage;
      const initialValue = data.value / (1 + returnPercentage / 100);
      
      result.push({
        name,
        currentValue: data.value,
        initialValue,
        returns: data.value - initialValue,
        returnPercentage,
        allocation: data.percentage
      });
    }
    
    return result;
  }
  
  /**
   * Get performance data for each investment
   * @param userId User ID
   * @returns Array of investment performance data
   */
  async getInvestmentPerformance(userId: string): Promise<InvestmentPerformance[]> {
    const investments = await InvestmentModel.getUserInvestments(userId);
    const result: InvestmentPerformance[] = [];
    
    for (const investment of investments) {
      // Get the plan details
      const plan = await InvestmentModel.getInvestmentPlanById(investment.planId);
      if (!plan) continue;
      
      // Get initial investment amount for this specific investment
      // In a real system, this would be calculated from transaction history
      // For now, we'll estimate based on current value and expected return
      const timeDiffMs = investment.lastValuationDate.toMillis() - investment.startDate.toMillis();
      const timeDiffYears = timeDiffMs / (365 * 24 * 60 * 60 * 1000);
      const yearlyReturnRate = plan.expectedReturn / 100;
      
      // Calculate initial investment using compound interest formula
      // FV = PV * (1 + r)^t => PV = FV / (1 + r)^t
      const initialInvestment = investment.currentValue / Math.pow(1 + yearlyReturnRate, timeDiffYears);
      
      const returns = investment.currentValue - initialInvestment;
      const returnPercentage = initialInvestment > 0 
        ? (returns / initialInvestment) * 100 
        : 0;
      
      result.push({
        id: investment.id,
        name: plan.name,
        currentValue: investment.currentValue,
        initialInvestment,
        returns,
        returnPercentage,
        startDate: investment.startDate,
        lastValuationDate: investment.lastValuationDate,
        riskLevel: plan.riskLevel
      });
    }
    
    return result;
  }
  
  /**
   * Get portfolio summary with key metrics
   * @param userId User ID
   * @returns Portfolio summary data
   */
  async getPortfolioSummary(userId: string): Promise<PortfolioSummary> {
    const performance = await this.getPortfolioPerformance(userId);
    const investmentsPerformance = await this.getInvestmentPerformance(userId);
    
    // Find best and worst performing investments
    let bestPerforming: InvestmentPerformance | null = null;
    let worstPerforming: InvestmentPerformance | null = null;
    
    if (investmentsPerformance.length > 0) {
      bestPerforming = investmentsPerformance.reduce(
        (best, current) => (current.returnPercentage > best.returnPercentage ? current : best),
        investmentsPerformance[0]
      );
      
      worstPerforming = investmentsPerformance.reduce(
        (worst, current) => (current.returnPercentage < worst.returnPercentage ? current : worst),
        investmentsPerformance[0]
      );
    }
    
    // Simplify asset allocation for the summary
    const assetAllocation: { [key: string]: number } = {};
    for (const [key, value] of Object.entries(performance.assetAllocation)) {
      assetAllocation[key] = value.percentage;
    }
    
    return {
      totalValue: performance.totalValue,
      totalInvestments: investmentsPerformance.length,
      totalReturns: performance.returns,
      returnPercentage: performance.returnPercentage,
      bestPerforming,
      worstPerforming,
      assetAllocation
    };
  }
  
  /**
   * Helper method to generate historical data
   * @param currentValue Current portfolio value
   * @param days Number of days to generate data for
   * @returns Array of historical data points
   */
  private generateHistoricalData(
    currentValue: number, 
    days: number
  ): Array<{ date: firestore.Timestamp; value: number }> {
    const result: Array<{ date: firestore.Timestamp; value: number }> = [];
    const now = new Date();
    
    // Start with a value around 90-95% of current value
    let baseValue = currentValue * (0.9 + Math.random() * 0.05);
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      
      // Add some random fluctuation
      const fluctuation = Math.random() * 0.02 - 0.01; // -1% to +1%
      
      if (i !== 0) {
        // Gradually increase towards the current value
        const progress = 1 - (i / days);
        const targetDiff = currentValue - baseValue;
        baseValue += (targetDiff / days) + (baseValue * fluctuation);
      } else {
        // Ensure the last value matches the current value
        baseValue = currentValue;
      }
      
      result.push({
        date: firestore.Timestamp.fromDate(date),
        value: parseFloat(baseValue.toFixed(2))
      });
    }
    
    return result;
  }
}

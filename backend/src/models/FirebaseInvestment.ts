import { db } from '../config/firebase';
import { firestore } from 'firebase-admin';

const COLLECTION_NAME = 'investments';
const investmentsCollection = db.collection(COLLECTION_NAME);

/**
 * Investment Plan document type in Firestore
 */
export interface InvestmentPlanData {
  id: string;
  name: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  expectedReturn: number; // Annual percentage
  minimumInvestment: number;
  recommendedDuration: number; // In months
  assetAllocation: {
    stocks: number; // Percentage
    bonds: number; // Percentage
    cash: number; // Percentage
    alternatives: number; // Percentage
  };
  features: string[];
  isActive: boolean;
  createdAt: firestore.Timestamp;
  updatedAt: firestore.Timestamp;
}

/**
 * User Investment document type in Firestore (user's actual investments)
 */
export interface UserInvestmentData {
  id: string;
  userId: string;
  planId: string;
  amount: number;
  startDate: firestore.Timestamp;
  endDate?: firestore.Timestamp; // Optional if ongoing
  currentValue: number;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  lastValuationDate: firestore.Timestamp;
  transactions: {
    type: 'deposit' | 'withdrawal' | 'interest' | 'fee';
    amount: number;
    date: firestore.Timestamp;
    description: string;
  }[];
  createdAt: firestore.Timestamp;
  updatedAt: firestore.Timestamp;
}

/**
 * Data for creating a new investment plan
 */
export interface CreateInvestmentPlanData {
  name: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  expectedReturn: number;
  minimumInvestment: number;
  recommendedDuration: number;
  assetAllocation: {
    stocks: number;
    bonds: number;
    cash: number;
    alternatives: number;
  };
  features: string[];
  isActive?: boolean;
}

/**
 * Data for creating a user investment
 */
export interface CreateUserInvestmentData {
  userId: string;
  planId: string;
  amount: number;
  startDate?: Date; // Optional, defaults to current date
}

/**
 * Class for managing investment plans
 */
class InvestmentModel {
  /**
   * Create a new investment plan
   * @param planData - Investment plan data
   * @returns Created investment plan
   */
  async createInvestmentPlan(planData: CreateInvestmentPlanData): Promise<InvestmentPlanData> {
    const now = firestore.Timestamp.now();
    
    const newPlan = {
      ...planData,
      isActive: planData.isActive ?? true,
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await investmentsCollection.add(newPlan);
    
    return {
      id: docRef.id,
      ...newPlan
    } as InvestmentPlanData;
  }

  /**
   * Get all investment plans
   * @param activeOnly - If true, only return active plans
   * @returns Array of investment plans
   */
  async getInvestmentPlans(activeOnly = true): Promise<InvestmentPlanData[]> {
    let query = investmentsCollection;
    
    if (activeOnly) {
      query = query.where('isActive', '==', true);
    }
    
    const snapshot = await query.get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as InvestmentPlanData));
  }

  /**
   * Get investment plan by ID
   * @param planId - Investment plan ID
   * @returns Investment plan or null if not found
   */
  async getInvestmentPlanById(planId: string): Promise<InvestmentPlanData | null> {
    const doc = await investmentsCollection.doc(planId).get();
    
    if (!doc.exists) {
      return null;
    }
    
    return {
      id: doc.id,
      ...doc.data()
    } as InvestmentPlanData;
  }

  /**
   * Update investment plan
   * @param planId - Investment plan ID
   * @param updateData - Data to update
   * @returns Updated investment plan or null if not found
   */
  async updateInvestmentPlan(
    planId: string,
    updateData: Partial<CreateInvestmentPlanData>
  ): Promise<InvestmentPlanData | null> {
    const planRef = investmentsCollection.doc(planId);
    const plan = await planRef.get();
    
    if (!plan.exists) {
      return null;
    }
    
    const now = firestore.Timestamp.now();
    await planRef.update({
      ...updateData,
      updatedAt: now
    });
    
    const updatedPlan = await planRef.get();
    
    return {
      id: updatedPlan.id,
      ...updatedPlan.data()
    } as InvestmentPlanData;
  }

  /**
   * Delete investment plan (mark as inactive)
   * @param planId - Investment plan ID
   * @returns Success status
   */
  async deleteInvestmentPlan(planId: string): Promise<boolean> {
    const planRef = investmentsCollection.doc(planId);
    const plan = await planRef.get();
    
    if (!plan.exists) {
      return false;
    }
    
    // Mark as inactive instead of deleting
    await planRef.update({ 
      isActive: false,
      updatedAt: firestore.Timestamp.now()
    });
    
    return true;
  }
  
  /**
   * Create a user investment
   * @param investmentData - User investment data
   * @returns Created user investment
   */
  async createUserInvestment(
    investmentData: CreateUserInvestmentData
  ): Promise<UserInvestmentData> {
    // Validate that the plan exists
    const plan = await this.getInvestmentPlanById(investmentData.planId);
    if (!plan) {
      throw new Error('Investment plan not found');
    }
    
    // Create user investment collection if it doesn't exist
    const userInvestmentsCollection = db.collection('userInvestments');
    
    const now = firestore.Timestamp.now();
    const startDate = investmentData.startDate 
      ? firestore.Timestamp.fromDate(investmentData.startDate)
      : now;
    
    const newInvestment = {
      userId: investmentData.userId,
      planId: investmentData.planId,
      amount: investmentData.amount,
      startDate,
      currentValue: investmentData.amount, // Initial value equals amount
      status: 'active',
      lastValuationDate: now,
      transactions: [
        {
          type: 'deposit',
          amount: investmentData.amount,
          date: now,
          description: 'Initial investment'
        }
      ],
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await userInvestmentsCollection.add(newInvestment);
    
    return {
      id: docRef.id,
      ...newInvestment
    } as UserInvestmentData;
  }

  /**
   * Get user investments
   * @param userId - User ID
   * @returns Array of user investments
   */
  async getUserInvestments(userId: string): Promise<UserInvestmentData[]> {
    const userInvestmentsCollection = db.collection('userInvestments');
    
    const snapshot = await userInvestmentsCollection
      .where('userId', '==', userId)
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as UserInvestmentData));
  }

  /**
   * Get user investment by ID
   * @param investmentId - Investment ID
   * @param userId - User ID (for security validation)
   * @returns User investment or null if not found
   */
  async getUserInvestmentById(
    investmentId: string,
    userId: string
  ): Promise<UserInvestmentData | null> {
    const userInvestmentsCollection = db.collection('userInvestments');
    
    const doc = await userInvestmentsCollection.doc(investmentId).get();
    
    if (!doc.exists) {
      return null;
    }
    
    const investment = doc.data() as UserInvestmentData;
    
    // Security check: ensure the investment belongs to the user
    if (investment.userId !== userId) {
      return null;
    }
    
    return {
      id: doc.id,
      ...investment
    };
  }

  /**
   * Update user investment
   * @param investmentId - Investment ID
   * @param userId - User ID (for security validation)
   * @param updateData - Data to update
   * @returns Updated user investment or null if not found
   */
  async updateUserInvestment(
    investmentId: string,
    userId: string,
    updateData: Partial<UserInvestmentData>
  ): Promise<UserInvestmentData | null> {
    const userInvestmentsCollection = db.collection('userInvestments');
    const investmentRef = userInvestmentsCollection.doc(investmentId);
    const investment = await investmentRef.get();
    
    if (!investment.exists) {
      return null;
    }
    
    const investmentData = investment.data() as UserInvestmentData;
    
    // Security check: ensure the investment belongs to the user
    if (investmentData.userId !== userId) {
      return null;
    }
    
    const now = firestore.Timestamp.now();
    await investmentRef.update({
      ...updateData,
      updatedAt: now
    });
    
    const updatedInvestment = await investmentRef.get();
    
    return {
      id: updatedInvestment.id,
      ...updatedInvestment.data()
    } as UserInvestmentData;
  }

  /**
   * Add transaction to user investment
   * @param investmentId - Investment ID
   * @param userId - User ID (for security validation)
   * @param transaction - Transaction data
   * @returns Updated user investment or null if not found
   */
  async addInvestmentTransaction(
    investmentId: string,
    userId: string,
    transaction: {
      type: 'deposit' | 'withdrawal' | 'interest' | 'fee';
      amount: number;
      description: string;
    }
  ): Promise<UserInvestmentData | null> {
    const userInvestmentsCollection = db.collection('userInvestments');
    const investmentRef = userInvestmentsCollection.doc(investmentId);
    const investment = await investmentRef.get();
    
    if (!investment.exists) {
      return null;
    }
    
    const investmentData = investment.data() as UserInvestmentData;
    
    // Security check: ensure the investment belongs to the user
    if (investmentData.userId !== userId) {
      return null;
    }
    
    const now = firestore.Timestamp.now();
    const newTransaction = {
      ...transaction,
      date: now
    };
    
    // Calculate new current value based on transaction type
    let newValue = investmentData.currentValue;
    if (transaction.type === 'deposit' || transaction.type === 'interest') {
      newValue += transaction.amount;
    } else if (transaction.type === 'withdrawal' || transaction.type === 'fee') {
      newValue -= transaction.amount;
    }
    
    // Update investment with new transaction and current value
    await investmentRef.update({
      transactions: firestore.FieldValue.arrayUnion(newTransaction),
      currentValue: newValue,
      lastValuationDate: now,
      updatedAt: now
    });
    
    const updatedInvestment = await investmentRef.get();
    
    return {
      id: updatedInvestment.id,
      ...updatedInvestment.data()
    } as UserInvestmentData;
  }
}

export default new InvestmentModel();

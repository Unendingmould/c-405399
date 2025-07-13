import { firestore } from 'firebase-admin';
import { db } from '../config/firebase';
import { v4 as uuidv4 } from 'uuid';

// Transaction Types
export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  INVESTMENT = 'investment',
  DIVIDEND = 'dividend',
  FEE = 'fee',
  INTEREST = 'interest',
  TRANSFER = 'transfer'
}

// Transaction Status
export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

// Transaction Data interface
export interface TransactionData {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  status: TransactionStatus;
  reference?: string;
  investmentId?: string;
  metadata?: Record<string, any>;
  createdAt: firestore.Timestamp;
  updatedAt: firestore.Timestamp;
}

/**
 * Transaction model for managing financial transactions
 */
export class Transaction {
  private collection = db.collection('transactions');

  /**
   * Create a new transaction
   * @param data Transaction data
   * @returns Created transaction
   */
  async create(data: Omit<TransactionData, 'id' | 'createdAt' | 'updatedAt'>): Promise<TransactionData> {
    const now = firestore.Timestamp.now();
    const id = uuidv4();
    
    const transaction: TransactionData = {
      id,
      ...data,
      createdAt: now,
      updatedAt: now
    };
    
    await this.collection.doc(id).set(transaction);
    return transaction;
  }

  /**
   * Get all transactions for a user
   * @param userId User ID
   * @param options Query options
   * @returns List of transactions
   */
  async getByUserId(
    userId: string,
    options: {
      limit?: number;
      startAfter?: string;
      type?: TransactionType;
      status?: TransactionStatus;
      startDate?: Date;
      endDate?: Date;
    } = {}
  ): Promise<TransactionData[]> {
    let query = this.collection.where('userId', '==', userId);
    
    // Apply filters
    if (options.type) {
      query = query.where('type', '==', options.type);
    }
    
    if (options.status) {
      query = query.where('status', '==', options.status);
    }
    
    if (options.startDate) {
      query = query.where(
        'createdAt',
        '>=',
        firestore.Timestamp.fromDate(options.startDate)
      );
    }
    
    if (options.endDate) {
      query = query.where(
        'createdAt',
        '<=',
        firestore.Timestamp.fromDate(options.endDate)
      );
    }
    
    // Apply pagination
    query = query.orderBy('createdAt', 'desc');
    
    if (options.startAfter) {
      const startAfterDoc = await this.collection.doc(options.startAfter).get();
      if (startAfterDoc.exists) {
        query = query.startAfter(startAfterDoc);
      }
    }
    
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    const snapshot = await query.get();
    return snapshot.docs.map(doc => doc.data() as TransactionData);
  }

  /**
   * Get transaction by ID
   * @param id Transaction ID
   * @returns Transaction data or null if not found
   */
  async getById(id: string): Promise<TransactionData | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return doc.data() as TransactionData;
  }

  /**
   * Update transaction status
   * @param id Transaction ID
   * @param status New status
   * @param metadata Optional metadata to update
   * @returns Updated transaction
   */
  async updateStatus(
    id: string,
    status: TransactionStatus,
    metadata?: Record<string, any>
  ): Promise<TransactionData | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    
    const updateData: { 
      status: TransactionStatus; 
      updatedAt: firestore.Timestamp;
      metadata?: Record<string, any>;
    } = {
      status,
      updatedAt: firestore.Timestamp.now()
    };
    
    if (metadata) {
      updateData.metadata = metadata;
    }
    
    await this.collection.doc(id).update(updateData);
    
    return {
      ...(doc.data() as TransactionData),
      ...updateData
    };
  }

  /**
   * Get all transactions for an investment
   * @param investmentId Investment ID
   * @returns List of transactions
   */
  async getByInvestmentId(investmentId: string): Promise<TransactionData[]> {
    const snapshot = await this.collection
      .where('investmentId', '==', investmentId)
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => doc.data() as TransactionData);
  }

  /**
   * Get sum of transactions by type for a user
   * @param userId User ID
   * @param type Transaction type
   * @param status Optional status filter
   * @returns Total amount
   */
  async getSumByType(
    userId: string,
    type: TransactionType,
    status = TransactionStatus.COMPLETED
  ): Promise<number> {
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .where('type', '==', type)
      .where('status', '==', status)
      .get();
    
    return snapshot.docs
      .map(doc => (doc.data() as TransactionData).amount)
      .reduce((sum, amount) => sum + amount, 0);
  }

  /**
   * Get transactions by reference
   * @param reference External reference
   * @returns List of transactions
   */
  async getByReference(reference: string): Promise<TransactionData[]> {
    const snapshot = await this.collection
      .where('reference', '==', reference)
      .get();
    
    return snapshot.docs.map(doc => doc.data() as TransactionData);
  }

  /**
   * Get admin overview of all transactions
   * Admin-only endpoint
   * @param options Query options
   * @returns List of transactions
   */
  async getAll(
    options: {
      limit?: number;
      startAfter?: string;
      type?: TransactionType;
      status?: TransactionStatus;
      startDate?: Date;
      endDate?: Date;
    } = {}
  ): Promise<TransactionData[]> {
    let query = this.collection;
    
    // Apply filters
    if (options.type) {
      query = query.where('type', '==', options.type);
    }
    
    if (options.status) {
      query = query.where('status', '==', options.status);
    }
    
    if (options.startDate) {
      query = query.where(
        'createdAt',
        '>=',
        firestore.Timestamp.fromDate(options.startDate)
      );
    }
    
    if (options.endDate) {
      query = query.where(
        'createdAt',
        '<=',
        firestore.Timestamp.fromDate(options.endDate)
      );
    }
    
    // Apply pagination
    query = query.orderBy('createdAt', 'desc');
    
    if (options.startAfter) {
      const startAfterDoc = await this.collection.doc(options.startAfter).get();
      if (startAfterDoc.exists) {
        query = query.startAfter(startAfterDoc);
      }
    }
    
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    const snapshot = await query.get();
    return snapshot.docs.map(doc => doc.data() as TransactionData);
  }
}

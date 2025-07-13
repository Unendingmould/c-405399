import { Request, Response } from 'express';
import { emitTransactionEvent, emitPortfolioUpdate } from '../utils/eventEmitters';
import { body, query, param } from 'express-validator';
import { Transaction, TransactionData, TransactionStatus, TransactionType } from '../models/transactionModel';
import InvestmentModel from '../models/FirebaseInvestment';
import { NotificationService } from '../services/notificationService';

// Extend Request type to include user with role
declare global {
  namespace Express {
    interface User {
      userId: string;
      email: string;
      role?: string;
    }
  }
}

// Initialize models and services
const transactionModel = new Transaction();
const notificationService = new NotificationService();

/**
 * Create a new transaction
 * @route POST /api/transactions
 */
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      });
    }

    const { type, amount, description, reference, investmentId, metadata } = req.body;

    // Create the transaction
    const transaction = await transactionModel.create({
      userId,
      type,
      amount,
      description,
      status: TransactionStatus.PENDING,
      reference,
      investmentId,
      metadata
    });

    // Emit real-time event for new transaction
    emitTransactionEvent(userId, transaction, true);

    // Emit portfolio update since transaction affects financial state
    emitPortfolioUpdate(userId);

    // If this is an investment transaction, update the investment
    if (investmentId && (type === TransactionType.DEPOSIT || type === TransactionType.WITHDRAWAL)) {
      // Verify the investment belongs to the user
      const investment = await InvestmentModel.getUserInvestmentById(investmentId, userId);
      
      if (!investment) {
        return res.status(404).json({
          status: 'error',
          message: 'Investment not found'
        });
      }

      if (investment.userId !== userId) {
        return res.status(403).json({
          status: 'error',
          message: 'Not authorized to modify this investment'
        });
      }

      // Update the investment
      const multiplier = type === TransactionType.DEPOSIT ? 1 : -1;
      const newAmount = investment.currentValue + (amount * multiplier);
      
      // Prevent negative balance for withdrawals
      if (type === TransactionType.WITHDRAWAL && newAmount < 0) {
        await transactionModel.updateStatus(
          transaction.id,
          TransactionStatus.FAILED,
          { failureReason: 'Insufficient funds' }
        );

        return res.status(400).json({
          status: 'error',
          message: 'Insufficient funds',
          data: { 
            transaction: await transactionModel.getById(transaction.id) 
          }
        });
      }

      // Update investment value
      await InvestmentModel.updateUserInvestment(investmentId, userId, { currentValue: newAmount });
      
      // Mark transaction as completed
      await transactionModel.updateStatus(transaction.id, TransactionStatus.COMPLETED);

      // Get the updated transaction
      const updatedTransaction = await transactionModel.getById(transaction.id);

      // Emit real-time event for updated transaction
      emitTransactionEvent(userId, updatedTransaction, false);

      // Emit portfolio update
      emitPortfolioUpdate(userId);

      // Send notification
      await notificationService.sendTransactionConfirmation(
        userId,
        updatedTransaction
      );

      return res.status(201).json({
        status: 'success',
        message: 'Transaction created and processed',
        data: {
          transaction: updatedTransaction
        }
      });
    }

    // For non-investment transactions or other types, just return the pending transaction
    // Send notification
    await notificationService.sendTransactionConfirmation(
      userId,
      transaction
    );

    return res.status(201).json({
      status: 'success',
      message: 'Transaction created',
      data: {
        transaction
      }
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create transaction'
    });
  }
};

/**
 * Get user transactions with filters
 * @route GET /api/transactions
 */
export const getUserTransactions = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      });
    }

    // Parse query parameters
    const {
      limit = 10,
      startAfter,
      type,
      status,
      startDate,
      endDate
    } = req.query;

    // Convert query parameters
    const options: any = {
      limit: parseInt(limit as string),
      startAfter: startAfter as string,
      type: type as TransactionType,
      status: status as TransactionStatus
    };

    // Convert date strings to Date objects
    if (startDate) {
      options.startDate = new Date(startDate as string);
    }
    
    if (endDate) {
      options.endDate = new Date(endDate as string);
    }

    const transactions = await transactionModel.getByUserId(userId, options);

    return res.status(200).json({
      status: 'success',
      data: transactions,
      pagination: {
        limit: options.limit,
        hasMore: transactions.length === options.limit,
        nextStartAfter: transactions.length > 0 ? transactions[transactions.length - 1].id : null
      }
    });
  } catch (error) {
    console.error('Error getting user transactions:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get transactions'
    });
  }
};

/**
 * Get transaction by ID
 * @route GET /api/transactions/:id
 */
export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      });
    }

    const { id } = req.params;
    const transaction = await transactionModel.getById(id);

    if (!transaction) {
      return res.status(404).json({
        status: 'error',
        message: 'Transaction not found'
      });
    }

    // Check if transaction belongs to user or user is admin
    if (transaction.userId !== userId && req.user?.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to view this transaction'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: transaction
    });
  } catch (error) {
    console.error('Error getting transaction:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get transaction'
    });
  }
};

/**
 * Update transaction status (admin only)
 * @route PATCH /api/transactions/:id/status
 */
export const updateTransactionStatus = async (req: Request, res: Response) => {
  try {
    // Ensure user is admin (middleware should have checked this)
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized'
      });
    }

    const { id } = req.params;
    const { status, metadata } = req.body;

    const updatedTransaction = await transactionModel.updateStatus(
      id,
      status as TransactionStatus,
      metadata
    );

    if (!updatedTransaction) {
      return res.status(404).json({
        status: 'error',
        message: 'Transaction not found'
      });
    }

    // Emit real-time event for updated transaction
    emitTransactionEvent(req.user.userId, updatedTransaction, false);

    // Emit portfolio update if transaction status changed
    if (status) {
      emitPortfolioUpdate(req.user.userId);
    }

    // If updating to completed status for investment-related transaction, update investment
    if (
      status === TransactionStatus.COMPLETED &&
      updatedTransaction.investmentId &&
      (updatedTransaction.type === TransactionType.DEPOSIT || updatedTransaction.type === TransactionType.WITHDRAWAL)
    ) {
      const investment = await InvestmentModel.getUserInvestmentById(updatedTransaction.investmentId, updatedTransaction.userId);
      
      if (investment) {
        const multiplier = updatedTransaction.type === TransactionType.DEPOSIT ? 1 : -1;
        const newAmount = investment.currentValue + (updatedTransaction.amount * multiplier);
        
        // Prevent negative balance for withdrawals
        if (updatedTransaction.type === TransactionType.WITHDRAWAL && newAmount < 0) {
          await transactionModel.updateStatus(
            id,
            TransactionStatus.FAILED,
            { failureReason: 'Insufficient funds' }
          );

          return res.status(400).json({
            status: 'error',
            message: 'Cannot complete withdrawal: Insufficient funds',
            data: { 
              transaction: await transactionModel.getById(id) 
            }
          });
        }

        await InvestmentModel.updateUserInvestment(updatedTransaction.investmentId, updatedTransaction.userId, { currentValue: newAmount });
      }
    }

    return res.status(200).json({
      status: 'success',
      message: 'Transaction status updated',
      data: await transactionModel.getById(id)
    });
  } catch (error) {
    console.error('Error updating transaction status:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update transaction status'
    });
  }
};

/**
 * Get transactions by investment ID
 * @route GET /api/transactions/investments/:investmentId
 */
export const getTransactionsByInvestmentId = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      });
    }

    const { investmentId } = req.params;
    
    // Verify the investment belongs to the user
    const investment = await InvestmentModel.getUserInvestmentById(investmentId, userId);
    
    if (!investment) {
      return res.status(404).json({
        status: 'error',
        message: 'Investment not found'
      });
    }

    if (investment.userId !== userId && req.user?.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to view these transactions'
      });
    }

    const transactions = await transactionModel.getByInvestmentId(investmentId);

    return res.status(200).json({
      status: 'success',
      data: transactions
    });
  } catch (error) {
    console.error('Error getting investment transactions:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get investment transactions'
    });
  }
};

/**
 * Get transaction summary for a user
 * @route GET /api/transactions/summary
 */
export const getTransactionSummary = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      });
    }

    // Calculate total deposits
    const totalDeposits = await transactionModel.getSumByType(
      userId,
      TransactionType.DEPOSIT,
      TransactionStatus.COMPLETED
    );

    // Calculate total withdrawals
    const totalWithdrawals = await transactionModel.getSumByType(
      userId,
      TransactionType.WITHDRAWAL,
      TransactionStatus.COMPLETED
    );

    // Calculate total fees
    const totalFees = await transactionModel.getSumByType(
      userId,
      TransactionType.FEE,
      TransactionStatus.COMPLETED
    );

    // Calculate total interest/dividends
    const totalInterest = await transactionModel.getSumByType(
      userId,
      TransactionType.INTEREST,
      TransactionStatus.COMPLETED
    );

    const totalDividends = await transactionModel.getSumByType(
      userId,
      TransactionType.DIVIDEND,
      TransactionStatus.COMPLETED
    );

    // Calculate net (excluding investments which are just movements of money)
    const netCashflow = totalDeposits - totalWithdrawals;
    const netReturns = totalInterest + totalDividends - totalFees;

    return res.status(200).json({
      status: 'success',
      data: {
        summary: {
          totalDeposits,
          totalWithdrawals,
          totalFees,
          totalInterest,
          totalDividends,
          netCashflow,
          netReturns
        }
      }
    });
  } catch (error) {
    console.error('Error getting transaction summary:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get transaction summary'
    });
  }
};

/**
 * Get all transactions (admin only)
 * @route GET /api/transactions/admin
 */
export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    // Ensure user is admin (middleware should have checked this)
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized'
      });
    }

    // Parse query parameters
    const {
      limit = 20,
      startAfter,
      type,
      status,
      startDate,
      endDate
    } = req.query;

    // Convert query parameters
    const options: any = {
      limit: parseInt(limit as string),
      startAfter: startAfter as string,
      type: type as TransactionType,
      status: status as TransactionStatus
    };

    // Convert date strings to Date objects
    if (startDate) {
      options.startDate = new Date(startDate as string);
    }
    
    if (endDate) {
      options.endDate = new Date(endDate as string);
    }

    const transactions = await transactionModel.getAll(options);

    return res.status(200).json({
      status: 'success',
      data: transactions,
      pagination: {
        limit: options.limit,
        hasMore: transactions.length === options.limit,
        nextStartAfter: transactions.length > 0 ? transactions[transactions.length - 1].id : null
      }
    });
  } catch (error) {
    console.error('Error getting all transactions:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get transactions'
    });
  }
};

// Validation rules
export const validate = {
  createTransaction: [
    body('type')
      .isIn(Object.values(TransactionType))
      .withMessage('Invalid transaction type'),
    body('amount')
      .isFloat({ min: 0.01 })
      .withMessage('Amount must be greater than 0'),
    body('description')
      .isString()
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage('Description must be between 3 and 200 characters'),
    body('reference')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Reference cannot exceed 100 characters'),
    body('investmentId')
      .optional()
      .isString()
      .withMessage('Investment ID must be a valid string'),
    body('metadata')
      .optional()
      .isObject()
      .withMessage('Metadata must be a valid object')
  ],
  updateTransactionStatus: [
    param('id')
      .isString()
      .withMessage('Transaction ID must be a valid string'),
    body('status')
      .isIn(Object.values(TransactionStatus))
      .withMessage('Invalid transaction status'),
    body('metadata')
      .optional()
      .isObject()
      .withMessage('Metadata must be a valid object')
  ],
  getTransactions: [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('startAfter')
      .optional()
      .isString()
      .withMessage('startAfter must be a valid string'),
    query('type')
      .optional()
      .isIn(Object.values(TransactionType))
      .withMessage('Invalid transaction type'),
    query('status')
      .optional()
      .isIn(Object.values(TransactionStatus))
      .withMessage('Invalid transaction status'),
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('startDate must be a valid ISO date'),
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('endDate must be a valid ISO date')
  ]
};

import { Request, Response } from 'express';
import { body, param } from 'express-validator';
import InvestmentModel from '../models/FirebaseInvestment';
import { emitInvestmentEvent, emitPortfolioUpdate } from '../utils/eventEmitters';
import { NotificationService } from '../services/notificationService';

// Initialize notification service
const notificationService = new NotificationService();

/**
 * Get all investment plans
 */
export const getInvestmentPlans = async (req: Request, res: Response) => {
  try {
    // Parse query parameter for active plans only (default to true)
    const activeOnly = req.query.activeOnly !== 'false';
    
    const plans = await InvestmentModel.getInvestmentPlans(activeOnly);
    
    return res.status(200).json({
      status: 'success',
      data: plans
    });
  } catch (error) {
    console.error('Error fetching investment plans:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch investment plans'
    });
  }
};

/**
 * Get investment plan by ID
 */
export const getInvestmentPlanById = async (req: Request, res: Response) => {
  try {
    const planId = req.params.id;
    
    const plan = await InvestmentModel.getInvestmentPlanById(planId);
    
    if (!plan) {
      return res.status(404).json({
        status: 'error',
        message: 'Investment plan not found'
      });
    }
    
    return res.status(200).json({
      status: 'success',
      data: plan
    });
  } catch (error) {
    console.error('Error fetching investment plan:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch investment plan'
    });
  }
};

/**
 * Create investment plan (admin only)
 */
export const createInvestmentPlan = async (req: Request, res: Response) => {
  try {
    // Check if user is admin
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Only administrators can create investment plans'
      });
    }
    
    const {
      name,
      description,
      riskLevel,
      expectedReturn,
      minimumInvestment,
      recommendedDuration,
      assetAllocation,
      features,
      isActive
    } = req.body;
    
    // Validate asset allocation percentages sum to 100%
    const { stocks, bonds, cash, alternatives } = assetAllocation;
    if (stocks + bonds + cash + alternatives !== 100) {
      return res.status(400).json({
        status: 'error',
        message: 'Asset allocation percentages must sum to 100%'
      });
    }
    
    const newPlan = await InvestmentModel.createInvestmentPlan({
      name,
      description,
      riskLevel,
      expectedReturn,
      minimumInvestment,
      recommendedDuration,
      assetAllocation,
      features,
      isActive
    });
    
    return res.status(201).json({
      status: 'success',
      data: newPlan
    });
  } catch (error) {
    console.error('Error creating investment plan:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create investment plan'
    });
  }
};

/**
 * Update investment plan (admin only)
 */
export const updateInvestmentPlan = async (req: Request, res: Response) => {
  try {
    // Check if user is admin
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Only administrators can update investment plans'
      });
    }
    
    const planId = req.params.id;
    const updateData = req.body;
    
    // If asset allocation is being updated, validate percentages sum to 100%
    if (updateData.assetAllocation) {
      const { stocks, bonds, cash, alternatives } = updateData.assetAllocation;
      if (stocks + bonds + cash + alternatives !== 100) {
        return res.status(400).json({
          status: 'error',
          message: 'Asset allocation percentages must sum to 100%'
        });
      }
    }
    
    const updatedPlan = await InvestmentModel.updateInvestmentPlan(planId, updateData);
    
    if (!updatedPlan) {
      return res.status(404).json({
        status: 'error',
        message: 'Investment plan not found'
      });
    }
    
    // Emit real-time event for updated investment plan
    emitInvestmentEvent(req.user?.userId, updatedPlan, false);
    
    // Also update the portfolio in real-time
    emitPortfolioUpdate(req.user?.userId);

    return res.status(200).json({
      status: 'success',
      data: updatedPlan
    });
  } catch (error) {
    console.error('Error updating investment plan:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update investment plan'
    });
  }
};

/**
 * Delete investment plan (admin only)
 */
export const deleteInvestmentPlan = async (req: Request, res: Response) => {
  try {
    // Check if user is admin
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Only administrators can delete investment plans'
      });
    }
    
    const planId = req.params.id;
    
    const success = await InvestmentModel.deleteInvestmentPlan(planId);
    
    if (!success) {
      return res.status(404).json({
        status: 'error',
        message: 'Investment plan not found'
      });
    }
    
    // Emit portfolio update since an investment plan was deleted
    emitPortfolioUpdate(req.user?.userId);

    return res.status(200).json({
      status: 'success',
      message: 'Investment plan deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting investment plan:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete investment plan'
    });
  }
};

/**
 * Get user investments
 */
export const getUserInvestments = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }
    
    const investments = await InvestmentModel.getUserInvestments(userId);
    
    return res.status(200).json({
      status: 'success',
      data: investments
    });
  } catch (error) {
    console.error('Error fetching user investments:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user investments'
    });
  }
};

/**
 * Get user investment by ID
 */
export const getUserInvestmentById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }
    
    const investmentId = req.params.id;
    
    const investment = await InvestmentModel.getUserInvestmentById(investmentId, userId);
    
    if (!investment) {
      return res.status(404).json({
        status: 'error',
        message: 'Investment not found'
      });
    }
    
    return res.status(200).json({
      status: 'success',
      data: investment
    });
  } catch (error) {
    console.error('Error fetching user investment:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user investment'
    });
  }
};

/**
 * Create user investment
 */
export const createUserInvestment = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }
    
    const { planId, amount, startDate } = req.body;
    
    // Validate minimum amount
    const plan = await InvestmentModel.getInvestmentPlanById(planId);
    if (!plan) {
      return res.status(404).json({
        status: 'error',
        message: 'Investment plan not found'
      });
    }
    
    if (amount < plan.minimumInvestment) {
      return res.status(400).json({
        status: 'error',
        message: `Minimum investment amount is ${plan.minimumInvestment}`
      });
    }
    
    const newInvestment = await InvestmentModel.createUserInvestment({  
      userId,
      planId,
      amount,
      startDate: startDate ? new Date(startDate) : undefined
    });
    
    // Send investment notification
    await notificationService.sendInvestmentUpdate(userId, {
      id: newInvestment.id,
      name: plan.name,
      status: 'created',
      expectedReturn: plan.expectedReturn
    });
    
    // Emit real-time event for new investment
    emitInvestmentEvent(userId, newInvestment, true);
    
    // Also update the portfolio in real-time
    emitPortfolioUpdate(userId);

    res.status(201).json({
      success: true,
      message: 'Investment created successfully',
      data: newInvestment
    });
  } catch (error) {
    console.error('Error creating user investment:', error);
    return res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to create user investment'
    });
  }
};

/**
 * Add transaction to user investment
 */
export const addInvestmentTransaction = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }
    
    const investmentId = req.params.id;
    const { type, amount, description } = req.body;
    
    // Validate transaction type
    const validTypes = ['deposit', 'withdrawal', 'interest', 'fee'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid transaction type'
      });
    }
    
    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Amount must be positive'
      });
    }
    
    const updatedInvestment = await InvestmentModel.addInvestmentTransaction(
      investmentId,
      userId,
      { type, amount, description }
    );
    
    if (!updatedInvestment) {
      return res.status(404).json({
        status: 'error',
        message: 'Investment not found'
      });
    }
    
    // Get the associated plan to access plan-specific properties
    const plan = await InvestmentModel.getInvestmentPlanById(updatedInvestment.planId);
    
    // Send investment update notification
    await notificationService.sendInvestmentUpdate(userId, {
      id: investmentId,
      name: plan?.name || 'Investment',
      status: 'updated',
      expectedReturn: plan?.expectedReturn || 0
    });
    
    // Emit real-time event for updated investment
    emitInvestmentEvent(userId, updatedInvestment, false);
    
    // Also update the portfolio in real-time
    emitPortfolioUpdate(userId);

    return res.status(200).json({
      status: 'success',
      data: updatedInvestment
    });
  } catch (error) {
    console.error('Error adding transaction:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to add transaction'
    });
  }
};

/**
 * Validation schemas for investment routes
 */
export const validate = {
  createInvestmentPlan: [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('riskLevel')
      .isIn(['low', 'medium', 'high'])
      .withMessage('Risk level must be low, medium, or high'),
    body('expectedReturn')
      .isNumeric()
      .withMessage('Expected return must be a number'),
    body('minimumInvestment')
      .isNumeric()
      .withMessage('Minimum investment must be a number'),
    body('recommendedDuration')
      .isNumeric()
      .withMessage('Recommended duration must be a number'),
    body('assetAllocation')
      .isObject()
      .withMessage('Asset allocation is required'),
    body('assetAllocation.stocks')
      .isNumeric()
      .withMessage('Stocks allocation must be a number'),
    body('assetAllocation.bonds')
      .isNumeric()
      .withMessage('Bonds allocation must be a number'),
    body('assetAllocation.cash')
      .isNumeric()
      .withMessage('Cash allocation must be a number'),
    body('assetAllocation.alternatives')
      .isNumeric()
      .withMessage('Alternatives allocation must be a number'),
    body('features').isArray().withMessage('Features must be an array')
  ],
  
  createUserInvestment: [
    body('planId').notEmpty().withMessage('Plan ID is required'),
    body('amount')
      .isNumeric()
      .withMessage('Amount must be a number')
      .custom((value) => value > 0)
      .withMessage('Amount must be positive')
  ],
  
  addTransaction: [
    body('type')
      .isIn(['deposit', 'withdrawal', 'interest', 'fee'])
      .withMessage('Type must be deposit, withdrawal, interest, or fee'),
    body('amount')
      .isNumeric()
      .withMessage('Amount must be a number')
      .custom((value) => value > 0)
      .withMessage('Amount must be positive'),
    body('description').notEmpty().withMessage('Description is required')
  ]
};

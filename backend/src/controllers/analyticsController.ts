import { Request, Response } from 'express';
import { query, param } from 'express-validator';
import { Analytics } from '../models/analyticsModel';
import { validationMiddleware } from '../middleware/validationMiddleware';

// Initialize analytics model
const analyticsModel = new Analytics();

/**
 * Get portfolio performance data
 * @param req Request
 * @param res Response
 */
export const getPortfolioPerformance = [
  query('period')
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage('Period must be between 1 and 365 days'),
    
  validationMiddleware,
  
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }
      
      const period = req.query.period ? parseInt(req.query.period as string) : 30;
      
      const performance = await analyticsModel.getPortfolioPerformance(userId, period);
      
      return res.status(200).json({
        success: true,
        message: 'Portfolio performance retrieved successfully',
        data: performance
      });
    } catch (error) {
      console.error('Error getting portfolio performance:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get portfolio performance',
        error: error.message
      });
    }
  }
];

/**
 * Get asset class performance data
 * @param req Request
 * @param res Response
 */
export const getAssetClassPerformance = [
  validationMiddleware,
  
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }
      
      const assetPerformance = await analyticsModel.getAssetClassPerformance(userId);
      
      return res.status(200).json({
        success: true,
        message: 'Asset class performance retrieved successfully',
        data: assetPerformance
      });
    } catch (error) {
      console.error('Error getting asset class performance:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get asset class performance',
        error: error.message
      });
    }
  }
];

/**
 * Get individual investment performance data
 * @param req Request
 * @param res Response
 */
export const getInvestmentPerformance = [
  validationMiddleware,
  
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }
      
      const investmentPerformance = await analyticsModel.getInvestmentPerformance(userId);
      
      return res.status(200).json({
        success: true,
        message: 'Investment performance retrieved successfully',
        data: investmentPerformance
      });
    } catch (error) {
      console.error('Error getting investment performance:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get investment performance',
        error: error.message
      });
    }
  }
];

/**
 * Get specific investment performance data
 * @param req Request
 * @param res Response
 */
export const getSingleInvestmentPerformance = [
  param('investmentId')
    .isString()
    .withMessage('Investment ID is required'),
    
  validationMiddleware,
  
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }
      
      const { investmentId } = req.params;
      
      // Get all investment performances and filter the specific one
      const allPerformance = await analyticsModel.getInvestmentPerformance(userId);
      const investment = allPerformance.find(inv => inv.id === investmentId);
      
      if (!investment) {
        return res.status(404).json({
          success: false,
          message: 'Investment not found or does not belong to user'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Investment performance retrieved successfully',
        data: investment
      });
    } catch (error) {
      console.error('Error getting investment performance:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get investment performance',
        error: error.message
      });
    }
  }
];

/**
 * Get portfolio summary data
 * @param req Request
 * @param res Response
 */
export const getPortfolioSummary = [
  validationMiddleware,
  
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }
      
      const summary = await analyticsModel.getPortfolioSummary(userId);
      
      return res.status(200).json({
        success: true,
        message: 'Portfolio summary retrieved successfully',
        data: summary
      });
    } catch (error) {
      console.error('Error getting portfolio summary:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get portfolio summary',
        error: error.message
      });
    }
  }
];

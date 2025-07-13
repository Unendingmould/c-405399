import { Router } from 'express';
import * as analyticsController from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route GET /api/analytics/portfolio
 * @desc Get portfolio performance data
 * @access Private
 */
router.get('/portfolio', analyticsController.getPortfolioPerformance);

/**
 * @route GET /api/analytics/assets
 * @desc Get asset class performance data
 * @access Private
 */
router.get('/assets', analyticsController.getAssetClassPerformance);

/**
 * @route GET /api/analytics/investments
 * @desc Get all investments performance data
 * @access Private
 */
router.get('/investments', analyticsController.getInvestmentPerformance);

/**
 * @route GET /api/analytics/investments/:investmentId
 * @desc Get specific investment performance data
 * @access Private
 */
router.get('/investments/:investmentId', analyticsController.getSingleInvestmentPerformance);

/**
 * @route GET /api/analytics/summary
 * @desc Get portfolio summary data
 * @access Private
 */
router.get('/summary', analyticsController.getPortfolioSummary);

export default router;

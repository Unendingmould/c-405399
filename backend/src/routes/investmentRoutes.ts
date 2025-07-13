import express from 'express';
import * as investmentController from '../controllers/investmentController';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/authenticate';
import { checkRole } from '../middleware/authorize';

const router = express.Router();

// Public routes - only for viewing available investment plans
router.get('/plans', investmentController.getInvestmentPlans);
router.get('/plans/:id', investmentController.getInvestmentPlanById);

// Protected routes - require authentication
router.use(authenticate);

// User investment routes - for regular users
router.get('/user', investmentController.getUserInvestments);
router.get('/user/:id', investmentController.getUserInvestmentById);
router.post(
  '/user',
  investmentController.validate.createUserInvestment,
  validateRequest,
  investmentController.createUserInvestment
);
router.post(
  '/user/:id/transactions',
  investmentController.validate.addTransaction,
  validateRequest,
  investmentController.addInvestmentTransaction
);

// Admin-only routes - for managing investment plans
router.post(
  '/plans',
  checkRole('admin'),
  investmentController.validate.createInvestmentPlan,
  validateRequest,
  investmentController.createInvestmentPlan
);
router.put(
  '/plans/:id',
  checkRole('admin'),
  validateRequest,
  investmentController.updateInvestmentPlan
);
router.delete(
  '/plans/:id',
  checkRole('admin'),
  investmentController.deleteInvestmentPlan
);

export default router;

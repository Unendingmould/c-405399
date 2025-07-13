import express from 'express';
import * as transactionController from '../controllers/transactionController';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/authenticate';
import { checkRole } from '../middleware/authorize';

const router = express.Router();

// All transaction routes require authentication
router.use(authenticate);

// User transaction routes
router.post(
  '/',
  transactionController.validate.createTransaction,
  validateRequest,
  transactionController.createTransaction
);

router.get(
  '/',
  transactionController.validate.getTransactions,
  validateRequest,
  transactionController.getUserTransactions
);

router.get(
  '/summary',
  transactionController.getTransactionSummary
);

router.get(
  '/investments/:investmentId',
  transactionController.getTransactionsByInvestmentId
);

router.get(
  '/:id',
  transactionController.getTransactionById
);

// Admin-only routes
router.get(
  '/admin/all',
  checkRole('admin'),
  transactionController.validate.getTransactions,
  validateRequest,
  transactionController.getAllTransactions
);

router.patch(
  '/:id/status',
  checkRole('admin'),
  transactionController.validate.updateTransactionStatus,
  validateRequest,
  transactionController.updateTransactionStatus
);

export default router;

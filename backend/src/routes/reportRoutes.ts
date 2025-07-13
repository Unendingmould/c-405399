import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import * as reportController from '../controllers/reportController';

const router = Router();

/**
 * Report routes - all routes require authentication
 */

// Create report request
router.post(
  '/',
  authenticate,
  reportController.validate.createReportRequest,
  reportController.createReportRequest
);

// Get all user reports with optional filtering
router.get(
  '/',
  authenticate,
  reportController.validate.getUserReports,
  reportController.getUserReports
);

// Get report by ID
router.get(
  '/:id',
  authenticate,
  reportController.validate.getReportById,
  reportController.getReportById
);

// Download report file
router.get(
  '/:id/download',
  authenticate,
  reportController.validate.downloadReport,
  reportController.downloadReport
);

// Delete report
router.delete(
  '/:id',
  authenticate,
  reportController.validate.deleteReport,
  reportController.deleteReport
);

export default router;

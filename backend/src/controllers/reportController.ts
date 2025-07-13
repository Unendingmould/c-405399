import { Request, Response } from 'express';
import { body, query, param } from 'express-validator';
import { Report, ReportType, ReportFormat, ReportStatus } from '../models/reportModel';
import { validateRequest } from '../middleware/validateRequest';

const reportModel = new Report();

/**
 * Create a new report request
 * @route POST /api/reports
 */
export const createReportRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId as string;
    const { type, format, parameters } = req.body;

    const report = await reportModel.createReportRequest(
      userId,
      type as ReportType,
      format as ReportFormat,
      parameters
    );

    // Start generating the report asynchronously
    generateReportAsync(report.id!, userId, type as ReportType, format as ReportFormat, parameters);

    return res.status(201).json({
      status: 'success',
      data: report
    });
  } catch (error) {
    console.error('Error creating report request:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create report request'
    });
  }
};

/**
 * Get user reports with optional filtering
 * @route GET /api/reports
 */
export const getUserReports = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId as string;
    const { type, limit = '10', startAfter } = req.query;

    const reports = await reportModel.getUserReports(
      userId,
      type as ReportType | undefined,
      parseInt(limit as string, 10),
      startAfter as string | undefined
    );

    return res.status(200).json({
      status: 'success',
      data: reports
    });
  } catch (error) {
    console.error('Error getting user reports:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get reports'
    });
  }
};

/**
 * Get a report by ID
 * @route GET /api/reports/:id
 */
export const getReportById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId as string;

    const report = await reportModel.getReportById(id, userId);

    if (!report) {
      return res.status(404).json({
        status: 'error',
        message: 'Report not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: report
    });
  } catch (error) {
    console.error('Error getting report by ID:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get report'
    });
  }
};

/**
 * Download a report file
 * @route GET /api/reports/:id/download
 */
export const downloadReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId as string;

    // Get report data
    const report = await reportModel.getReportById(id, userId);

    if (!report) {
      return res.status(404).json({
        status: 'error',
        message: 'Report not found'
      });
    }

    if (report.status !== ReportStatus.COMPLETED) {
      return res.status(400).json({
        status: 'error',
        message: `Report is not ready for download (status: ${report.status})`
      });
    }

    // Get file path
    const filePath = await reportModel.getReportFilePath(id, userId);

    if (!filePath) {
      return res.status(404).json({
        status: 'error',
        message: 'Report file not found'
      });
    }

    // Set content type based on format
    const contentType = report.format === ReportFormat.PDF 
      ? 'application/pdf' 
      : 'text/csv';
    
    // Set filename for download
    const filename = report.fileName || `report-${id}.${report.format === ReportFormat.PDF ? 'pdf' : 'csv'}`;

    // Send file
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    return res.download(filePath, filename);
  } catch (error) {
    console.error('Error downloading report:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to download report'
    });
  }
};

/**
 * Delete a report
 * @route DELETE /api/reports/:id
 */
export const deleteReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId as string;

    const success = await reportModel.deleteReport(id, userId);

    if (!success) {
      return res.status(404).json({
        status: 'error',
        message: 'Report not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Report deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete report'
    });
  }
};

/**
 * Generate report asynchronously
 * This function will be called in the background and will update the report status
 */
async function generateReportAsync(
  reportId: string, 
  userId: string,
  type: ReportType,
  format: ReportFormat,
  parameters?: Record<string, any>
) {
  try {
    // Generate the report based on type
    switch (type) {
      case ReportType.PORTFOLIO_SUMMARY:
        await reportModel.generatePortfolioSummary(userId, format, reportId);
        break;

      case ReportType.TRANSACTION_HISTORY:
        // Extract date range if provided
        let dateRange = undefined;
        if (parameters?.startDate && parameters?.endDate) {
          dateRange = {
            startDate: new Date(parameters.startDate),
            endDate: new Date(parameters.endDate)
          };
        }
        
        await reportModel.generateTransactionHistory(userId, format, reportId, dateRange);
        break;

      case ReportType.PERFORMANCE_ANALYSIS:
        // Not implemented yet
        await reportModel.updateReportStatus(reportId, ReportStatus.FAILED, {
          userId,
          errorMessage: 'Performance analysis reports are not implemented yet'
        });
        break;

      case ReportType.TAX_STATEMENT:
        // Not implemented yet
        await reportModel.updateReportStatus(reportId, ReportStatus.FAILED, {
          userId,
          errorMessage: 'Tax statement reports are not implemented yet'
        });
        break;

      default:
        await reportModel.updateReportStatus(reportId, ReportStatus.FAILED, {
          userId,
          errorMessage: `Unknown report type: ${type}`
        });
    }
  } catch (error) {
    console.error(`Error generating ${type} report:`, error);
    
    // Update report status to failed
    await reportModel.updateReportStatus(reportId, ReportStatus.FAILED, {
      userId,
      errorMessage: error instanceof Error ? error.message : 'Unknown error during report generation'
    });
  }
}

/**
 * Validation schemas for report routes
 */
export const validate = {
  createReportRequest: [
    body('type')
      .isIn(Object.values(ReportType))
      .withMessage(`Type must be one of: ${Object.values(ReportType).join(', ')}`),
    body('format')
      .isIn(Object.values(ReportFormat))
      .withMessage(`Format must be one of: ${Object.values(ReportFormat).join(', ')}`),
    body('parameters')
      .optional()
      .isObject()
      .withMessage('Parameters must be an object'),
    validateRequest
  ],
  getUserReports: [
    query('type')
      .optional()
      .isIn(Object.values(ReportType))
      .withMessage(`Type must be one of: ${Object.values(ReportType).join(', ')}`),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be a number between 1 and 100'),
    validateRequest
  ],
  getReportById: [
    param('id')
      .notEmpty()
      .withMessage('Report ID is required'),
    validateRequest
  ],
  downloadReport: [
    param('id')
      .notEmpty()
      .withMessage('Report ID is required'),
    validateRequest
  ],
  deleteReport: [
    param('id')
      .notEmpty()
      .withMessage('Report ID is required'),
    validateRequest
  ]
};

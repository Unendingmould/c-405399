import { firestore } from 'firebase-admin';
import { db } from '../config/firebase';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { v4 as uuidv4 } from 'uuid';
import PDFDocument from 'pdfkit';
import { createObjectCsvWriter } from 'csv-writer';
import { Transaction } from './transactionModel';
import InvestmentModel from './FirebaseInvestment';

/**
 * Report types supported by the system
 */
export enum ReportType {
  PORTFOLIO_SUMMARY = 'portfolio_summary',
  TRANSACTION_HISTORY = 'transaction_history',
  PERFORMANCE_ANALYSIS = 'performance_analysis',
  TAX_STATEMENT = 'tax_statement',
}

/**
 * Report formats supported by the system
 */
export enum ReportFormat {
  PDF = 'pdf',
  CSV = 'csv',
}

/**
 * Report status values
 */
export enum ReportStatus {
  PENDING = 'pending',
  GENERATING = 'generating',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

/**
 * Report data structure
 */
export interface ReportData {
  id?: string;
  userId: string;
  type: ReportType;
  format: ReportFormat;
  status: ReportStatus;
  createdAt: firestore.Timestamp;
  completedAt?: firestore.Timestamp;
  downloadUrl?: string;
  parameters?: Record<string, any>;
  fileName?: string;
  fileSize?: number;
  errorMessage?: string;
}

/**
 * Date range parameter for reports
 */
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

/**
 * Report class for generating investment reports
 */
export class Report {
  private collectionRef = db.collection('reports');
  // Store transactions directly in Firestore
  private transactionsRef = db.collection('transactions');
  private tempDir = path.join(os.tmpdir(), 'investment-reports');
  
  constructor() {
    // Ensure temporary directory exists
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }
  
  /**
   * Create a new report request
   * @param data Report request data
   * @returns Created report record
   */
  async createReportRequest(
    userId: string, 
    type: ReportType, 
    format: ReportFormat, 
    parameters?: Record<string, any>
  ): Promise<ReportData> {
    try {
      const reportData: Omit<ReportData, 'id'> = {
        userId,
        type,
        format,
        status: ReportStatus.PENDING,
        createdAt: firestore.Timestamp.now(),
        parameters,
      };
      
      const docRef = await this.collectionRef.add(reportData);
      const doc = await docRef.get();
      
      return {
        id: doc.id,
        ...doc.data() as Omit<ReportData, 'id'>
      };
    } catch (error) {
      console.error('Error creating report request:', error);
      throw new Error('Failed to create report request');
    }
  }
  
  /**
   * Get report by ID
   * @param id Report ID
   * @param userId User ID for verification
   * @returns Report data or null if not found
   */
  async getReportById(id: string, userId: string): Promise<ReportData | null> {
    try {
      const doc = await this.collectionRef.doc(id).get();
      
      if (!doc.exists) {
        return null;
      }
      
      const reportData = doc.data() as Omit<ReportData, 'id'>;
      
      // Verify ownership
      if (reportData.userId !== userId) {
        return null;
      }
      
      return {
        id: doc.id,
        ...reportData
      };
    } catch (error) {
      console.error('Error getting report by ID:', error);
      throw new Error('Failed to get report');
    }
  }
  
  /**
   * Get user reports with optional filtering
   * @param userId User ID
   * @param type Optional report type filter
   * @param limit Results limit (default: 10)
   * @param startAfter Pagination cursor
   * @returns Reports list and pagination info
   */
  async getUserReports(
    userId: string,
    type?: ReportType,
    limit: number = 10,
    startAfter?: string
  ): Promise<{ reports: ReportData[]; lastDoc: string | null }> {
    try {
      let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = this.collectionRef
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc');
      
      if (type) {
        query = query.where('type', '==', type);
      }
      
      if (startAfter) {
        const startAfterDoc = await this.collectionRef.doc(startAfter).get();
        if (startAfterDoc.exists) {
          query = query.startAfter(startAfterDoc);
        }
      }
      
      query = query.limit(limit);
      
      const querySnapshot = await query.get();
      
      const reports: ReportData[] = [];
      querySnapshot.forEach(doc => {
        reports.push({
          id: doc.id,
          ...doc.data() as Omit<ReportData, 'id'>
        });
      });
      
      const lastDoc = querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1].id : null;
      
      return {
        reports,
        lastDoc
      };
    } catch (error) {
      console.error('Error getting user reports:', error);
      throw new Error('Failed to get reports');
    }
  }
  
  /**
   * Update report status
   * @param id Report ID
   * @param status New status
   * @param updateData Additional data to update
   * @returns Updated report data
   */
  async updateReportStatus(
    id: string, 
    status: ReportStatus, 
    updateData: Partial<ReportData> = {}
  ): Promise<ReportData | null> {
    try {
      const report = await this.getReportById(id, updateData.userId || '');
      
      if (!report) {
        return null;
      }
      
      const data: Partial<ReportData> = {
        status,
        ...updateData
      };
      
      if (status === ReportStatus.COMPLETED) {
        data.completedAt = firestore.Timestamp.now();
      }
      
      await this.collectionRef.doc(id).update(data);
      
      return {
        ...report,
        ...data
      };
    } catch (error) {
      console.error('Error updating report status:', error);
      throw new Error('Failed to update report status');
    }
  }
  
  /**
   * Delete a report
   * @param id Report ID
   * @param userId User ID for verification
   * @returns Success status
   */
  async deleteReport(id: string, userId: string): Promise<boolean> {
    try {
      const report = await this.getReportById(id, userId);
      
      if (!report) {
        return false;
      }
      
      // Delete the associated file if it exists
      if (report.fileName) {
        const filePath = path.join(this.tempDir, report.fileName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      
      await this.collectionRef.doc(id).delete();
      return true;
    } catch (error) {
      console.error('Error deleting report:', error);
      throw new Error('Failed to delete report');
    }
  }
  
  /**
   * Generate a portfolio summary report
   * @param userId User ID
   * @param format Report format
   * @param reportId Report ID for updating status
   * @returns Path to the generated file
   */
  async generatePortfolioSummary(
    userId: string, 
    format: ReportFormat,
    reportId: string
  ): Promise<string> {
    try {
      // Update report status to generating
      await this.updateReportStatus(reportId, ReportStatus.GENERATING, { userId });
      
      // Get user investments
      const investments = await InvestmentModel.getUserInvestments(userId);
      
      // Generate filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `portfolio-summary-${userId.substring(0, 5)}-${timestamp}.${format === ReportFormat.PDF ? 'pdf' : 'csv'}`;
      const filePath = path.join(this.tempDir, fileName);
      
      // Calculate totals - adapt to match your actual investment data structure
      const totalInvested = investments.reduce((sum, inv) => {
        // Access the amount from the correct property based on your data structure
        const amount = inv.amount || inv.initialAmount || 0;
        return sum + amount;
      }, 0);
      
      const currentValue = investments.reduce((sum, inv) => {
        // Calculate current value based on your data structure
        const value = inv.currentValue || inv.amount || 0;
        return sum + value;
      }, 0);
      const totalReturn = currentValue - totalInvested;
      const percentReturn = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;
      
      // Generate report based on format
      if (format === ReportFormat.PDF) {
        await this.generatePortfolioSummaryPDF(investments, filePath, {
          totalInvested,
          currentValue,
          totalReturn,
          percentReturn
        });
      } else {
        await this.generatePortfolioSummaryCSV(investments, filePath, {
          totalInvested,
          currentValue,
          totalReturn,
          percentReturn
        });
      }
      
      // Get file size
      const stats = fs.statSync(filePath);
      
      // Update report with file information
      await this.updateReportStatus(reportId, ReportStatus.COMPLETED, {
        userId,
        fileName,
        fileSize: stats.size,
        downloadUrl: `/api/reports/${reportId}/download`
      });
      
      return filePath;
    } catch (error) {
      console.error('Error generating portfolio summary:', error);
      
      // Update report status to failed
      await this.updateReportStatus(reportId, ReportStatus.FAILED, {
        userId,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw new Error('Failed to generate portfolio summary report');
    }
  }
  
  /**
   * Generate portfolio summary as PDF
   * @param investments User investments
   * @param filePath Output file path
   * @param totals Portfolio totals
   */
  private async generatePortfolioSummaryPDF(
    investments: any[],
    filePath: string,
    totals: { totalInvested: number; currentValue: number; totalReturn: number; percentReturn: number }
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new (PDFDocument as any)({ margin: 50 });
        const writeStream = fs.createWriteStream(filePath);
        
        doc.pipe(writeStream);
        
        // Add report title
        doc.fontSize(25).text('Portfolio Summary Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
        doc.moveDown(2);
        
        // Add portfolio overview
        doc.fontSize(16).text('Portfolio Overview', { underline: true });
        doc.moveDown();
        doc.fontSize(12).text(`Total Invested: $${totals.totalInvested.toFixed(2)}`);
        doc.text(`Current Value: $${totals.currentValue.toFixed(2)}`);
        doc.text(`Total Return: $${totals.totalReturn.toFixed(2)} (${totals.percentReturn.toFixed(2)}%)`);
        doc.moveDown(2);
        
        // Add investments table
        doc.fontSize(16).text('Investments', { underline: true });
        doc.moveDown();
        
        // Table headers
        const tableTop = doc.y;
        const tableLeft = 50;
        const colWidths = [180, 100, 100, 100];
        
        doc.fontSize(12);
        doc.text('Investment Name', tableLeft, tableTop);
        doc.text('Initial Amount', tableLeft + colWidths[0], tableTop);
        doc.text('Current Value', tableLeft + colWidths[0] + colWidths[1], tableTop);
        doc.text('Return', tableLeft + colWidths[0] + colWidths[1] + colWidths[2], tableTop);
        
        doc.moveTo(tableLeft, tableTop + 20)
           .lineTo(tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], tableTop + 20)
           .stroke();
        
        // Table rows
        let yOffset = tableTop + 30;
        
        investments.forEach(investment => {
          const investmentReturn = (investment.currentValue || 0) - (investment.initialAmount || 0);
          const returnPercent = (investment.initialAmount || 0) > 0 
            ? (investmentReturn / (investment.initialAmount || 1)) * 100 
            : 0;
          
          doc.text(investment.name, tableLeft, yOffset);
          doc.text(`$${investment.initialAmount.toFixed(2)}`, tableLeft + colWidths[0], yOffset);
          doc.text(`$${investment.currentValue.toFixed(2)}`, tableLeft + colWidths[0] + colWidths[1], yOffset);
          doc.text(
            `$${investmentReturn.toFixed(2)} (${returnPercent.toFixed(2)}%)`, 
            tableLeft + colWidths[0] + colWidths[1] + colWidths[2], 
            yOffset
          );
          
          yOffset += 20;
          
          // Add new page if we're near the bottom
          if (yOffset > doc.page.height - 100) {
            doc.addPage();
            yOffset = 50;
          }
        });
        
        // Add disclaimer
        doc.moveDown(2);
        doc.fontSize(10).text(
          'Disclaimer: Past performance is not indicative of future results. This report is for informational purposes only.',
          { align: 'center', italic: true }
        );
        
        // Finalize document
        doc.end();
        
        writeStream.on('finish', () => {
          resolve();
        });
        
        writeStream.on('error', (err) => {
          reject(err);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  
  /**
   * Generate portfolio summary as CSV
   * @param investments User investments
   * @param filePath Output file path
   * @param totals Portfolio totals
   */
  private async generatePortfolioSummaryCSV(
    investments: any[],
    filePath: string,
    totals: { totalInvested: number; currentValue: number; totalReturn: number; percentReturn: number }
  ): Promise<void> {
    try {
      // Create CSV headers
      const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: [
          { id: 'name', title: 'Investment Name' },
          { id: 'initialAmount', title: 'Initial Amount ($)' },
          { id: 'currentValue', title: 'Current Value ($)' },
          { id: 'return', title: 'Return ($)' },
          { id: 'returnPercent', title: 'Return (%)' },
          { id: 'startDate', title: 'Start Date' },
        ]
      });
      
      // Prepare data
      const records = investments.map(investment => {
        const investmentReturn = (investment.currentValue || 0) - (investment.initialAmount || 0);
        const returnPercent = investment.initialAmount > 0 
          ? (investmentReturn / investment.initialAmount) * 100 
          : 0;
        
        return {
          name: investment.name,
          initialAmount: (investment.initialAmount || 0).toFixed(2),
          currentValue: (investment.currentValue || 0).toFixed(2),
          return: investmentReturn.toFixed(2),
          returnPercent: returnPercent.toFixed(2),
          startDate: investment.startDate ? new Date(investment.startDate).toLocaleDateString() : 'N/A',
        };
      });
      
      // Add summary row
      records.push({
        name: 'PORTFOLIO TOTAL',
        initialAmount: totals.totalInvested.toFixed(2),
        currentValue: totals.currentValue.toFixed(2),
        return: totals.totalReturn.toFixed(2),
        returnPercent: totals.percentReturn.toFixed(2),
        startDate: '',
      });
      
      // Write to CSV
      await csvWriter.writeRecords(records);
    } catch (error) {
      console.error('Error generating CSV:', error);
      throw new Error('Failed to generate CSV file');
    }
  }
  
  /**
   * Generate a transaction history report
   * @param userId User ID
   * @param format Report format
   * @param reportId Report ID for updating status
   * @param dateRange Optional date range filter
   * @returns Path to the generated file
   */
  async generateTransactionHistory(
    userId: string, 
    format: ReportFormat,
    reportId: string,
    dateRange?: DateRange
  ): Promise<string> {
    try {
      // Update report status to generating
      await this.updateReportStatus(reportId, ReportStatus.GENERATING, { userId });
      
      // Define date filters if specified
      let startDate: Date | undefined;
      let endDate: Date | undefined;
      
      if (dateRange) {
        startDate = dateRange.startDate;
        endDate = dateRange.endDate;
      }
      
      // Get user transactions directly from Firestore
      let query = this.transactionsRef.where('userId', '==', userId).limit(100);
      
      // Apply date filters if specified
      if (startDate) {
        query = query.where('createdAt', '>=', firestore.Timestamp.fromDate(startDate));
      }
      
      if (endDate) {
        query = query.where('createdAt', '<=', firestore.Timestamp.fromDate(endDate));
      }
      
      const snapshot = await query.get();
      const transactions = { transactions: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) };
      
      // Generate filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `transaction-history-${userId.substring(0, 5)}-${timestamp}.${format === ReportFormat.PDF ? 'pdf' : 'csv'}`;
      const filePath = path.join(this.tempDir, fileName);
      
      // Generate report based on format
      if (format === ReportFormat.PDF) {
        await this.generateTransactionHistoryPDF(transactions.transactions, filePath, dateRange);
      } else {
        await this.generateTransactionHistoryCSV(transactions.transactions, filePath);
      }
      
      // Get file size
      const stats = fs.statSync(filePath);
      
      // Update report with file information
      await this.updateReportStatus(reportId, ReportStatus.COMPLETED, {
        userId,
        fileName,
        fileSize: stats.size,
        downloadUrl: `/api/reports/${reportId}/download`
      });
      
      return filePath;
    } catch (error) {
      console.error('Error generating transaction history:', error);
      
      // Update report status to failed
      await this.updateReportStatus(reportId, ReportStatus.FAILED, {
        userId,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw new Error('Failed to generate transaction history report');
    }
  }
  
  /**
   * Generate transaction history as PDF
   * @param transactions User transactions
   * @param filePath Output file path
   * @param dateRange Optional date range
   */
  private async generateTransactionHistoryPDF(
    transactions: any[],
    filePath: string,
    dateRange?: DateRange
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new (PDFDocument as any)({ margin: 50 });
        const writeStream = fs.createWriteStream(filePath);
        
        doc.pipe(writeStream);
        
        // Add report title
        doc.fontSize(25).text('Transaction History Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
        doc.moveDown();
        
        // Add date range if specified
        if (dateRange) {
          doc.fontSize(12).text(
            `Date Range: ${dateRange.startDate.toLocaleDateString()} to ${dateRange.endDate.toLocaleDateString()}`,
            { align: 'center' }
          );
          doc.moveDown();
        }
        
        doc.moveDown();
        
        // Add transactions table
        const tableTop = doc.y;
        const tableLeft = 50;
        const colWidths = [100, 80, 100, 100, 100];
        
        doc.fontSize(12);
        doc.text('Date', tableLeft, tableTop);
        doc.text('Type', tableLeft + colWidths[0], tableTop);
        doc.text('Amount', tableLeft + colWidths[0] + colWidths[1], tableTop);
        doc.text('Status', tableLeft + colWidths[0] + colWidths[1] + colWidths[2], tableTop);
        doc.text('Description', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], tableTop);
        
        doc.moveTo(tableLeft, tableTop + 20)
           .lineTo(tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], tableTop + 20)
           .stroke();
        
        // Table rows
        let yOffset = tableTop + 30;
        
        transactions.forEach(transaction => {
          const date = transaction.createdAt ? 
            new Date(transaction.createdAt.seconds * 1000).toLocaleDateString() : 'N/A';
          
          doc.text(date, tableLeft, yOffset);
          doc.text(transaction.type || 'N/A', tableLeft + colWidths[0], yOffset);
          doc.text(`$${transaction.amount ? transaction.amount.toFixed(2) : '0.00'}`, tableLeft + colWidths[0] + colWidths[1], yOffset);
          doc.text(transaction.status || 'N/A', tableLeft + colWidths[0] + colWidths[1] + colWidths[2], yOffset);
          
          // Handle description text wrapping
          const description = transaction.description || 'N/A';
          const descriptionX = tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3];
          const descWidth = colWidths[4];
          
          const descriptionLines = doc.heightOfString(description, { width: descWidth });
          const lineHeight = descriptionLines / description.length * 12; // Approximate line height
          
          doc.text(description, descriptionX, yOffset, { width: descWidth });
          
          // Calculate height of this row based on description
          const rowHeight = Math.max(20, lineHeight);
          yOffset += rowHeight + 5;
          
          // Add new page if we're near the bottom
          if (yOffset > doc.page.height - 100) {
            doc.addPage();
            yOffset = 50;
          }
        });
        
        // Add disclaimer
        doc.moveDown(2);
        doc.fontSize(10).text(
          'Disclaimer: This report is for informational purposes only. Please verify all transactions with your financial institution.',
          { align: 'center', italic: true }
        );
        
        // Finalize document
        doc.end();
        
        writeStream.on('finish', () => {
          resolve();
        });
        
        writeStream.on('error', (err) => {
          reject(err);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  
  /**
   * Generate transaction history as CSV
   * @param transactions User transactions
   * @param filePath Output file path
   */
  private async generateTransactionHistoryCSV(
    transactions: any[],
    filePath: string
  ): Promise<void> {
    try {
      // Create CSV headers
      const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: [
          { id: 'date', title: 'Date' },
          { id: 'type', title: 'Type' },
          { id: 'amount', title: 'Amount ($)' },
          { id: 'status', title: 'Status' },
          { id: 'description', title: 'Description' },
          { id: 'reference', title: 'Reference' },
        ]
      });
      
      // Prepare data
      const records = transactions.map(transaction => {
        const date = transaction.createdAt ? 
          new Date(transaction.createdAt.seconds * 1000).toLocaleDateString() : 'N/A';
        
        return {
          date,
          type: transaction.type || 'N/A',
          amount: transaction.amount ? transaction.amount.toFixed(2) : '0.00',
          status: transaction.status || 'N/A',
          description: transaction.description || '',
          reference: transaction.reference || '',
        };
      });
      
      // Write to CSV
      await csvWriter.writeRecords(records);
    } catch (error) {
      console.error('Error generating CSV:', error);
      throw new Error('Failed to generate CSV file');
    }
  }
  
  /**
   * Get report file path for download
   * @param reportId Report ID
   * @param userId User ID for verification
   * @returns File path or null if not found
   */
  async getReportFilePath(reportId: string, userId: string): Promise<string | null> {
    try {
      const report = await this.getReportById(reportId, userId);
      
      if (!report || report.status !== ReportStatus.COMPLETED || !report.fileName) {
        return null;
      }
      
      const filePath = path.join(this.tempDir, report.fileName);
      
      if (!fs.existsSync(filePath)) {
        return null;
      }
      
      return filePath;
    } catch (error) {
      console.error('Error getting report file path:', error);
      return null;
    }
  }
}

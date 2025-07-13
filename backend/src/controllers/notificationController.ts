import { Request, Response } from 'express';
import { param, query } from 'express-validator';
import { Notification, NotificationStatus, NotificationType, NotificationPriority } from '../models/notificationModel';
import { validationMiddleware } from '../middleware/validationMiddleware';
import { TokenPayload } from '../utils/token';
import { emitNewNotification } from '../utils/eventEmitters';

// Extend TokenPayload to include role
declare module '../utils/token' {
  interface TokenPayload {
    userId: string;
    email: string;
    role?: string;
  }
}

// Initialize notification model
const notificationModel = new Notification();

/**
 * Get user notifications with pagination
 * @param req Request
 * @param res Response
 */
export const getUserNotifications = [
  query('status')
    .optional()
    .isIn(Object.values(NotificationStatus))
    .withMessage('Invalid notification status'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
    
  query('startAfter')
    .optional()
    .isString()
    .withMessage('Invalid pagination cursor'),
    
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
      
      const status = req.query.status as NotificationStatus | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const startAfter = req.query.startAfter as string | undefined;
      
      const result = await notificationModel.getUserNotifications(
        userId, 
        status,
        limit,
        startAfter
      );
      
      return res.status(200).json({
        success: true,
        message: 'Notifications retrieved successfully',
        data: {
          notifications: result.notifications,
          pagination: {
            lastDoc: result.lastDoc,
            hasMore: !!result.lastDoc
          }
        }
      });
    } catch (error: any) {
      console.error('Error getting user notifications:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get notifications',
        error: error.message || 'Unknown error'
      });
    }
  }
];

/**
 * Get unread notification count for user
 * @param req Request
 * @param res Response
 */
export const getUnreadCount = [
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
      
      const count = await notificationModel.getUnreadCount(userId);
      
      return res.status(200).json({
        success: true,
        message: 'Unread count retrieved successfully',
        data: { count }
      });
    } catch (error: any) {
      console.error('Error getting unread count:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get unread count',
        error: error.message || 'Unknown error'
      });
    }
  }
];

/**
 * Mark notification as read
 * @param req Request
 * @param res Response
 */
export const markAsRead = [
  param('id')
    .isString()
    .withMessage('Notification ID is required'),
    
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
      
      const { id } = req.params;
      
      const notification = await notificationModel.markAsRead(id, userId);
      
      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found or does not belong to user'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Notification marked as read',
        data: notification
      });
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to mark notification as read',
        error: error.message || 'Unknown error'
      });
    }
  }
];

/**
 * Mark all notifications as read
 * @param req Request
 * @param res Response
 */
export const markAllAsRead = [
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
      
      const count = await notificationModel.markAllAsRead(userId);
      
      return res.status(200).json({
        success: true,
        message: `Marked ${count} notifications as read`,
        data: { count }
      });
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to mark notifications as read',
        error: error.message || 'Unknown error'
      });
    }
  }
];

/**
 * Archive notification
 * @param req Request
 * @param res Response
 */
export const archiveNotification = [
  param('id')
    .isString()
    .withMessage('Notification ID is required'),
    
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
      
      const { id } = req.params;
      
      const notification = await notificationModel.archive(id, userId);
      
      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found or does not belong to user'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Notification archived',
        data: notification
      });
    } catch (error: any) {
      console.error('Error archiving notification:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to archive notification',
        error: error.message || 'Unknown error'
      });
    }
  }
];

/**
 * Delete notification
 * @param req Request
 * @param res Response
 */
export const deleteNotification = [
  param('id')
    .isString()
    .withMessage('Notification ID is required'),
    
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
      
      const { id } = req.params;
      
      const success = await notificationModel.delete(id, userId);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found or does not belong to user'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Notification deleted',
        data: { id }
      });
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete notification',
        error: error.message || 'Unknown error'
      });
    }
  }
];

/**
 * Delete all notifications
 * @param req Request
 * @param res Response
 */
export const deleteAllNotifications = [
  query('status')
    .optional()
    .isIn(Object.values(NotificationStatus))
    .withMessage('Invalid notification status'),
    
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
      
      const status = req.query.status as NotificationStatus | undefined;
      
      const count = await notificationModel.deleteAll(userId, status);
      
      return res.status(200).json({
        success: true,
        message: `Deleted ${count} notifications`,
        data: { count }
      });
    } catch (error: any) {
      console.error('Error deleting notifications:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete notifications',
        error: error.message || 'Unknown error'
      });
    }
  }
];

/**
 * Create a notification (admin only)
 * @param req Request
 * @param res Response
 */
export const createNotification = [
  validationMiddleware,
  
  async (req: Request, res: Response) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }
      
      // Check if user is admin
      if (user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: Admin access required'
        });
      }
      
      const { userId, type, title, message, priority, metadata, relatedItemId, relatedItemType } = req.body;
      
      if (!userId || !type || !title || !message) {
        return res.status(400).json({
          success: false,
          message: 'Required fields missing: userId, type, title, message'
        });
      }
      
      // Validate notification type
      if (!Object.values(NotificationType).includes(type)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid notification type'
        });
      }
      
      // Validate notification priority
      const notificationPriority = priority || NotificationPriority.MEDIUM;
      if (!Object.values(NotificationPriority).includes(notificationPriority)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid notification priority'
        });
      }
      
      const notification = await notificationModel.create({
        userId,
        type,
        title,
        message,
        priority: notificationPriority,
        metadata,
        relatedItemId,
        relatedItemType
      });
      
      emitNewNotification(userId, notification);
      
      return res.status(201).json({
        success: true,
        message: 'Notification created successfully',
        data: notification
      });
    } catch (error: any) {
      console.error('Error creating notification:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create notification',
        error: error.message || 'Unknown error'
      });
    }
  }
];

/**
 * Create a notification utility function for internal use
 * @param data Notification data
 * @returns Created notification or null on error
 */
export const createNotificationUtil = async (
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  options?: {
    priority?: NotificationPriority;
    metadata?: Record<string, any>;
    relatedItemId?: string;
    relatedItemType?: string;
  }
): Promise<any> => {
  try {
    const notification = await notificationModel.create({
      userId,
      type,
      title,
      message,
      priority: options?.priority || NotificationPriority.MEDIUM,
      metadata: options?.metadata,
      relatedItemId: options?.relatedItemId,
      relatedItemType: options?.relatedItemType
    });
    
    return notification;
  } catch (error: any) {
    console.error('Error creating notification:', error);
    return null;
  }
};

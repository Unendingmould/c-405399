import { Router } from 'express';
import * as notificationController from '../controllers/notificationController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route GET /api/notifications
 * @desc Get user notifications
 * @access Private
 */
router.get('/', notificationController.getUserNotifications);

/**
 * @route GET /api/notifications/unread-count
 * @desc Get unread notification count
 * @access Private
 */
router.get('/unread-count', notificationController.getUnreadCount);

/**
 * @route PATCH /api/notifications/:id/read
 * @desc Mark notification as read
 * @access Private
 */
router.patch('/:id/read', notificationController.markAsRead);

/**
 * @route PATCH /api/notifications/read-all
 * @desc Mark all notifications as read
 * @access Private
 */
router.patch('/read-all', notificationController.markAllAsRead);

/**
 * @route PATCH /api/notifications/:id/archive
 * @desc Archive notification
 * @access Private
 */
router.patch('/:id/archive', notificationController.archiveNotification);

/**
 * @route DELETE /api/notifications/:id
 * @desc Delete notification
 * @access Private
 */
router.delete('/:id', notificationController.deleteNotification);

/**
 * @route DELETE /api/notifications
 * @desc Delete all notifications
 * @access Private
 */
router.delete('/', notificationController.deleteAllNotifications);

/**
 * @route POST /api/notifications/admin
 * @desc Create notification (admin only)
 * @access Admin
 */
router.post('/admin', authorize(['admin']), notificationController.createNotification);

export default router;

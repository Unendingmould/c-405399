import { firestore } from 'firebase-admin';
import { db } from '../config/firebase';

/**
 * Notification types
 */
export enum NotificationType {
  TRANSACTION = 'transaction',
  INVESTMENT = 'investment',
  ACCOUNT = 'account',
  PERFORMANCE = 'performance',
  SYSTEM = 'system'
}

/**
 * Notification priority levels
 */
export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

/**
 * Notification status options
 */
export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived'
}

/**
 * Notification data structure
 */
export interface NotificationData {
  id?: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  createdAt: firestore.Timestamp;
  readAt?: firestore.Timestamp;
  metadata?: Record<string, any>;
  relatedItemId?: string;
  relatedItemType?: string;
}

/**
 * Notification model class
 */
export class Notification {
  private collectionRef = db.collection('notifications');
  
  /**
   * Create a new notification
   * @param data Notification data
   * @returns Created notification
   */
  async create(data: Omit<NotificationData, 'id' | 'createdAt' | 'status'>): Promise<NotificationData> {
    try {
      const notificationData: Omit<NotificationData, 'id'> = {
        ...data,
        status: NotificationStatus.UNREAD,
        createdAt: firestore.Timestamp.now()
      };
      
      const docRef = await this.collectionRef.add(notificationData);
      const doc = await docRef.get();
      
      return {
        id: doc.id,
        ...notificationData
      };
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }
  
  /**
   * Get notification by ID
   * @param id Notification ID
   * @returns Notification data
   */
  async getById(id: string): Promise<NotificationData | null> {
    try {
      const doc = await this.collectionRef.doc(id).get();
      
      if (!doc.exists) {
        return null;
      }
      
      return {
        id: doc.id,
        ...doc.data() as Omit<NotificationData, 'id'>
      };
    } catch (error) {
      console.error('Error getting notification:', error);
      throw error;
    }
  }
  
  /**
   * Get user notifications with pagination
   * @param userId User ID
   * @param status Optional status filter
   * @param limit Maximum number of notifications to return
   * @param startAfter Cursor for pagination
   * @returns Array of notifications
   */
  async getUserNotifications(
    userId: string, 
    status?: NotificationStatus,
    limit: number = 10,
    startAfter?: string
  ): Promise<{ notifications: NotificationData[]; lastDoc: string | null }> {
    try {
      let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = this.collectionRef
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc');
      
      if (status) {
        query = query.where('status', '==', status);
      }
      
      if (startAfter) {
        const startAfterDoc = await this.collectionRef.doc(startAfter).get();
        if (startAfterDoc.exists) {
          query = query.startAfter(startAfterDoc);
        }
      }
      
      query = query.limit(limit);
      
      const querySnapshot = await query.get();
      
      const notifications: NotificationData[] = [];
      querySnapshot.forEach(doc => {
        notifications.push({
          id: doc.id,
          ...doc.data() as Omit<NotificationData, 'id'>
        });
      });
      
      const lastDoc = querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1].id : null;
      
      return {
        notifications,
        lastDoc
      };
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  }
  
  /**
   * Mark notification as read
   * @param id Notification ID
   * @param userId User ID (for verification)
   * @returns Updated notification
   */
  async markAsRead(id: string, userId: string): Promise<NotificationData | null> {
    try {
      const notification = await this.getById(id);
      
      if (!notification || notification.userId !== userId) {
        return null;
      }
      
      const updateData = {
        status: NotificationStatus.READ,
        readAt: firestore.Timestamp.now()
      };
      
      await this.collectionRef.doc(id).update(updateData);
      
      return {
        ...notification,
        ...updateData
      };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }
  
  /**
   * Mark all user notifications as read
   * @param userId User ID
   * @returns Number of updated notifications
   */
  async markAllAsRead(userId: string): Promise<number> {
    try {
      const batch = db.batch();
      const readAt = firestore.Timestamp.now();
      
      const unreadNotificationsQuery = await this.collectionRef
        .where('userId', '==', userId)
        .where('status', '==', NotificationStatus.UNREAD)
        .get();
      
      let count = 0;
      unreadNotificationsQuery.forEach(doc => {
        batch.update(doc.ref, {
          status: NotificationStatus.READ,
          readAt
        });
        count++;
      });
      
      await batch.commit();
      return count;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
  
  /**
   * Archive a notification
   * @param id Notification ID
   * @param userId User ID (for verification)
   * @returns Updated notification
   */
  async archive(id: string, userId: string): Promise<NotificationData | null> {
    try {
      const notification = await this.getById(id);
      
      if (!notification || notification.userId !== userId) {
        return null;
      }
      
      const updateData = {
        status: NotificationStatus.ARCHIVED
      };
      
      await this.collectionRef.doc(id).update(updateData);
      
      return {
        ...notification,
        ...updateData
      };
    } catch (error) {
      console.error('Error archiving notification:', error);
      throw error;
    }
  }
  
  /**
   * Delete a notification
   * @param id Notification ID
   * @param userId User ID (for verification)
   * @returns Success status
   */
  async delete(id: string, userId: string): Promise<boolean> {
    try {
      const notification = await this.getById(id);
      
      if (!notification || notification.userId !== userId) {
        return false;
      }
      
      await this.collectionRef.doc(id).delete();
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
  
  /**
   * Delete all user notifications
   * @param userId User ID
   * @param status Optional status filter
   * @returns Number of deleted notifications
   */
  async deleteAll(userId: string, status?: NotificationStatus): Promise<number> {
    try {
      const batch = db.batch();
      
      let query = this.collectionRef.where('userId', '==', userId);
      if (status) {
        query = query.where('status', '==', status);
      }
      
      const querySnapshot = await query.get();
      
      let count = 0;
      querySnapshot.forEach(doc => {
        batch.delete(doc.ref);
        count++;
      });
      
      await batch.commit();
      return count;
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      throw error;
    }
  }
  
  /**
   * Get unread notification count for user
   * @param userId User ID
   * @returns Count of unread notifications
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const querySnapshot = await this.collectionRef
        .where('userId', '==', userId)
        .where('status', '==', NotificationStatus.UNREAD)
        .get();
      
      return querySnapshot.size;
    } catch (error) {
      console.error('Error getting unread notification count:', error);
      throw error;
    }
  }
}

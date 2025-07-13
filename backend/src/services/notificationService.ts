import { 
  createNotificationUtil, 
} from '../controllers/notificationController';
import { 
  NotificationType, 
  NotificationPriority 
} from '../models/notificationModel';

/**
 * Notification Service - Provides functions to create notifications for different system events
 */
export class NotificationService {
  
  /**
   * Send transaction confirmation notification
   * @param userId User ID
   * @param transactionData Transaction data
   * @returns Notification object or null
   */
  async sendTransactionConfirmation(userId: string, transactionData: any): Promise<any> {
    const { type, amount, status, currency, investmentId } = transactionData;
    
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
    
    const title = `${type.charAt(0).toUpperCase() + type.slice(1)} Transaction ${status}`;
    const message = `Your ${type} transaction for ${formattedAmount} has been ${status}.`;
    
    return createNotificationUtil(
      userId,
      NotificationType.TRANSACTION,
      title,
      message,
      {
        priority: NotificationPriority.HIGH,
        metadata: { 
          transactionType: type,
          transactionStatus: status,
          amount,
          currency
        },
        relatedItemId: transactionData.id,
        relatedItemType: 'transaction'
      }
    );
  }
  
  /**
   * Send investment update notification
   * @param userId User ID
   * @param investmentData Investment data
   * @returns Notification object or null
   */
  async sendInvestmentUpdate(userId: string, investmentData: any): Promise<any> {
    const { name, status, expectedReturn } = investmentData;
    
    const title = `Investment Update: ${name}`;
    const message = `Your investment "${name}" status is now ${status}.`;
    
    return createNotificationUtil(
      userId,
      NotificationType.INVESTMENT,
      title,
      message,
      {
        priority: NotificationPriority.MEDIUM,
        metadata: { 
          investmentName: name,
          investmentStatus: status,
          expectedReturn
        },
        relatedItemId: investmentData.id,
        relatedItemType: 'investment'
      }
    );
  }
  
  /**
   * Send performance alert notification
   * @param userId User ID
   * @param performanceData Performance data
   * @returns Notification object or null
   */
  async sendPerformanceAlert(userId: string, performanceData: any): Promise<any> {
    const { assetName, changePercent, changeDirection } = performanceData;
    
    let title = `Performance Alert: ${assetName}`;
    let message = `${assetName} has ${changeDirection === 'up' ? 'increased' : 'decreased'} by ${Math.abs(changePercent).toFixed(2)}% in value.`;
    let priority = NotificationPriority.MEDIUM;
    
    // Determine priority based on change percentage
    if (Math.abs(changePercent) >= 10) {
      priority = NotificationPriority.HIGH;
    } else if (Math.abs(changePercent) <= 2) {
      priority = NotificationPriority.LOW;
    }
    
    return createNotificationUtil(
      userId,
      NotificationType.PERFORMANCE,
      title,
      message,
      {
        priority,
        metadata: { 
          assetName,
          changePercent,
          changeDirection
        },
        relatedItemId: performanceData.assetId,
        relatedItemType: 'asset'
      }
    );
  }
  
  /**
   * Send account update notification
   * @param userId User ID
   * @param updateType Type of account update
   * @param updateData Additional update data
   * @returns Notification object or null
   */
  async sendAccountUpdate(userId: string, updateType: string, updateData?: any): Promise<any> {
    let title = 'Account Update';
    let message = 'Your account has been updated.';
    
    switch (updateType) {
      case 'profile_update':
        title = 'Profile Updated';
        message = 'Your profile information has been successfully updated.';
        break;
      case 'password_change':
        title = 'Password Changed';
        message = 'Your account password has been successfully changed.';
        break;
      case 'email_verification':
        title = 'Email Verified';
        message = 'Your email address has been successfully verified.';
        break;
      case 'login_attempt':
        title = 'New Login Detected';
        message = `A new login to your account was detected from ${updateData?.device || 'a new device'}.`;
        break;
    }
    
    return createNotificationUtil(
      userId,
      NotificationType.ACCOUNT,
      title,
      message,
      {
        priority: updateType === 'login_attempt' ? NotificationPriority.HIGH : NotificationPriority.MEDIUM,
        metadata: { updateType, ...updateData },
        relatedItemType: 'account'
      }
    );
  }
  
  /**
   * Send system notification (admin only)
   * @param userIds Array of user IDs or 'all'
   * @param title Notification title
   * @param message Notification message
   * @param priority Notification priority
   * @returns Array of created notification IDs
   */
  async sendSystemNotification(
    userIds: string[] | 'all',
    title: string,
    message: string,
    priority: NotificationPriority = NotificationPriority.MEDIUM
  ): Promise<any[]> {
    // This would be implemented differently when sending to all users
    // For now, just handle the case where we have specific userIds
    if (Array.isArray(userIds)) {
      const notifications = [];
      
      for (const userId of userIds) {
        const notification = await createNotificationUtil(
          userId,
          NotificationType.SYSTEM,
          title,
          message,
          { priority }
        );
        
        if (notification) {
          notifications.push(notification);
        }
      }
      
      return notifications;
    }
    
    // In a real implementation, we might have a more efficient way to send to all users
    console.log('Sending to all users not implemented yet');
    return [];
  }
}

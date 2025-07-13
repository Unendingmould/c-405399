import * as dotenv from 'dotenv';
dotenv.config();

// Force console output to be immediately visible
console.log('Starting notification test setup...');

import { firestore } from 'firebase-admin';
import { db } from '../config/firebase';
import { 
  Notification, 
  NotificationType, 
  NotificationPriority, 
  NotificationStatus
} from '../models/notificationModel';
import { NotificationService } from '../services/notificationService';

/**
 * Test notification functionality
 */
async function testNotifications() {
  // Debug logging for initialization
  console.log('Function started...');
  console.log('🔔 Starting notification system test...\n');
  
  // Initialize models and services
  const notificationModel = new Notification();
  const notificationService = new NotificationService();
  
  // Test user ID (for testing purposes)
  const testUserId = 'test-user-' + Date.now().toString();
  console.log(`Using test user ID: ${testUserId}`);
  
  try {
    console.log('Firebase initialization appears successful...');
    // STEP 1: Create a basic notification
    console.log('\n📋 STEP 1: Creating a basic notification...');
    const basicNotification = await notificationModel.create({
      userId: testUserId,
      type: NotificationType.SYSTEM,
      title: 'Test Notification',
      message: 'This is a test notification from the system',
      priority: NotificationPriority.MEDIUM
    });
    
    console.log('✅ Basic notification created:', basicNotification.id);
    
    // STEP 2: Retrieve the created notification
    console.log('\n📋 STEP 2: Retrieving notification by ID...');
    const retrievedNotification = await notificationModel.getById(basicNotification.id);
    console.log('✅ Notification retrieved:', 
      retrievedNotification ? retrievedNotification.title : 'null', 
      '- Status:', retrievedNotification ? retrievedNotification.status : 'unknown'
    );
    
    // STEP 3: Test notification service with transaction notification
    console.log('\n📋 STEP 3: Testing transaction notification...');
    const transactionNotification = await notificationService.sendTransactionConfirmation(
      testUserId,
      {
        id: 'test-transaction-id',
        type: 'deposit',
        amount: 1000,
        status: 'completed',
        currency: 'USD'
      }
    );
    
    console.log('✅ Transaction notification created:', transactionNotification?.id);
    
    // STEP 4: Test notification service with investment notification
    console.log('\n📋 STEP 4: Testing investment notification...');
    const investmentNotification = await notificationService.sendInvestmentUpdate(
      testUserId,
      {
        id: 'test-investment-id',
        name: 'Growth Fund',
        status: 'created',
        expectedReturn: 8.5
      }
    );
    
    console.log('✅ Investment notification created:', investmentNotification?.id);
    
    // STEP 5: Test notification service with performance alert
    console.log('\n📋 STEP 5: Testing performance alert notification...');
    const performanceNotification = await notificationService.sendPerformanceAlert(
      testUserId,
      {
        assetId: 'test-asset-id',
        assetName: 'Tech Stock ETF',
        changePercent: 5.2,
        changeDirection: 'up'
      }
    );
    
    console.log('✅ Performance notification created:', performanceNotification?.id);
    
    // STEP 6: Test notification service with account update
    console.log('\n📋 STEP 6: Testing account update notification...');
    const accountNotification = await notificationService.sendAccountUpdate(
      testUserId,
      'profile_update'
    );
    
    console.log('✅ Account notification created:', accountNotification?.id);
    
    // STEP 7: Get all notifications for the test user
    console.log('\n📋 STEP 7: Retrieving all notifications for test user...');
    const allNotifications = await notificationModel.getUserNotifications(testUserId, undefined, 10);
    console.log(`✅ Retrieved ${allNotifications.notifications.length} notifications`);
    
    // STEP 8: Mark a notification as read
    console.log('\n📋 STEP 8: Marking notification as read...');
    if (allNotifications.notifications.length > 0) {
      const firstNotification = allNotifications.notifications[0];
      const markedAsRead = await notificationModel.markAsRead(firstNotification.id || '', testUserId);
      console.log('✅ Notification marked as read:', markedAsRead?.id);
    }
    
    // STEP 9: Get unread count
    console.log('\n📋 STEP 9: Getting unread notification count...');
    const unreadCount = await notificationModel.getUnreadCount(testUserId);
    console.log('✅ Unread notification count:', unreadCount);
    
    // STEP 10: Mark all as read
    console.log('\n📋 STEP 10: Marking all notifications as read...');
    const markedAllCount = await notificationModel.markAllAsRead(testUserId);
    console.log(`✅ Marked ${markedAllCount} notifications as read`);
    
    // STEP 11: Clean up test data
    console.log('\n📋 STEP 11: Cleaning up test notifications...');
    const deletedCount = await notificationModel.deleteAll(testUserId);
    console.log(`✅ Deleted ${deletedCount} test notifications`);
    
    console.log('\n✅ Notification system test completed successfully!');
    
  } catch (error: any) {
    console.error('❌ Error during notification testing:', error.message);
    console.error(error);
  }
}

// Run the test with better error handling
console.log('Before calling testNotifications...');
testNotifications()
  .then(() => {
    console.log('Test completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Top level error in test:', error);
    process.exit(1);
  });

export {};

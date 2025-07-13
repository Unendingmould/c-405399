import { Notification, NotificationType, NotificationPriority } from '../models/notificationModel';
import { NotificationService } from '../services/notificationService';

/**
 * Simple notification system test
 */
async function testSimpleNotification() {
  console.log('Starting simple notification test...');
  
  // Test user ID
  const testUserId = 'test-user-123';
  
  // Test direct notification creation
  try {
    const notification = new Notification();
    const result = await notification.create({
      userId: testUserId,
      type: NotificationType.SYSTEM,
      title: 'Test Notification',
      message: 'This is a test notification',
      priority: NotificationPriority.MEDIUM
    });
    
    console.log('Notification created:', result.id);
    return true;
  } catch (error: any) {
    console.error('Error creating notification:', error.message);
    return false;
  }
}

// Run the test
testSimpleNotification()
  .then(success => {
    console.log('Test completed:', success ? 'SUCCESS' : 'FAILED');
    process.exit(0);
  })
  .catch(err => {
    console.error('Test error:', err);
    process.exit(1);
  });

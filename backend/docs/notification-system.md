# Notification System Documentation

## Overview

The notification system provides real-time alerts and messages to users about important events in the investment platform. This document outlines the architecture, components, and usage of the notification system.

## Architecture

The notification system is built on Firebase Firestore and consists of the following components:

1. **Notification Model**: Core data structure and database operations
2. **Notification Controller**: REST API endpoints for notifications
3. **Notification Service**: Business logic for generating notifications from system events
4. **Notification Routes**: API routes that connect to the controller

## Data Model

### Notification Types
- `TRANSACTION`: For deposit, withdrawal, and other transaction events
- `INVESTMENT`: For investment creation, updates, and status changes
- `ACCOUNT`: For user account related events (profile updates, logins)
- `PERFORMANCE`: For portfolio performance and investment alerts
- `SYSTEM`: For system-wide announcements and notifications

### Notification Priority
- `LOW`: Informational notifications
- `MEDIUM`: Standard notifications (default)
- `HIGH`: Critical notifications requiring immediate attention

### Notification Status
- `UNREAD`: New notifications (default)
- `READ`: Notifications that have been viewed
- `ARCHIVED`: Notifications that have been archived

## API Endpoints

### User Notification Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get user notifications with filters and pagination |
| GET | `/api/notifications/unread-count` | Get count of unread notifications |
| PATCH | `/api/notifications/:id/read` | Mark a notification as read |
| PATCH | `/api/notifications/read-all` | Mark all notifications as read |
| PATCH | `/api/notifications/:id/archive` | Archive a notification |
| DELETE | `/api/notifications/:id` | Delete a notification |
| DELETE | `/api/notifications` | Delete all notifications with optional status filter |

### Admin Notification Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/notifications/admin` | Create notification (admin only) |

## Integration Points

The notification system is integrated with the following components:

### 1. Transaction System
- Triggers notifications when transactions are created, processed, or change status
- Notifications include transaction type, amount, and status

### 2. Investment System
- Triggers notifications when investments are created or updated
- Includes investment name, status, and expected return information

### 3. Performance Analytics
- Sends alerts when investment performance changes significantly
- Includes performance metrics and trend information

## Usage Examples

### Creating a Notification

```typescript
// Using the notification model directly
const notificationModel = new Notification();
await notificationModel.create({
  userId: 'user123',
  type: NotificationType.SYSTEM,
  title: 'Important Update',
  message: 'The system will be undergoing maintenance tomorrow.',
  priority: NotificationPriority.MEDIUM
});
```

### Using the Notification Service

```typescript
// Using the notification service for specific events
const notificationService = new NotificationService();

// For transaction events
await notificationService.sendTransactionConfirmation(
  userId,
  transactionData
);

// For investment events
await notificationService.sendInvestmentUpdate(
  userId,
  investmentData
);

// For performance alerts
await notificationService.sendPerformanceAlert(
  userId, 
  performanceData
);

// For account updates
await notificationService.sendAccountUpdate(
  userId,
  'profile_update'
);
```

## Best Practices

1. Always include relevant metadata with notifications to allow for proper filtering and context
2. Use appropriate notification types and priorities based on the importance of the event
3. Implement proper pagination when displaying notifications in the UI
4. Clean up old notifications periodically to maintain database performance

## Future Enhancements

1. Real-time push notifications via Firebase Cloud Messaging
2. Notification preferences allowing users to opt in/out of specific notification types
3. Scheduled notifications for recurring events
4. Notification templates for consistent messaging

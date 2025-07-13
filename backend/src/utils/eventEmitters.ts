import { getWebSocketService, WSEventType } from '../services/websocketService';

/**
 * Emit notification event to a user
 * @param userId User ID
 * @param notification Notification data
 */
export function emitNewNotification(userId: string, notification: any) {
  try {
    const wsService = getWebSocketService();
    wsService.sendToUser(userId, WSEventType.NOTIFICATION_NEW, notification);
  } catch (error) {
    console.error('Failed to emit notification event:', error);
  }
}

/**
 * Emit transaction event to a user
 * @param userId User ID
 * @param transaction Transaction data
 * @param isNew Whether this is a new transaction or an update
 */
export function emitTransactionEvent(userId: string, transaction: any, isNew = true) {
  try {
    const wsService = getWebSocketService();
    const eventType = isNew ? WSEventType.TRANSACTION_CREATE : WSEventType.TRANSACTION_UPDATE;
    wsService.sendToUser(userId, eventType, transaction);
  } catch (error) {
    console.error(`Failed to emit ${isNew ? 'new' : 'updated'} transaction event:`, error);
  }
}

/**
 * Emit investment event to a user
 * @param userId User ID
 * @param investment Investment data
 * @param isNew Whether this is a new investment or an update
 */
export function emitInvestmentEvent(userId: string, investment: any, isNew = true) {
  try {
    const wsService = getWebSocketService();
    const eventType = isNew ? WSEventType.INVESTMENT_CREATE : WSEventType.INVESTMENT_UPDATE;
    wsService.sendToUser(userId, eventType, investment);
    
    // Also send a portfolio update since investment changes affect the portfolio
    setTimeout(() => {
      wsService.sendPortfolioUpdate(userId);
    }, 100);
  } catch (error) {
    console.error(`Failed to emit ${isNew ? 'new' : 'updated'} investment event:`, error);
  }
}

/**
 * Emit portfolio update event to a user
 * @param userId User ID
 */
export function emitPortfolioUpdate(userId: string) {
  try {
    const wsService = getWebSocketService();
    wsService.sendPortfolioUpdate(userId);
  } catch (error) {
    console.error('Failed to emit portfolio update event:', error);
  }
}

/**
 * Emit system alert to all users
 * @param message Alert message
 * @param severity Alert severity (info, warning, error)
 */
export function emitSystemAlert(message: string, severity: 'info' | 'warning' | 'error' = 'info') {
  try {
    const wsService = getWebSocketService();
    wsService.broadcastToAll(WSEventType.SYSTEM_ALERT, {
      message,
      severity,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to emit system alert:', error);
  }
}

/**
 * Emit price update for a specific asset
 * @param symbol Asset symbol
 * @param price Current price
 * @param change Price change
 * @param changePercent Price change percentage
 */
export function emitPriceUpdate(symbol: string, price: number, change: number, changePercent: number) {
  try {
    const wsService = getWebSocketService();
    wsService.sendMarketUpdate(symbol, price, change, changePercent);
  } catch (error) {
    console.error(`Failed to emit price update for ${symbol}:`, error);
  }
}

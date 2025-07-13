import { Server as HTTPServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { firestore } from 'firebase-admin';
import { db } from '../config/firebase';

/**
 * WebSocket event types
 */
export enum WSEventType {
  INVESTMENT_UPDATE = 'investment:update',
  INVESTMENT_CREATE = 'investment:create',
  TRANSACTION_UPDATE = 'transaction:update',
  TRANSACTION_CREATE = 'transaction:create',
  NOTIFICATION_NEW = 'notification:new',
  PRICE_UPDATE = 'price:update',
  PORTFOLIO_UPDATE = 'portfolio:update',
  SYSTEM_ALERT = 'system:alert',
  AUTH_ERROR = 'auth:error',
}

/**
 * WebSocket service for real-time updates
 */
export class WebSocketService {
  private io: SocketServer;
  private userSockets: Map<string, string[]> = new Map(); // userId -> socketIds[]
  
  constructor(server: HTTPServer) {
    this.io = new SocketServer(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });
    
    this.setupSocketAuth();
    this.setupEventListeners();
    this.setupFirestoreListeners();
    
    console.log('WebSocket server initialized');
  }
  
  /**
   * Set up socket authentication middleware
   */
  private setupSocketAuth() {
    this.io.use(async (socket, next) => {
      try {
        // Get token from query or headers
        const token = 
          socket.handshake.auth.token || 
          socket.handshake.headers.authorization?.split(' ')[1];
        
        if (!token) {
          return next(new Error('Authentication error: No token provided'));
        }
        
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        
        if (!decoded || !decoded.userId) {
          return next(new Error('Authentication error: Invalid token'));
        }
        
        // Attach user data to socket
        socket.data.userId = decoded.userId;
        
        // Add to active connections
        if (!this.userSockets.has(decoded.userId)) {
          this.userSockets.set(decoded.userId, []);
        }
        this.userSockets.get(decoded.userId)?.push(socket.id);
        
        console.log(`User ${decoded.userId} connected with socket ${socket.id}`);
        next();
      } catch (error) {
        console.error('Socket authentication error:', error);
        next(new Error('Authentication error'));
      }
    });
  }
  
  /**
   * Set up socket event listeners
   */
  private setupEventListeners() {
    this.io.on('connection', (socket) => {
      console.log(`Socket connected: ${socket.id}`);
      
      // Send initial data
      this.sendWelcomeData(socket);
      
      // Handle subscription requests
      socket.on('subscribe', (channel) => {
        this.handleSubscription(socket, channel);
      });
      
      // Handle disconnection
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });
    });
  }
  
  /**
   * Send welcome data to newly connected socket
   * @param socket Socket connection
   */
  private async sendWelcomeData(socket: any) {
    try {
      const userId = socket.data.userId;
      
      if (!userId) return;
      
      // Send a welcome message
      socket.emit('welcome', {
        message: 'Connected to investment platform real-time data',
        userId,
        timestamp: new Date().toISOString(),
      });
      
      // TODO: Send initial state data if needed
    } catch (error) {
      console.error('Error sending welcome data:', error);
    }
  }
  
  /**
   * Handle subscription to specific channels
   * @param socket Socket connection
   * @param channel Channel to subscribe to
   */
  private handleSubscription(socket: any, channel: string) {
    try {
      const userId = socket.data.userId;
      
      if (!userId) return;
      
      // Join the requested channel
      if (channel.startsWith('investment:') || 
          channel.startsWith('transaction:') ||
          channel.startsWith('notification:') ||
          channel.startsWith('portfolio:') ||
          channel.startsWith('market:')) {
        
        const userChannel = `${channel}:${userId}`;
        socket.join(userChannel);
        console.log(`Socket ${socket.id} joined channel ${userChannel}`);
        
        // Confirm subscription
        socket.emit('subscribed', { channel: userChannel });
      }
    } catch (error) {
      console.error('Error handling subscription:', error);
    }
  }
  
  /**
   * Handle socket disconnection
   * @param socket Socket connection
   */
  private handleDisconnect(socket: any) {
    try {
      const userId = socket.data.userId;
      
      if (userId) {
        // Remove socket from user map
        const sockets = this.userSockets.get(userId) || [];
        const updatedSockets = sockets.filter(id => id !== socket.id);
        
        if (updatedSockets.length > 0) {
          this.userSockets.set(userId, updatedSockets);
        } else {
          this.userSockets.delete(userId);
        }
        
        console.log(`Socket ${socket.id} disconnected, user ${userId} has ${updatedSockets.length} active connections`);
      }
    } catch (error) {
      console.error('Error handling disconnect:', error);
    }
  }
  
  /**
   * Set up Firestore listeners for real-time updates
   */
  private setupFirestoreListeners() {
    this.setupNotificationsListener();
    this.setupTransactionsListener();
    this.setupInvestmentsListener();
    // Add more listeners as needed
  }
  
  /**
   * Listen for notification changes
   */
  private setupNotificationsListener() {
    db.collection('notifications')
      .where('status', '==', 'unread')
      .onSnapshot(
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              const data = change.doc.data();
              const userId = data.userId;
              
              if (userId && this.userSockets.has(userId)) {
                this.sendToUser(userId, WSEventType.NOTIFICATION_NEW, {
                  id: change.doc.id,
                  ...data,
                });
              }
            }
          });
        },
        (error) => {
          console.error('Error in notifications listener:', error);
        }
      );
  }
  
  /**
   * Listen for transaction changes
   */
  private setupTransactionsListener() {
    db.collection('transactions')
      .onSnapshot(
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const data = change.doc.data();
            const userId = data.userId;
            
            if (userId && this.userSockets.has(userId)) {
              if (change.type === 'added') {
                this.sendToUser(userId, WSEventType.TRANSACTION_CREATE, {
                  id: change.doc.id,
                  ...data,
                });
              } else if (change.type === 'modified') {
                this.sendToUser(userId, WSEventType.TRANSACTION_UPDATE, {
                  id: change.doc.id,
                  ...data,
                });
              }
            }
          });
        },
        (error) => {
          console.error('Error in transactions listener:', error);
        }
      );
  }
  
  /**
   * Listen for investment changes
   */
  private setupInvestmentsListener() {
    db.collection('user_investments')
      .onSnapshot(
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const data = change.doc.data();
            const userId = data.userId;
            
            if (userId && this.userSockets.has(userId)) {
              if (change.type === 'added') {
                this.sendToUser(userId, WSEventType.INVESTMENT_CREATE, {
                  id: change.doc.id,
                  ...data,
                });
              } else if (change.type === 'modified') {
                this.sendToUser(userId, WSEventType.INVESTMENT_UPDATE, {
                  id: change.doc.id,
                  ...data,
                });
                
                // Also send portfolio update since investment change affects portfolio
                this.sendPortfolioUpdate(userId);
              }
            }
          });
        },
        (error) => {
          console.error('Error in investments listener:', error);
        }
      );
  }
  
  /**
   * Send portfolio update to user
   * @param userId User ID
   */
  public async sendPortfolioUpdate(userId: string) {
    try {
      // Get user's portfolio summary
      const investmentsSnapshot = await db.collection('user_investments')
        .where('userId', '==', userId)
        .get();
      
      // Calculate portfolio metrics
      let totalValue = 0;
      let initialValue = 0;
      
      const investments = investmentsSnapshot.docs.map(doc => {
        const data = doc.data();
        totalValue += data.currentValue || data.amount || 0;
        initialValue += data.initialAmount || data.amount || 0;
        return { id: doc.id, ...data };
      });
      
      // Send portfolio update
      this.sendToUser(userId, WSEventType.PORTFOLIO_UPDATE, {
        totalValue,
        initialValue,
        totalReturn: totalValue - initialValue,
        returnPercent: initialValue > 0 ? ((totalValue - initialValue) / initialValue) * 100 : 0,
        investmentCount: investments.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error sending portfolio update:', error);
    }
  }
  
  /**
   * Send event to specific user's connected sockets
   * @param userId User ID
   * @param eventType Event type
   * @param data Event data
   */
  public sendToUser(userId: string, eventType: WSEventType, data: any) {
    try {
      const socketIds = this.userSockets.get(userId);
      
      if (!socketIds || socketIds.length === 0) {
        return;
      }
      
      // Get all sockets for this user
      socketIds.forEach(socketId => {
        this.io.to(socketId).emit(eventType, data);
      });
      
      console.log(`Sent ${eventType} to user ${userId} (${socketIds.length} connections)`);
    } catch (error) {
      console.error(`Error sending ${eventType} to user ${userId}:`, error);
    }
  }
  
  /**
   * Broadcast event to all connected users
   * @param eventType Event type
   * @param data Event data
   */
  public broadcastToAll(eventType: WSEventType, data: any) {
    try {
      this.io.emit(eventType, data);
      console.log(`Broadcast ${eventType} to all users`);
    } catch (error) {
      console.error(`Error broadcasting ${eventType}:`, error);
    }
  }
  
  /**
   * Send market data update to all subscribed users
   * @param symbol Asset symbol
   * @param price Current price
   * @param change Price change
   * @param changePercent Price change percentage
   */
  public sendMarketUpdate(symbol: string, price: number, change: number, changePercent: number) {
    try {
      this.io.to(`market:${symbol}`).emit(WSEventType.PRICE_UPDATE, {
        symbol,
        price,
        change,
        changePercent,
        timestamp: new Date().toISOString(),
      });
      
      console.log(`Sent market update for ${symbol} to subscribers`);
    } catch (error) {
      console.error(`Error sending market update for ${symbol}:`, error);
    }
  }
}

// Singleton instance - will be initialized in server.ts
let wsService: WebSocketService | null = null;

/**
 * Initialize the WebSocket service
 * @param server HTTP server instance
 */
export function initWebSocket(server: HTTPServer) {
  if (!wsService) {
    wsService = new WebSocketService(server);
  }
  return wsService;
}

/**
 * Get WebSocket service instance
 */
export function getWebSocketService(): WebSocketService {
  if (!wsService) {
    throw new Error('WebSocket service not initialized');
  }
  return wsService;
}

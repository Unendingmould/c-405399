// WebSocket service for real-time updates
import { toast } from "@/components/ui/use-toast";

type WebSocketEventCallback = (data: any) => void;
type WebSocketEventType = 'market' | 'transaction' | 'investment' | 'notification' | 'user';

class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectTimer: number | null = null;
  private eventListeners: Map<WebSocketEventType, WebSocketEventCallback[]>;
  private isConnecting = false;
  private url: string;
  
  constructor(url?: string) {
    this.url = url || `ws://${window.location.hostname}:5000/ws`;
    this.eventListeners = new Map();
    
    // Initialize event listener arrays
    const eventTypes: WebSocketEventType[] = ['market', 'transaction', 'investment', 'notification'];
    eventTypes.forEach(type => {
      this.eventListeners.set(type, []);
    });
  }
  
  // Connect to WebSocket server
  connect() {
    if (this.socket?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }
    
    this.isConnecting = true;
    
    try {
      this.socket = new WebSocket(this.url);
      
      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.isConnecting = false;
        
        // Clear any reconnect timer
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      };
      
      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnecting = false;
        
        // Schedule reconnect
        if (!this.reconnectTimer) {
          this.reconnectTimer = window.setTimeout(() => {
            this.reconnectTimer = null;
            this.connect();
          }, 3000);
        }
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
      };
      
      this.socket.onmessage = this.handleMessage.bind(this);
      
    } catch (error) {
      console.error('Failed to connect to WebSocket server:', error);
      this.isConnecting = false;
      
      // Schedule reconnect
      if (!this.reconnectTimer) {
        this.reconnectTimer = window.setTimeout(() => {
          this.reconnectTimer = null;
          this.connect();
        }, 3000);
      }
    }
  }
  
  // Disconnect from WebSocket server
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
  
  // Handle incoming WebSocket messages
  private handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      const { type, payload } = data;
      
      // Dispatch to registered listeners
      if (type && this.eventListeners.has(type as WebSocketEventType)) {
        const listeners = this.eventListeners.get(type as WebSocketEventType) || [];
        listeners.forEach(callback => callback(payload));
      }
      
      // Show notifications for certain events
      if (type === 'notification') {
        toast({
          title: payload.title || 'New Notification',
          description: payload.message,
          variant: 'default',
          duration: 5000
        });
      }
      
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }
  
  // Subscribe to event type
  subscribe(type: WebSocketEventType, callback: WebSocketEventCallback) {
    if (!this.eventListeners.has(type)) {
      this.eventListeners.set(type, []);
    }
    
    const listeners = this.eventListeners.get(type) || [];
    if (!listeners.includes(callback)) {
      listeners.push(callback);
    }
    
    // Auto-connect when subscribing
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.connect();
    }
    
    return () => this.unsubscribe(type, callback);
  }
  
  // Unsubscribe from event type
  unsubscribe(type: WebSocketEventType, callback: WebSocketEventCallback) {
    if (!this.eventListeners.has(type)) {
      return;
    }
    
    const listeners = this.eventListeners.get(type) || [];
    const index = listeners.indexOf(callback);
    
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }
  
  // Send message to server (if needed)
  send(data: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.error('Cannot send message: WebSocket not connected');
    }
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;

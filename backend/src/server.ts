import * as http from 'http';
import app from './app';
import * as dotenv from 'dotenv';
import { initWebSocket } from './services/websocketService';
import { initMarketDataService } from './services/marketDataService';
import config from './config';

// Load environment variables
dotenv.config();

const PORT = config.server.port;

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket service
initWebSocket(server);

// Initialize market data service if API key is available
if (process.env.MARKET_DATA_API_KEY) {
  const provider = process.env.MARKET_DATA_PROVIDER || 'alphavantage';
  const pollingInterval = parseInt(process.env.MARKET_DATA_POLLING_INTERVAL || '60000', 10);
  
  try {
    initMarketDataService(
      provider as 'alphavantage' | 'polygon',
      process.env.MARKET_DATA_API_KEY,
      true,
      pollingInterval
    );
    console.log(`Market data service initialized with ${provider} provider`);
    console.log(`Real-time market data polling enabled with ${pollingInterval}ms interval`);
  } catch (error) {
    console.error('Failed to initialize market data service:', error);
  }
} else {
  console.warn('Market data service not initialized: Missing MARKET_DATA_API_KEY');
}

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${config.server.nodeEnv} mode`);
  console.log(`WebSocket server initialized`);
  console.log(`👉 Health check: http://localhost:${PORT}/api/health`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

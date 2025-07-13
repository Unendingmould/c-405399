import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { emitPriceUpdate } from '../utils/eventEmitters';

/**
 * Market data provider interface
 */
interface MarketDataProvider {
  getAssetPrice(symbol: string): Promise<AssetPrice>;
  getMultipleAssetPrices(symbols: string[]): Promise<Record<string, AssetPrice>>;
  searchAssets(query: string): Promise<AssetInfo[]>;
}

/**
 * Asset price data structure
 */
export interface AssetPrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: Date;
  currency?: string;
  marketCap?: number;
  volume?: number;
}

/**
 * Asset information data structure
 */
export interface AssetInfo {
  symbol: string;
  name: string;
  type: string; // stock, crypto, forex, etc.
  exchange?: string;
  currency?: string;
}

/**
 * Alpha Vantage API implementation
 */
class AlphaVantageProvider implements MarketDataProvider {
  private apiKey: string;
  private baseUrl = 'https://www.alphavantage.co/query';
  private cacheDir: string;
  private cacheDuration = 15 * 60 * 1000; // 15 minutes in milliseconds
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.cacheDir = path.join(__dirname, '../../.cache/market-data');
    
    // Ensure cache directory exists
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }
  
  /**
   * Get current price for a single asset
   * @param symbol Asset symbol
   * @returns Asset price data
   */
  async getAssetPrice(symbol: string): Promise<AssetPrice> {
    const cachedData = this.getFromCache(symbol);
    if (cachedData) {
      return cachedData;
    }
    
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol,
          apikey: this.apiKey,
        },
      });
      
      const quote = response.data['Global Quote'];
      if (!quote || !quote['05. price']) {
        throw new Error(`No data found for symbol ${symbol}`);
      }
      
      const price: AssetPrice = {
        symbol,
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        timestamp: new Date(),
      };
      
      // Cache the result
      this.saveToCache(symbol, price);
      
      return price;
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      
      // If API call fails but we have cached data, return that even if expired
      const staleCachedData = this.getFromCache(symbol, true);
      if (staleCachedData) {
        return staleCachedData;
      }
      
      throw error;
    }
  }
  
  /**
   * Get prices for multiple assets
   * @param symbols List of asset symbols
   * @returns Record of symbols to asset prices
   */
  async getMultipleAssetPrices(symbols: string[]): Promise<Record<string, AssetPrice>> {
    const result: Record<string, AssetPrice> = {};
    
    // Batch API calls (5 at a time to avoid rate limiting)
    const batchSize = 5;
    for (let i = 0; i < symbols.length; i += batchSize) {
      const batch = symbols.slice(i, i + batchSize);
      const promises = batch.map(symbol => this.getAssetPrice(symbol));
      
      try {
        const batchResults = await Promise.allSettled(promises);
        
        batchResults.forEach((batchResult, index) => {
          const symbol = batch[index];
          if (batchResult.status === 'fulfilled') {
            result[symbol] = batchResult.value;
          } else {
            console.error(`Failed to fetch price for ${symbol}:`, batchResult.reason);
          }
        });
        
        // Add a small delay between batches to avoid rate limiting
        if (i + batchSize < symbols.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error('Error in batch asset price fetch:', error);
      }
    }
    
    return result;
  }
  
  /**
   * Search for assets by keyword
   * @param query Search query
   * @returns List of matching assets
   */
  async searchAssets(query: string): Promise<AssetInfo[]> {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          function: 'SYMBOL_SEARCH',
          keywords: query,
          apikey: this.apiKey,
        },
      });
      
      const matches = response.data.bestMatches || [];
      
      return matches.map((match: any) => ({
        symbol: match['1. symbol'],
        name: match['2. name'],
        type: match['3. type'],
        currency: match['8. currency'],
        exchange: match['4. region'],
      }));
    } catch (error) {
      console.error(`Error searching assets for "${query}":`, error);
      throw error;
    }
  }
  
  /**
   * Get data from cache if available and not expired
   * @param symbol Asset symbol
   * @param ignoreExpiry Whether to ignore cache expiry
   * @returns Cached price data or null
   */
  private getFromCache(symbol: string, ignoreExpiry = false): AssetPrice | null {
    const cacheFile = path.join(this.cacheDir, `${symbol}.json`);
    
    if (fs.existsSync(cacheFile)) {
      try {
        const cacheData = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
        const cacheTime = new Date(cacheData.timestamp).getTime();
        const now = Date.now();
        
        // Return data if cache is still valid or if we're ignoring expiry
        if (ignoreExpiry || now - cacheTime < this.cacheDuration) {
          return {
            ...cacheData,
            timestamp: new Date(cacheData.timestamp),
          };
        }
      } catch (error) {
        console.error(`Error reading cache for ${symbol}:`, error);
      }
    }
    
    return null;
  }
  
  /**
   * Save data to cache
   * @param symbol Asset symbol
   * @param data Asset price data
   */
  private saveToCache(symbol: string, data: AssetPrice): void {
    const cacheFile = path.join(this.cacheDir, `${symbol}.json`);
    
    try {
      fs.writeFileSync(cacheFile, JSON.stringify(data));
    } catch (error) {
      console.error(`Error writing cache for ${symbol}:`, error);
    }
  }
}

/**
 * Polygon.io API implementation
 */
class PolygonProvider implements MarketDataProvider {
  private apiKey: string;
  private baseUrl = 'https://api.polygon.io';
  private cacheDir: string;
  private cacheDuration = 15 * 60 * 1000; // 15 minutes in milliseconds
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.cacheDir = path.join(__dirname, '../../.cache/market-data');
    
    // Ensure cache directory exists
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }
  
  /**
   * Get current price for a single asset
   * @param symbol Asset symbol
   * @returns Asset price data
   */
  async getAssetPrice(symbol: string): Promise<AssetPrice> {
    const cachedData = this.getFromCache(symbol);
    if (cachedData) {
      return cachedData;
    }
    
    try {
      const response = await axios.get(`${this.baseUrl}/v2/aggs/ticker/${symbol}/prev`, {
        params: {
          apiKey: this.apiKey,
        },
      });
      
      if (!response.data.results || response.data.results.length === 0) {
        throw new Error(`No data found for symbol ${symbol}`);
      }
      
      const result = response.data.results[0];
      const price = result.c; // Closing price
      const prevClose = result.o; // Previous closing price
      const change = price - prevClose;
      const changePercent = (change / prevClose) * 100;
      
      const assetPrice: AssetPrice = {
        symbol,
        price,
        change,
        changePercent,
        timestamp: new Date(),
        volume: result.v,
      };
      
      // Cache the result
      this.saveToCache(symbol, assetPrice);
      
      return assetPrice;
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      
      // If API call fails but we have cached data, return that even if expired
      const staleCachedData = this.getFromCache(symbol, true);
      if (staleCachedData) {
        return staleCachedData;
      }
      
      throw error;
    }
  }
  
  /**
   * Get prices for multiple assets
   * @param symbols List of asset symbols
   * @returns Record of symbols to asset prices
   */
  async getMultipleAssetPrices(symbols: string[]): Promise<Record<string, AssetPrice>> {
    const result: Record<string, AssetPrice> = {};
    
    // Batch API calls (10 at a time to avoid rate limiting)
    const batchSize = 10;
    for (let i = 0; i < symbols.length; i += batchSize) {
      const batch = symbols.slice(i, i + batchSize);
      const promises = batch.map(symbol => this.getAssetPrice(symbol));
      
      try {
        const batchResults = await Promise.allSettled(promises);
        
        batchResults.forEach((batchResult, index) => {
          const symbol = batch[index];
          if (batchResult.status === 'fulfilled') {
            result[symbol] = batchResult.value;
          } else {
            console.error(`Failed to fetch price for ${symbol}:`, batchResult.reason);
          }
        });
        
        // Add a small delay between batches to avoid rate limiting
        if (i + batchSize < symbols.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error('Error in batch asset price fetch:', error);
      }
    }
    
    return result;
  }
  
  /**
   * Search for assets by keyword
   * @param query Search query
   * @returns List of matching assets
   */
  async searchAssets(query: string): Promise<AssetInfo[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/v3/reference/tickers`, {
        params: {
          search: query,
          active: true,
          sort: 'ticker',
          order: 'asc',
          limit: 20,
          apiKey: this.apiKey,
        },
      });
      
      const results = response.data.results || [];
      
      return results.map((result: any) => ({
        symbol: result.ticker,
        name: result.name,
        type: this.mapAssetType(result.market),
        currency: 'USD', // Polygon primarily deals with USD assets
        exchange: result.primary_exchange,
      }));
    } catch (error) {
      console.error(`Error searching assets for "${query}":`, error);
      throw error;
    }
  }
  
  /**
   * Map Polygon market type to asset type
   * @param market Polygon market type
   * @returns Standardized asset type
   */
  private mapAssetType(market: string): string {
    switch (market) {
      case 'stocks':
        return 'stock';
      case 'crypto':
        return 'crypto';
      case 'fx':
        return 'forex';
      default:
        return market;
    }
  }
  
  /**
   * Get data from cache if available and not expired
   * @param symbol Asset symbol
   * @param ignoreExpiry Whether to ignore cache expiry
   * @returns Cached price data or null
   */
  private getFromCache(symbol: string, ignoreExpiry = false): AssetPrice | null {
    const cacheFile = path.join(this.cacheDir, `polygon_${symbol}.json`);
    
    if (fs.existsSync(cacheFile)) {
      try {
        const cacheData = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
        const cacheTime = new Date(cacheData.timestamp).getTime();
        const now = Date.now();
        
        // Return data if cache is still valid or if we're ignoring expiry
        if (ignoreExpiry || now - cacheTime < this.cacheDuration) {
          return {
            ...cacheData,
            timestamp: new Date(cacheData.timestamp),
          };
        }
      } catch (error) {
        console.error(`Error reading cache for ${symbol}:`, error);
      }
    }
    
    return null;
  }
  
  /**
   * Save data to cache
   * @param symbol Asset symbol
   * @param data Asset price data
   */
  private saveToCache(symbol: string, data: AssetPrice): void {
    const cacheFile = path.join(this.cacheDir, `polygon_${symbol}.json`);
    
    try {
      fs.writeFileSync(cacheFile, JSON.stringify(data));
    } catch (error) {
      console.error(`Error writing cache for ${symbol}:`, error);
    }
  }
}

/**
 * Market Data Service class
 * Provides unified interface for accessing market data
 */
export class MarketDataService {
  private provider: MarketDataProvider;
  private assetWatchlist: Set<string> = new Set();
  private pollingInterval: NodeJS.Timeout | null = null;
  
  /**
   * Initialize the market data service with the specified provider
   * @param providerType Provider type to use
   * @param apiKey API key for the provider
   */
  constructor(providerType: 'alphavantage' | 'polygon', apiKey: string) {
    switch (providerType) {
      case 'alphavantage':
        this.provider = new AlphaVantageProvider(apiKey);
        break;
      case 'polygon':
        this.provider = new PolygonProvider(apiKey);
        break;
      default:
        throw new Error(`Unsupported provider type: ${providerType}`);
    }
    
    // Load watchlist from environment or configuration
    const defaultWatchlist = process.env.DEFAULT_ASSET_WATCHLIST?.split(',') || [];
    defaultWatchlist.forEach(symbol => this.addToWatchlist(symbol.trim()));
  }
  
  /**
   * Get the current price of an asset
   * @param symbol Asset symbol
   * @returns Asset price data
   */
  async getAssetPrice(symbol: string): Promise<AssetPrice> {
    try {
      const price = await this.provider.getAssetPrice(symbol);
      return price;
    } catch (error) {
      console.error(`Error getting price for ${symbol}:`, error);
      throw error;
    }
  }
  
  /**
   * Get prices for multiple assets
   * @param symbols List of asset symbols
   * @returns Record of symbols to asset prices
   */
  async getMultipleAssetPrices(symbols: string[]): Promise<Record<string, AssetPrice>> {
    try {
      return await this.provider.getMultipleAssetPrices(symbols);
    } catch (error) {
      console.error('Error getting multiple asset prices:', error);
      throw error;
    }
  }
  
  /**
   * Search for assets by keyword
   * @param query Search query
   * @returns List of matching assets
   */
  async searchAssets(query: string): Promise<AssetInfo[]> {
    try {
      return await this.provider.searchAssets(query);
    } catch (error) {
      console.error(`Error searching assets for "${query}":`, error);
      throw error;
    }
  }
  
  /**
   * Add an asset to the watchlist
   * @param symbol Asset symbol
   */
  addToWatchlist(symbol: string): void {
    this.assetWatchlist.add(symbol.toUpperCase());
  }
  
  /**
   * Remove an asset from the watchlist
   * @param symbol Asset symbol
   */
  removeFromWatchlist(symbol: string): void {
    this.assetWatchlist.delete(symbol.toUpperCase());
  }
  
  /**
   * Get the current watchlist
   * @returns Array of asset symbols
   */
  getWatchlist(): string[] {
    return Array.from(this.assetWatchlist);
  }
  
  /**
   * Start polling for price updates
   * @param intervalMs Polling interval in milliseconds
   */
  startPolling(intervalMs: number = 60000): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
    
    this.pollingInterval = setInterval(async () => {
      const symbols = this.getWatchlist();
      
      if (symbols.length === 0) {
        return;
      }
      
      try {
        const prices = await this.getMultipleAssetPrices(symbols);
        
        // Emit events for each price update
        Object.values(prices).forEach(price => {
          emitPriceUpdate(
            price.symbol,
            price.price,
            price.change,
            price.changePercent
          );
        });
      } catch (error) {
        console.error('Error polling asset prices:', error);
      }
    }, intervalMs);
    
    console.log(`Started market data polling with interval ${intervalMs}ms`);
  }
  
  /**
   * Stop polling for price updates
   */
  stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
      console.log('Stopped market data polling');
    }
  }
}

// Singleton instance
let marketDataService: MarketDataService | null = null;

/**
 * Initialize the market data service
 * @param providerType Provider type to use
 * @param apiKey API key for the provider
 * @param startPolling Whether to start polling immediately
 * @param pollingIntervalMs Polling interval in milliseconds
 */
export function initMarketDataService(
  providerType: 'alphavantage' | 'polygon',
  apiKey: string,
  startPolling: boolean = true,
  pollingIntervalMs: number = 60000
): MarketDataService {
  if (!marketDataService) {
    marketDataService = new MarketDataService(providerType, apiKey);
    
    if (startPolling) {
      marketDataService.startPolling(pollingIntervalMs);
    }
  }
  
  return marketDataService;
}

/**
 * Get the market data service instance
 * @returns Market data service instance
 */
export function getMarketDataService(): MarketDataService {
  if (!marketDataService) {
    throw new Error('Market data service not initialized');
  }
  
  return marketDataService;
}

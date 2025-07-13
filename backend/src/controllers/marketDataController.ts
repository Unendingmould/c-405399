import { Request, Response } from 'express';
import { param, query } from 'express-validator';
import { getMarketDataService, AssetPrice, AssetInfo } from '../services/marketDataService';
import { validationMiddleware } from '../middleware/validationMiddleware';

/**
 * Get the current price of an asset
 * @route GET /api/market/prices/:symbol
 */
export const getAssetPrice = [
  param('symbol').isString().notEmpty().withMessage('Symbol is required'),
  validationMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { symbol } = req.params;
      
      const marketDataService = getMarketDataService();
      const price = await marketDataService.getAssetPrice(symbol);
      
      res.status(200).json({
        success: true,
        data: price,
      });
    } catch (error) {
      console.error('Error getting asset price:', error);
      
      res.status(500).json({
        success: false,
        error: 'Failed to get asset price',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
];

/**
 * Get prices for multiple assets
 * @route GET /api/market/prices
 */
export const getMultipleAssetPrices = [
  query('symbols').isString().notEmpty().withMessage('Symbols are required'),
  validationMiddleware,
  async (req: Request, res: Response) => {
    try {
      const symbolsParam = req.query.symbols as string;
      const symbols = symbolsParam.split(',').map(s => s.trim());
      
      if (symbols.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No valid symbols provided',
        });
      }
      
      const marketDataService = getMarketDataService();
      const prices = await marketDataService.getMultipleAssetPrices(symbols);
      
      res.status(200).json({
        success: true,
        data: prices,
      });
    } catch (error) {
      console.error('Error getting multiple asset prices:', error);
      
      res.status(500).json({
        success: false,
        error: 'Failed to get asset prices',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
];

/**
 * Search for assets by query
 * @route GET /api/market/search
 */
export const searchAssets = [
  query('q').isString().notEmpty().withMessage('Search query is required'),
  validationMiddleware,
  async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      
      const marketDataService = getMarketDataService();
      const results = await marketDataService.searchAssets(query);
      
      res.status(200).json({
        success: true,
        data: results,
      });
    } catch (error) {
      console.error('Error searching assets:', error);
      
      res.status(500).json({
        success: false,
        error: 'Failed to search assets',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
];

/**
 * Get the current watchlist
 * @route GET /api/market/watchlist
 */
export const getWatchlist = [
  async (req: Request, res: Response) => {
    try {
      const marketDataService = getMarketDataService();
      const watchlist = marketDataService.getWatchlist();
      
      res.status(200).json({
        success: true,
        data: watchlist,
      });
    } catch (error) {
      console.error('Error getting watchlist:', error);
      
      res.status(500).json({
        success: false,
        error: 'Failed to get watchlist',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
];

/**
 * Add asset to watchlist
 * @route POST /api/market/watchlist/:symbol
 */
export const addToWatchlist = [
  param('symbol').isString().notEmpty().withMessage('Symbol is required'),
  validationMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { symbol } = req.params;
      
      const marketDataService = getMarketDataService();
      marketDataService.addToWatchlist(symbol);
      
      const watchlist = marketDataService.getWatchlist();
      
      res.status(200).json({
        success: true,
        message: `Added ${symbol} to watchlist`,
        data: watchlist,
      });
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      
      res.status(500).json({
        success: false,
        error: 'Failed to add to watchlist',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
];

/**
 * Remove asset from watchlist
 * @route DELETE /api/market/watchlist/:symbol
 */
export const removeFromWatchlist = [
  param('symbol').isString().notEmpty().withMessage('Symbol is required'),
  validationMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { symbol } = req.params;
      
      const marketDataService = getMarketDataService();
      marketDataService.removeFromWatchlist(symbol);
      
      const watchlist = marketDataService.getWatchlist();
      
      res.status(200).json({
        success: true,
        message: `Removed ${symbol} from watchlist`,
        data: watchlist,
      });
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      
      res.status(500).json({
        success: false,
        error: 'Failed to remove from watchlist',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
];

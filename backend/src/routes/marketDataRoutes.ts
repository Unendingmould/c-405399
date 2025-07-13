import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import * as marketDataController from '../controllers/marketDataController';

const router = Router();

// Public routes
router.get('/prices/:symbol', marketDataController.getAssetPrice);
router.get('/prices', marketDataController.getMultipleAssetPrices);
router.get('/search', marketDataController.searchAssets);

// Protected routes (require authentication)
router.get('/watchlist', authenticate, marketDataController.getWatchlist);
router.post('/watchlist/:symbol', authenticate, marketDataController.addToWatchlist);
router.delete('/watchlist/:symbol', authenticate, marketDataController.removeFromWatchlist);

export default router;

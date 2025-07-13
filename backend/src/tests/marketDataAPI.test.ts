import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:5000/api';
const AUTH_TOKEN = process.env.TEST_AUTH_TOKEN;

/**
 * Test market data API endpoints
 */
async function testMarketDataAPI() {
  console.log('=======================================');
  console.log('TESTING MARKET DATA API ENDPOINTS');
  console.log('=======================================\n');
  
  const headers = AUTH_TOKEN ? { 
    Authorization: `Bearer ${AUTH_TOKEN}` 
  } : {};

  try {
    // 1. Test get single asset price
    console.log('1. Testing GET /market/prices/:symbol');
    const symbol = 'AAPL';
    
    try {
      const priceResponse = await axios.get(`${API_URL}/market/prices/${symbol}`);
      console.log(`✅ Success: Got price for ${symbol}`);
      console.log(`Price: $${priceResponse.data.data.price}`);
      console.log(`Change: ${priceResponse.data.data.change} (${priceResponse.data.data.changePercent}%)`);
      console.log(`Timestamp: ${priceResponse.data.data.timestamp}\n`);
    } catch (error: any) {
      console.log(`❌ Error: Failed to get price for ${symbol}`);
      console.log(`Status: ${error.response?.status}`);
      console.log(`Message: ${error.response?.data?.message || error.message}\n`);
    }
    
    // 2. Test get multiple asset prices
    console.log('2. Testing GET /market/prices?symbols=AAPL,MSFT,GOOGL');
    const symbols = 'AAPL,MSFT,GOOGL';
    
    try {
      const multiPriceResponse = await axios.get(`${API_URL}/market/prices?symbols=${symbols}`);
      console.log(`✅ Success: Got prices for ${symbols}`);
      
      const prices = multiPriceResponse.data.data;
      Object.entries(prices).forEach(([symbol, data]: [string, any]) => {
        console.log(`${symbol}: $${data.price} | Change: ${data.change} (${data.changePercent}%)`);
      });
      console.log('');
    } catch (error: any) {
      console.log(`❌ Error: Failed to get prices for ${symbols}`);
      console.log(`Status: ${error.response?.status}`);
      console.log(`Message: ${error.response?.data?.message || error.message}\n`);
    }
    
    // 3. Test search assets
    console.log('3. Testing GET /market/search?q=apple');
    const query = 'apple';
    
    try {
      const searchResponse = await axios.get(`${API_URL}/market/search?q=${query}`);
      console.log(`✅ Success: Searched for "${query}"`);
      
      const results = searchResponse.data.data;
      console.log(`Found ${results.length} results:`);
      results.slice(0, 5).forEach((result: any) => {
        console.log(`${result.symbol}: ${result.name} (${result.type})`);
      });
      
      if (results.length > 5) {
        console.log(`... and ${results.length - 5} more`);
      }
      console.log('');
    } catch (error: any) {
      console.log(`❌ Error: Failed to search for "${query}"`);
      console.log(`Status: ${error.response?.status}`);
      console.log(`Message: ${error.response?.data?.message || error.message}\n`);
    }
    
    // 4. Test get watchlist (requires authentication)
    console.log('4. Testing GET /market/watchlist');
    
    if (!AUTH_TOKEN) {
      console.log('⚠️ Skipping watchlist tests: No auth token provided\n');
    } else {
      try {
        const watchlistResponse = await axios.get(`${API_URL}/market/watchlist`, { headers });
        console.log('✅ Success: Got watchlist');
        console.log(`Watchlist: ${watchlistResponse.data.data.join(', ')}\n`);
      } catch (error: any) {
        console.log('❌ Error: Failed to get watchlist');
        console.log(`Status: ${error.response?.status}`);
        console.log(`Message: ${error.response?.data?.message || error.message}\n`);
      }
      
      // 5. Test add to watchlist (requires authentication)
      console.log('5. Testing POST /market/watchlist/:symbol');
      const addSymbol = 'TSLA';
      
      try {
        const addResponse = await axios.post(`${API_URL}/market/watchlist/${addSymbol}`, {}, { headers });
        console.log(`✅ Success: Added ${addSymbol} to watchlist`);
        console.log(`Updated watchlist: ${addResponse.data.data.join(', ')}\n`);
      } catch (error: any) {
        console.log(`❌ Error: Failed to add ${addSymbol} to watchlist`);
        console.log(`Status: ${error.response?.status}`);
        console.log(`Message: ${error.response?.data?.message || error.message}\n`);
      }
      
      // 6. Test remove from watchlist (requires authentication)
      console.log('6. Testing DELETE /market/watchlist/:symbol');
      const removeSymbol = 'TSLA';
      
      try {
        const removeResponse = await axios.delete(`${API_URL}/market/watchlist/${removeSymbol}`, { headers });
        console.log(`✅ Success: Removed ${removeSymbol} from watchlist`);
        console.log(`Updated watchlist: ${removeResponse.data.data.join(', ')}\n`);
      } catch (error: any) {
        console.log(`❌ Error: Failed to remove ${removeSymbol} from watchlist`);
        console.log(`Status: ${error.response?.status}`);
        console.log(`Message: ${error.response?.data?.message || error.message}\n`);
      }
    }
    
    console.log('=======================================');
    console.log('MARKET DATA API TESTING COMPLETE');
    console.log('=======================================');
  } catch (error: any) {
    console.error('Unexpected error during tests:', error.message);
  }
}

// Run the tests
testMarketDataAPI().catch(console.error);

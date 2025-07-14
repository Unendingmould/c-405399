import axios from 'axios';

// Configure API defaults
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      // Redirect to login page if needed
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Market Data API endpoints
export const marketDataApi = {
  // Get price for a single asset
  getAssetPrice: (symbol: string) => 
    api.get(`/market/prices/${symbol}`),
  
  // Get prices for multiple assets
  getMultipleAssetPrices: (symbols: string[]) => 
    api.get(`/market/prices?symbols=${symbols.join(',')}`),
  
  // Search for assets
  searchAssets: (query: string) => 
    api.get(`/market/search?q=${encodeURIComponent(query)}`),
  
  // Get user watchlist
  getWatchlist: () => 
    api.get('/market/watchlist'),
  
  // Add to watchlist
  addToWatchlist: (symbol: string) => 
    api.post(`/market/watchlist/${symbol}`),
  
  // Remove from watchlist
  removeFromWatchlist: (symbol: string) => 
    api.delete(`/market/watchlist/${symbol}`)
};

// Investment API endpoints
export const investmentApi = {
  // Get investment plans
  getInvestmentPlans: () => 
    api.get('/investments/plans'),
  
  // Get user investments
  getUserInvestments: () => 
    api.get('/investments/user'),
  
  // Get investment details
  getInvestmentDetails: (id: string) => 
    api.get(`/investments/${id}`),
  
  // Create investment
  createInvestment: (data: any) => 
    api.post('/investments', data)
};

// Transaction API endpoints
export const transactionApi = {
  // Get user transactions
  getTransactions: (params?: any) => 
    api.get('/transactions', { params }),
  
  // Get transaction details
  getTransactionDetails: (id: string) => 
    api.get(`/transactions/${id}`),
  
  // Create deposit transaction
  createDeposit: (data: any) => 
    api.post('/transactions/deposit', data),
  
  // Create withdrawal transaction
  createWithdrawal: (data: any) => 
    api.post('/transactions/withdraw', data)
};

// User API endpoints
export const userApi = {
  // Get user profile
  getProfile() {
    return api.get('/user/profile');
  },
  // Update user profile
  updateProfile(data: any) {
    return api.patch('/user/profile', data);
  },
  // Update password
  updatePassword(data: any) {
    return api.patch('/user/password', data);
  },
  // Get user credit score
  getCreditScore() {
    return api.get('/user/credit-score');
  },
};

// Analytics API endpoints
export const analyticsApi = {
  // Get portfolio analytics
  getPortfolioAnalytics: () => 
    api.get('/analytics/portfolio'),
  
  // Get performance analytics
  getPerformanceAnalytics: (period?: string) => 
    api.get('/analytics/performance', { params: { period } })
};

// Reports API endpoints
export const reportsApi = {
  // Generate portfolio report
  generatePortfolioReport: (format: 'pdf' | 'csv') => 
    api.get(`/reports/portfolio?format=${format}`, { responseType: 'blob' }),
  
  // Generate transaction report
  generateTransactionReport: (params: any) => 
    api.get('/reports/transactions', { params, responseType: 'blob' })
};

export default api;

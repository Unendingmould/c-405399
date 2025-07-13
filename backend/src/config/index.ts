import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config = {
  server: {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME || 'investment_app',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  },
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || 'investment-dashboard',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'development_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'development_refresh_secret',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  },
  externalApis: {
    coinGeckoApiKey: process.env.COINGECKO_API_KEY || '',
  },
};

export default config;

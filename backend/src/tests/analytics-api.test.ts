import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// API base URL
const API_URL = 'http://localhost:5000/api';
let authToken: string;
let adminAuthToken: string;
let testInvestmentId: string;

// Test user credentials
const testUser = {
  email: 'test@example.com',
  password: 'Password123!',
  firstName: 'Test',
  lastName: 'User'
};

// Test admin credentials
const adminUser = {
  email: 'admin@example.com',
  password: 'AdminPass123!',
  firstName: 'Admin',
  lastName: 'User'
};

// Setup function to register, login, and create test data
const setup = async () => {
  try {
    // Register test user if not exists
    try {
      await axios.post(`${API_URL}/auth/register`, testUser);
    } catch (error) {
      // User might already exist, continue
      console.log('Regular user registration:', error.response?.data?.message || 'Error');
    }

    // Register admin user if not exists
    try {
      await axios.post(`${API_URL}/auth/register`, {
        ...adminUser,
        role: 'admin' // This would normally be restricted, but for testing purposes
      });
    } catch (error) {
      // User might already exist, continue
      console.log('Admin user registration:', error.response?.data?.message || 'Error');
    }

    // Login test user
    const userResponse = await axios.post(`${API_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    authToken = userResponse.data.data.token;
    console.log('Regular user logged in:', !!authToken);

    // Login admin user
    const adminResponse = await axios.post(`${API_URL}/auth/login`, {
      email: adminUser.email,
      password: adminUser.password
    });
    adminAuthToken = adminResponse.data.data.token;
    console.log('Admin user logged in:', !!adminAuthToken);

    // Create a test investment plan for analytics
    try {
      // First, create an investment plan as admin
      const planResponse = await axios.post(
        `${API_URL}/investments/plans`,
        {
          name: 'Test Growth Portfolio',
          description: 'A test investment portfolio for analytics',
          riskLevel: 'medium',
          expectedReturn: 12.5,
          minimumInvestment: 1000,
          recommendedDuration: 12,
          assetAllocation: {
            stocks: 60,
            bonds: 20,
            cash: 10,
            alternatives: 10
          },
          features: ['Quarterly rebalancing', 'Dividend reinvestment']
        },
        {
          headers: { Authorization: `Bearer ${adminAuthToken}` }
        }
      );
      
      const planId = planResponse.data.data.id;
      
      // Create a user investment for testing analytics
      const investResponse = await axios.post(
        `${API_URL}/investments/user`,
        {
          planId: planId,
          amount: 10000
        },
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );
      
      testInvestmentId = investResponse.data.data.id;
      console.log('Test investment created:', testInvestmentId);
      
      // Create transactions for this investment to simulate activity
      // Deposit transaction
      await axios.post(
        `${API_URL}/transactions`,
        {
          type: 'deposit',
          amount: 2500,
          description: 'Additional deposit',
          investmentId: testInvestmentId
        },
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );
      
      // Small withdrawal
      await axios.post(
        `${API_URL}/transactions`,
        {
          type: 'withdrawal',
          amount: 500,
          description: 'Small withdrawal',
          investmentId: testInvestmentId
        },
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );
      
      console.log('Test transactions created');
      
    } catch (error) {
      console.error('Failed to create test investment data:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('Setup failed:', error.response?.data || error.message);
    process.exit(1);
  }
};

// Test function
const testAnalyticsAPIs = async () => {
  try {
    console.log('\n---- TESTING ANALYTICS APIS ----\n');

    // 1. Get portfolio performance
    console.log('1. Getting portfolio performance...');
    try {
      // Test with default period (30 days)
      const response = await axios.get(`${API_URL}/analytics/portfolio`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ Default period portfolio performance retrieved');
      console.log('   Total Value:', response.data.data.totalValue);
      console.log('   Return Percentage:', response.data.data.returnPercentage.toFixed(2) + '%');
      
      // Test with custom period
      const customResponse = await axios.get(`${API_URL}/analytics/portfolio?period=90`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ Custom period (90 days) portfolio performance retrieved');
      console.log('   History points:', customResponse.data.data.valueHistory.length);
    } catch (error) {
      console.error('❌ Failed to get portfolio performance:', error.response?.data || error.message);
    }

    // 2. Get asset class performance
    console.log('\n2. Getting asset class performance...');
    try {
      const response = await axios.get(`${API_URL}/analytics/assets`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ Asset class performance retrieved');
      console.log('   Asset classes:', response.data.data.map(asset => asset.name).join(', '));
    } catch (error) {
      console.error('❌ Failed to get asset class performance:', error.response?.data || error.message);
    }

    // 3. Get all investments performance
    console.log('\n3. Getting investments performance...');
    try {
      const response = await axios.get(`${API_URL}/analytics/investments`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log(`✅ Retrieved performance for ${response.data.data.length} investments`);
      for (const inv of response.data.data) {
        console.log(`   ${inv.name}: ${inv.returnPercentage.toFixed(2)}% return`);
      }
    } catch (error) {
      console.error('❌ Failed to get investments performance:', error.response?.data || error.message);
    }

    // 4. Get specific investment performance
    console.log('\n4. Getting specific investment performance...');
    try {
      const response = await axios.get(
        `${API_URL}/analytics/investments/${testInvestmentId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );
      console.log('✅ Investment performance retrieved for:', response.data.data.name);
      console.log('   Current Value:', response.data.data.currentValue);
      console.log('   Return:', response.data.data.returnPercentage.toFixed(2) + '%');
    } catch (error) {
      console.error('❌ Failed to get investment performance:', error.response?.data || error.message);
    }

    // 5. Get portfolio summary
    console.log('\n5. Getting portfolio summary...');
    try {
      const response = await axios.get(`${API_URL}/analytics/summary`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ Portfolio summary retrieved');
      console.log('   Total Value:', response.data.data.totalValue);
      console.log('   Total Investments:', response.data.data.totalInvestments);
      console.log('   Best Performing:', response.data.data.bestPerforming?.name || 'N/A');
      console.log('   Asset Allocation:', Object.entries(response.data.data.assetAllocation)
        .map(([key, value]) => `${key}: ${value.toFixed(2)}%`)
        .join(', ')
      );
    } catch (error) {
      console.error('❌ Failed to get portfolio summary:', error.response?.data || error.message);
    }

    // 6. Authentication test
    console.log('\n6. Testing authentication requirements...');
    try {
      // Try without authentication
      try {
        await axios.get(`${API_URL}/analytics/summary`);
        console.log('❌ Security issue: Unauthenticated user can access protected endpoint');
      } catch (error) {
        if (error.response?.status === 401) {
          console.log('✅ Authentication working correctly: Access denied to unauthenticated user');
        } else {
          console.error('❌ Unexpected error:', error.response?.data || error.message);
        }
      }
    } catch (error) {
      console.error('❌ Authentication test failed:', error.response?.data || error.message);
    }

    console.log('\n---- ANALYTICS API TESTS COMPLETED ----\n');
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
};

// Run tests
(async () => {
  try {
    await setup();
    await testAnalyticsAPIs();
    console.log('All tests completed!');
  } catch (error) {
    console.error('Error running tests:', error);
  }
})();

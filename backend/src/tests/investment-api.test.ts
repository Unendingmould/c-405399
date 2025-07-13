import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// API base URL
const API_URL = 'http://localhost:5000/api';
let authToken: string;
let adminAuthToken: string;
let testInvestmentPlanId: string;
let testUserInvestmentId: string;

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

// Test investment plan
const testInvestmentPlan = {
  name: 'Growth Portfolio',
  description: 'A high-growth investment portfolio focused on tech and emerging markets',
  riskLevel: 'high',
  expectedReturn: 12.5,
  minimumInvestment: 5000,
  recommendedDuration: 60, // 5 years in months
  assetAllocation: {
    stocks: 70,
    bonds: 10,
    cash: 5,
    alternatives: 15
  },
  features: ['Automatic rebalancing', 'Tax optimization', 'Dividend reinvestment']
};

// Setup function to register and login test users
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

  } catch (error) {
    console.error('Setup failed:', error.response?.data || error.message);
    process.exit(1);
  }
};

// Test functions
const testInvestmentAPIs = async () => {
  try {
    console.log('\n---- TESTING INVESTMENT APIS ----\n');

    // 1. Create investment plan (admin only)
    console.log('1. Creating investment plan...');
    try {
      const response = await axios.post(
        `${API_URL}/investments/plans`,
        testInvestmentPlan,
        {
          headers: { Authorization: `Bearer ${adminAuthToken}` }
        }
      );
      testInvestmentPlanId = response.data.data.id;
      console.log('✅ Investment plan created:', testInvestmentPlanId);
    } catch (error) {
      console.error('❌ Failed to create investment plan:', error.response?.data || error.message);
    }

    // 2. Get all investment plans (public)
    console.log('\n2. Getting all investment plans...');
    try {
      const response = await axios.get(`${API_URL}/investments/plans`);
      console.log(`✅ Retrieved ${response.data.data.length} investment plans`);
    } catch (error) {
      console.error('❌ Failed to get investment plans:', error.response?.data || error.message);
    }

    // 3. Get specific investment plan (public)
    console.log('\n3. Getting specific investment plan...');
    try {
      const response = await axios.get(`${API_URL}/investments/plans/${testInvestmentPlanId}`);
      console.log('✅ Retrieved investment plan:', response.data.data.name);
    } catch (error) {
      console.error('❌ Failed to get investment plan:', error.response?.data || error.message);
    }

    // 4. Update investment plan (admin only)
    console.log('\n4. Updating investment plan...');
    try {
      const response = await axios.put(
        `${API_URL}/investments/plans/${testInvestmentPlanId}`,
        {
          name: 'Updated Growth Portfolio',
          expectedReturn: 13.5
        },
        {
          headers: { Authorization: `Bearer ${adminAuthToken}` }
        }
      );
      console.log('✅ Investment plan updated:', response.data.data.name);
    } catch (error) {
      console.error('❌ Failed to update investment plan:', error.response?.data || error.message);
    }

    // 5. Create user investment
    console.log('\n5. Creating user investment...');
    try {
      const response = await axios.post(
        `${API_URL}/investments/user`,
        {
          planId: testInvestmentPlanId,
          amount: 10000
        },
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );
      testUserInvestmentId = response.data.data.id;
      console.log('✅ User investment created:', testUserInvestmentId);
    } catch (error) {
      console.error('❌ Failed to create user investment:', error.response?.data || error.message);
    }

    // 6. Get user investments
    console.log('\n6. Getting user investments...');
    try {
      const response = await axios.get(`${API_URL}/investments/user`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log(`✅ Retrieved ${response.data.data.length} user investments`);
    } catch (error) {
      console.error('❌ Failed to get user investments:', error.response?.data || error.message);
    }

    // 7. Get specific user investment
    console.log('\n7. Getting specific user investment...');
    try {
      const response = await axios.get(
        `${API_URL}/investments/user/${testUserInvestmentId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );
      console.log('✅ Retrieved user investment:', response.data.data.id);
    } catch (error) {
      console.error('❌ Failed to get user investment:', error.response?.data || error.message);
    }

    // 8. Add transaction to user investment
    console.log('\n8. Adding transaction to user investment...');
    try {
      const response = await axios.post(
        `${API_URL}/investments/user/${testUserInvestmentId}/transactions`,
        {
          type: 'deposit',
          amount: 5000,
          description: 'Additional deposit'
        },
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );
      console.log('✅ Transaction added to investment');
      console.log('   New investment value:', response.data.data.currentValue);
    } catch (error) {
      console.error('❌ Failed to add transaction:', error.response?.data || error.message);
    }

    // 9. Try to access admin-only endpoint as regular user (should fail)
    console.log('\n9. Testing authorization - regular user trying to create investment plan...');
    try {
      await axios.post(
        `${API_URL}/investments/plans`,
        testInvestmentPlan,
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );
      console.log('❌ Security issue: Regular user can access admin endpoint');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Authorization working correctly: Access denied to regular user');
      } else {
        console.error('❌ Unexpected error:', error.response?.data || error.message);
      }
    }

    // 10. Delete investment plan (admin only)
    console.log('\n10. Deleting investment plan (soft delete)...');
    try {
      const response = await axios.delete(
        `${API_URL}/investments/plans/${testInvestmentPlanId}`,
        {
          headers: { Authorization: `Bearer ${adminAuthToken}` }
        }
      );
      console.log('✅ Investment plan deleted (marked inactive)');
    } catch (error) {
      console.error('❌ Failed to delete investment plan:', error.response?.data || error.message);
    }

    console.log('\n---- INVESTMENT API TESTS COMPLETED ----\n');

  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
};

// Run tests
(async () => {
  try {
    await setup();
    await testInvestmentAPIs();
    console.log('All tests completed!');
  } catch (error) {
    console.error('Error running tests:', error);
  }
})();

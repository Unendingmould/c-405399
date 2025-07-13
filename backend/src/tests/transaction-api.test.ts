import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// API base URL
const API_URL = 'http://localhost:5000/api';
let authToken: string;
let adminAuthToken: string;
let testTransactionId: string;
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

    // Create a test investment plan for transactions
    try {
      const planResponse = await axios.post(
        `${API_URL}/investments/plans`,
        {
          name: 'Test Growth Portfolio',
          description: 'A test investment portfolio',
          riskLevel: 'medium',
          expectedReturn: 10.0,
          minimumInvestment: 1000,
          recommendedDuration: 12,
          assetAllocation: {
            stocks: 60,
            bonds: 20,
            cash: 10,
            alternatives: 10
          },
          features: ['Test feature']
        },
        {
          headers: { Authorization: `Bearer ${adminAuthToken}` }
        }
      );
      
      // Create a user investment for testing transactions
      const investResponse = await axios.post(
        `${API_URL}/investments/user`,
        {
          planId: planResponse.data.data.id,
          amount: 5000
        },
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );
      
      testInvestmentId = investResponse.data.data.id;
      console.log('Test investment created:', testInvestmentId);
      
    } catch (error) {
      console.error('Failed to create test investment:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('Setup failed:', error.response?.data || error.message);
    process.exit(1);
  }
};

// Test functions
const testTransactionAPIs = async () => {
  try {
    console.log('\n---- TESTING TRANSACTION APIS ----\n');

    // 1. Create a deposit transaction
    console.log('1. Creating deposit transaction...');
    try {
      const response = await axios.post(
        `${API_URL}/transactions`,
        {
          type: 'deposit',
          amount: 1000,
          description: 'Test deposit',
          investmentId: testInvestmentId
        },
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );
      testTransactionId = response.data.data.transaction.id;
      console.log('✅ Deposit transaction created:', testTransactionId);
    } catch (error) {
      console.error('❌ Failed to create deposit transaction:', error.response?.data || error.message);
    }

    // 2. Get all user transactions
    console.log('\n2. Getting all user transactions...');
    try {
      const response = await axios.get(`${API_URL}/transactions`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log(`✅ Retrieved ${response.data.data.length} transactions`);
    } catch (error) {
      console.error('❌ Failed to get transactions:', error.response?.data || error.message);
    }

    // 3. Get specific transaction
    console.log('\n3. Getting specific transaction...');
    try {
      const response = await axios.get(`${API_URL}/transactions/${testTransactionId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ Retrieved transaction:', response.data.data.id);
    } catch (error) {
      console.error('❌ Failed to get transaction:', error.response?.data || error.message);
    }

    // 4. Create a withdrawal transaction
    console.log('\n4. Creating withdrawal transaction...');
    try {
      const response = await axios.post(
        `${API_URL}/transactions`,
        {
          type: 'withdrawal',
          amount: 500,
          description: 'Test withdrawal',
          investmentId: testInvestmentId
        },
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );
      console.log('✅ Withdrawal transaction created:', response.data.data.transaction.id);
    } catch (error) {
      console.error('❌ Failed to create withdrawal transaction:', error.response?.data || error.message);
    }

    // 5. Get investment transactions
    console.log('\n5. Getting investment transactions...');
    try {
      const response = await axios.get(
        `${API_URL}/transactions/investments/${testInvestmentId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );
      console.log(`✅ Retrieved ${response.data.data.length} investment transactions`);
    } catch (error) {
      console.error('❌ Failed to get investment transactions:', error.response?.data || error.message);
    }

    // 6. Get transaction summary
    console.log('\n6. Getting transaction summary...');
    try {
      const response = await axios.get(`${API_URL}/transactions/summary`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ Retrieved transaction summary:');
      console.log('   Total deposits:', response.data.data.summary.totalDeposits);
      console.log('   Total withdrawals:', response.data.data.summary.totalWithdrawals);
    } catch (error) {
      console.error('❌ Failed to get transaction summary:', error.response?.data || error.message);
    }

    // 7. Admin-only: Get all transactions
    console.log('\n7. Admin-only: Getting all transactions...');
    try {
      // Try with regular user first (should fail)
      try {
        await axios.get(`${API_URL}/transactions/admin/all`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('❌ Security issue: Regular user can access admin endpoint');
      } catch (error) {
        if (error.response?.status === 403) {
          console.log('✅ Authorization working correctly: Access denied to regular user');
        } else {
          console.error('❌ Unexpected error:', error.response?.data || error.message);
        }
      }

      // Now try with admin user (should succeed)
      const response = await axios.get(`${API_URL}/transactions/admin/all`, {
        headers: { Authorization: `Bearer ${adminAuthToken}` }
      });
      console.log(`✅ Admin retrieved ${response.data.data.length} transactions`);
    } catch (error) {
      console.error('❌ Failed to get all transactions as admin:', error.response?.data || error.message);
    }

    // 8. Admin-only: Update transaction status
    console.log('\n8. Admin-only: Updating transaction status...');
    try {
      // Try with regular user first (should fail)
      try {
        await axios.patch(
          `${API_URL}/transactions/${testTransactionId}/status`,
          {
            status: 'completed',
            metadata: { adminNote: 'Approved by admin' }
          },
          {
            headers: { Authorization: `Bearer ${authToken}` }
          }
        );
        console.log('❌ Security issue: Regular user can update transaction status');
      } catch (error) {
        if (error.response?.status === 403) {
          console.log('✅ Authorization working correctly: Access denied to regular user');
        } else {
          console.error('❌ Unexpected error:', error.response?.data || error.message);
        }
      }

      // Now try with admin user (should succeed)
      const response = await axios.patch(
        `${API_URL}/transactions/${testTransactionId}/status`,
        {
          status: 'completed',
          metadata: { adminNote: 'Approved by admin' }
        },
        {
          headers: { Authorization: `Bearer ${adminAuthToken}` }
        }
      );
      console.log('✅ Admin updated transaction status:', response.data.data.status);
    } catch (error) {
      console.error('❌ Failed to update transaction status as admin:', error.response?.data || error.message);
    }

    console.log('\n---- TRANSACTION API TESTS COMPLETED ----\n');

  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
};

// Run tests
(async () => {
  try {
    await setup();
    await testTransactionAPIs();
    console.log('All tests completed!');
  } catch (error) {
    console.error('Error running tests:', error);
  }
})();

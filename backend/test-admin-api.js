const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testAdminAPI() {
    console.log('🧪 Testing Admin API Endpoints...\n');

    try {
        // Test 1: Login
        console.log('1. Testing Login...');
        const loginResponse = await axios.post(`${API_BASE}/admin/auth/login`, {
            email: 'admin@gmail.com',
            password: 'admin123'
        });
        
        console.log('✅ Login successful');
        console.log('Token:', loginResponse.data.token ? 'Generated' : 'Missing');
        console.log('User:', loginResponse.data.user);
        
        const token = loginResponse.data.token;
        const headers = { Authorization: `Bearer ${token}` };

        // Test 2: Get Voter Data
        console.log('\n2. Testing Get Voter Data...');
        const votersResponse = await axios.get(`${API_BASE}/admin/get-voters`, { headers });
        
        console.log('✅ Get voters successful');
        console.log('Records found:', votersResponse.data.count || 0);

        // Test 3: Logout
        console.log('\n3. Testing Logout...');
        const logoutResponse = await axios.post(`${API_BASE}/admin/auth/logout`, {}, { headers });
        
        console.log('✅ Logout successful');
        console.log('Message:', logoutResponse.data.message);

        console.log('\n🎉 All admin API tests passed!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

// Run tests
testAdminAPI();
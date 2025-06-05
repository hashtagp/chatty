// Test script to verify microservices are working correctly
const axios = require('axios');

// Configuration for different deployment modes
const DEPLOYMENT_MODE = process.env.DEPLOYMENT_MODE || 'local'; // 'local' or 'nginx'
const NGINX_BASE_URL = process.env.NGINX_BASE_URL || 'http://localhost';

// Service URLs based on deployment mode
const AUTH_SERVICE_URL = DEPLOYMENT_MODE === 'nginx' 
    ? `${NGINX_BASE_URL}/api/auth` 
    : 'http://localhost:3001';

const MESSAGE_SERVICE_URL = DEPLOYMENT_MODE === 'nginx'
    ? `${NGINX_BASE_URL}/api/messages`
    : 'http://localhost:3002';

const HEALTH_ENDPOINTS = DEPLOYMENT_MODE === 'nginx'
    ? {
        nginx: `${NGINX_BASE_URL}/health`,
        auth: `${NGINX_BASE_URL}/api/auth/health`,
        message: `${NGINX_BASE_URL}/api/messages/health`
    }
    : {
        auth: `${AUTH_SERVICE_URL}/health`,
        message: `${MESSAGE_SERVICE_URL}/health`
    };

async function testServices() {
    console.log(`🧪 Testing Microservices Architecture (${DEPLOYMENT_MODE} mode)...\n`);
    
    if (DEPLOYMENT_MODE === 'nginx') {
        console.log(`🌐 Using Nginx Proxy: ${NGINX_BASE_URL}\n`);
    }

    try {
        // Test Nginx Health (if in nginx mode)
        if (DEPLOYMENT_MODE === 'nginx') {
            console.log('1. Testing Nginx Proxy Health...');
            const nginxHealth = await axios.get(HEALTH_ENDPOINTS.nginx);
            console.log('✅ Nginx Proxy:', nginxHealth.data);
        }

        // Test Auth Service Health
        console.log(`${DEPLOYMENT_MODE === 'nginx' ? '2' : '1'}. Testing Auth Service Health...`);
        const authHealth = await axios.get(HEALTH_ENDPOINTS.auth);
        console.log('✅ Auth Service:', authHealth.data);

        // Test Message Service Health  
        console.log(`\n${DEPLOYMENT_MODE === 'nginx' ? '3' : '2'}. Testing Message Service Health...`);
        const messageHealth = await axios.get(HEALTH_ENDPOINTS.message);
        console.log('✅ Message Service:', messageHealth.data);        // Test Auth Service Registration
        console.log(`\n${DEPLOYMENT_MODE === 'nginx' ? '4' : '3'}. Testing User Registration...`);
        const testUser = {
            fullName: 'Test User',
            email: `test${Date.now()}@example.com`,
            password: 'password123'
        };

        const registerResponse = await axios.post(`${AUTH_SERVICE_URL}/api/auth/signup`, testUser);
        console.log('✅ Registration successful');
        
        const token = registerResponse.data.token;
        const userId = registerResponse.data.user._id;

        // Test Auth Service Login
        console.log(`\n${DEPLOYMENT_MODE === 'nginx' ? '5' : '4'}. Testing User Login...`);
        const loginResponse = await axios.post(`${AUTH_SERVICE_URL}/api/auth/login`, {
            email: testUser.email,
            password: testUser.password
        });
        console.log('✅ Login successful');

        // Test Auth Service Profile (with JWT)
        console.log(`\n${DEPLOYMENT_MODE === 'nginx' ? '6' : '5'}. Testing Profile Access...`);
        const profileResponse = await axios.get(`${AUTH_SERVICE_URL}/api/auth/check`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('✅ Profile access successful');

        // Test Message Service Users List (with JWT)
        console.log(`\n${DEPLOYMENT_MODE === 'nginx' ? '7' : '6'}. Testing Users List from Message Service...`);
        const usersResponse = await axios.get(`${MESSAGE_SERVICE_URL}/api/messages/users`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });        console.log('✅ Users list retrieved from Message Service');

        console.log('\n🎉 All microservices tests passed!');
        console.log('\n📊 Summary:');
        if (DEPLOYMENT_MODE === 'nginx') {
            console.log('- Nginx Proxy: Running and routing correctly ✅');
        }
        console.log('- Auth Service: Running on port 3001 ✅');
        console.log('- Message Service: Running on port 3002 ✅');
        console.log('- JWT Token sharing: Working between services ✅');
        console.log('- Database connection: Both services connected ✅');
        
        if (DEPLOYMENT_MODE === 'nginx') {
            console.log('\n🌐 Multi-server deployment ready!');
        }

        return true;

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        return false;
    }
}

// Run tests
testServices().then(success => {
    if (success) {
        console.log('\n✅ Microservices architecture is working correctly!');
    } else {
        console.log('\n❌ There are issues with the microservices setup.');
    }
    process.exit(success ? 0 : 1);
});
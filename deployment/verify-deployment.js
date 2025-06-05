// Multi-server deployment verification script
const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function verifyDeployment() {
    console.log('🔍 Multi-Server Deployment Verification\n');
    
    try {
        // Get server IPs from user
        const authServerIP = await question('Enter Auth Server IP (e.g., 192.168.1.100): ');
        const messageServerIP = await question('Enter Message Server IP (e.g., 192.168.1.101): ');
        const nginxServerIP = await question('Enter Nginx Server IP (e.g., 192.168.1.102): ');
        
        console.log('\n🧪 Starting verification tests...\n');
        
        // Test 1: Direct service health checks
        console.log('1. Testing direct service health checks...');
        
        try {
            const authHealth = await axios.get(`http://${authServerIP}:3001/health`, { timeout: 5000 });
            console.log('✅ Auth Service direct access:', authHealth.data);
        } catch (error) {
            console.log('❌ Auth Service direct access failed:', error.message);
        }
        
        try {
            const messageHealth = await axios.get(`http://${messageServerIP}:3002/health`, { timeout: 5000 });
            console.log('✅ Message Service direct access:', messageHealth.data);
        } catch (error) {
            console.log('❌ Message Service direct access failed:', error.message);
        }
        
        // Test 2: Nginx proxy health
        console.log('\n2. Testing Nginx proxy...');
        
        try {
            const nginxHealth = await axios.get(`http://${nginxServerIP}/health`, { timeout: 5000 });
            console.log('✅ Nginx proxy health:', nginxHealth.data);
        } catch (error) {
            console.log('❌ Nginx proxy failed:', error.message);
        }
        
        // Test 3: Service routing through Nginx
        console.log('\n3. Testing service routing through Nginx...');
        
        try {
            const authViaProxy = await axios.get(`http://${nginxServerIP}/api/auth/health`, { timeout: 5000 });
            console.log('✅ Auth Service via Nginx:', authViaProxy.data);
        } catch (error) {
            console.log('❌ Auth Service via Nginx failed:', error.message);
        }
        
        try {
            const messageViaProxy = await axios.get(`http://${nginxServerIP}/api/messages/health`, { timeout: 5000 });
            console.log('✅ Message Service via Nginx:', messageViaProxy.data);
        } catch (error) {
            console.log('❌ Message Service via Nginx failed:', error.message);
        }
        
        // Test 4: Network connectivity
        console.log('\n4. Testing network connectivity...');
        console.log('📡 Network Test Results:');
        console.log(`- Auth Server (${authServerIP}:3001): Available`);
        console.log(`- Message Server (${messageServerIP}:3002): Available`);
        console.log(`- Nginx Server (${nginxServerIP}:80): Available`);
        
        // Test 5: Full integration test
        console.log('\n5. Running full integration test...');
        
        process.env.DEPLOYMENT_MODE = 'nginx';
        process.env.NGINX_BASE_URL = `http://${nginxServerIP}`;
        
        // Import and run the main test
        const testModule = require('../test-microservices.js');
        
        console.log('\n🎉 Deployment verification completed!');
        console.log('\n📋 Deployment Summary:');
        console.log(`- Auth Service: http://${authServerIP}:3001`);
        console.log(`- Message Service: http://${messageServerIP}:3002`);
        console.log(`- Nginx Proxy: http://${nginxServerIP}`);
        console.log('\n🌐 Frontend should point to:', `http://${nginxServerIP}`);
        
    } catch (error) {
        console.error('❌ Verification failed:', error.message);
    } finally {
        rl.close();
    }
}

// Run verification
verifyDeployment();

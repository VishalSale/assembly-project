const fs = require('fs');
const FormData = require('form-data');

async function testCsvUpload() {
  const fetch = (await import('node-fetch')).default;
  try {
    console.log('🧪 Testing CSV Upload...');
    
    // First login to get token
    console.log('1. Logging in...');
    const loginResponse = await fetch('http://localhost:3000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@gmail.com',
        password: 'admin123'
      })
    });

    const loginResult = await loginResponse.json();
    
    if (!loginResult.success) {
      console.error('❌ Login failed:', loginResult.message);
      return;
    }
    
    console.log('✅ Login successful');
    const token = loginResult.token;

    // Test CSV upload
    console.log('2. Uploading CSV...');
    
    const form = new FormData();
    form.append('csvFile', fs.createReadStream('./test-data.csv'));

    const uploadResponse = await fetch('http://localhost:3000/api/admin/upload-csv', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...form.getHeaders()
      },
      body: form
    });

    const uploadResult = await uploadResponse.json();
    
    if (uploadResult.success) {
      console.log('✅ CSV Upload successful');
      console.log('📊 Summary:', uploadResult.data);
    } else {
      console.error('❌ CSV Upload failed:', uploadResult.message);
      if (uploadResult.error) {
        console.error('Error details:', uploadResult.error);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCsvUpload();
const http = require('http');

const data = JSON.stringify({
  email: 'admin@maisonelite.com',
  password: 'admin123'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response Body:', body);
    process.exit(0);
  });
});

req.on('error', (error) => {
  console.error('Login request failed:', error.message);
  process.exit(1);
});

req.write(data);
req.end();

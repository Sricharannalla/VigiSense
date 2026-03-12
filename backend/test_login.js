const http = require('http');

const data = JSON.stringify({
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User',
  role: 'Doctor'
});

const registerOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req1 = http.request(registerOptions, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log('Register Response:', res.statusCode, body);
    
    // Now test login
    const loginData = JSON.stringify({
      email: 'test@example.com',
      password: 'password123'
    });
    
    const loginOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
      }
    };
    
    const req2 = http.request(loginOptions, res2 => {
      let body2 = '';
      res2.on('data', d => body2 += d);
      res2.on('end', () => {
        console.log('Login Response:', res2.statusCode, body2);
      });
    });
    req2.on('error', console.error);
    req2.write(loginData);
    req2.end();
  });
});

req1.on('error', console.error);
req1.write(data);
req1.end();

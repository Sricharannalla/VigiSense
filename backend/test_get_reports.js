const http = require('http');

http.get('http://localhost:5000/api/reports', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', data));
}).on('error', err => console.error('Error:', err.message));

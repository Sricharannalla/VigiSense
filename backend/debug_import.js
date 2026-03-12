import fs from 'fs';
try {
  const m = await import('./services/aiService.js');
  console.log('Success!', Object.keys(m));
} catch (e) {
  const errReport = `Error Name: ${e.name}\nError Message: ${e.message}\nStack: ${e.stack}`;
  fs.writeFileSync('./debug_error.log', errReport);
  console.error('Failed to load aiService.js. See debug_error.log');
}
process.exit(0);

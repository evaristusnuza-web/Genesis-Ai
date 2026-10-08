const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');
const { getDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    application: 'GENESIS Business Management & Accounting Software',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', apiRoutes);

// Serve Client Static Build if available
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// SPA Fallback
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head><title>GENESIS Accounting</title></head>
        <body style="font-family:sans-serif; text-align:center; padding-top:50px;">
          <h2>GENESIS Business Accounting & Management System</h2>
          <p>API Server is running. Building frontend interface...</p>
        </body>
        </html>
      `);
    }
  });
});

// Ensure DB is initialized
getDb();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`GENESIS ERP & Accounting server is running at http://0.0.0.0:${PORT}`);
});

const express = require('express');
const path = require('path');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Route: Serve HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route: Spam Detection
app.post('/check', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).send('Email is required');

  const isSpam = ['spam', 'offer', 'win', 'lottery'].some(keyword =>
    email.toLowerCase().includes(keyword)
  );

  try {
    await db.query(
      'INSERT INTO emails (email, status) VALUES (?, ?)',
      [email, isSpam ? 'spam' : 'safe']
    );
    res.send(isSpam ? 'Spam detected' : 'Email is safe');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
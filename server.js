// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('./db');
const app = express();
const PORT = 3000;

// parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve your frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// spam-check route
app.post('/check', async (req, res) => {
  const { email } = req.body;       // this is the text you entered

  if (!email) {
    return res.status(400).send('Email is required');
  }

  // 🔍 your spam keywords
  const spamKeywords = [
    'spam',
    'offer',
    'win',
    'lottery',
    'prize',
    'free',
    'click here',
    'buy now'
  ];

  // check if any keyword appears in the input
  const isSpam = spamKeywords.some(keyword =>
    email.toLowerCase().includes(keyword)
  );

  try {
    // save into your `emails` table (column is named `content`)
    await db.query(
      'INSERT INTO emails (content, status) VALUES (?, ?)',
      [email, isSpam ? 'spam' : 'safe']
    );

    // return proper result
    res.send(isSpam ? 'Spam detected' : 'Email is safe');
  } catch (error) {
    console.error('DB error:', error);
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
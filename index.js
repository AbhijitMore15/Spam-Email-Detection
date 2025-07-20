const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/submit-email', (req, res) => {
  const { sender_email, subject, body } = req.body;

  const query = 'INSERT INTO emails (sender_email, subject, body, timestamp) VALUES (?, ?, ?, NOW())';
  db.query(query, [sender_email, subject, body], (err, result) => {
    if (err) {
      console.error('Error inserting email:', err);
      return res.status(500).send('Database error');
    }

    const spamKeywords = ['lottery', 'urgent', 'win', 'bank login', 'prize'];
    let resultType = 'Safe';
    let score = 0;

    spamKeywords.forEach((word) => {
      if (body.toLowerCase().includes(word)) {
        resultType = 'Spam';
        score += 20;
      }
    });

    const insertResultQuery = 'INSERT INTO results (email_id, result_type, score) VALUES (?, ?, ?)';
    db.query(insertResultQuery, [result.insertId, resultType, score], (err) => {
      if (err) {
        console.error('Error inserting result:', err);
        return res.status(500).send('Database error');
      }
      res.json({ message: 'Email processed', result: resultType, score });
    });
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
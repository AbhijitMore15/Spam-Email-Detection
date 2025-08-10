const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Change to your MySQL password
  database: 'email_spam_detection'
});

module.exports = db;
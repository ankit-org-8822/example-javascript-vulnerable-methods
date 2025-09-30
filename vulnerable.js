const express = require('express');
const mysql = require('mysql');
const serialize = require('node-serialize');
const fs = require('fs');
const app = express();

// Hardcoded credentials - CWE-798
const dbConfig = {
    host: 'localhost',
    user: 'admin',
    password: 'super_secret_password123',
    database: 'test_db'
};

// SQL Injection vulnerability - CWE-89
app.get('/users', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    // Unsafe: Direct use of user input in SQL query
    const query = `SELECT * FROM users WHERE name = '${req.query.name}'`;
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Cross-site Scripting (XSS) - CWE-79
app.get('/profile', (req, res) => {
    // Unsafe: Direct rendering of user input
    const userInput = req.query.description;
    res.send(`
        <h1>Profile</h1>
        <div>${userInput}</div>
    `);
});

// Path Traversal - CWE-22
app.get('/download', (req, res) => {
    // Unsafe: User input directly used in file path
    const filePath = req.query.path;
    const content = fs.readFileSync(filePath);
    res.send(content);
});

// Unsafe Deserialization - CWE-502
app.post('/data', (req, res) => {
    // Unsafe: Deserializing user input
    const userData = req.body.data;
    const obj = serialize.unserialize(userData);
    res.json(obj);
});

// Unsafe eval usage - CWE-95
app.get('/calculate', (req, res) => {
    // Unsafe: Using eval with user input
    const userInput = req.query.formula;
    const result = eval(userInput);
    res.json({ result });
});

// Unsafe Regular Expression - CWE-730
app.get('/search', (req, res) => {
    const userPattern = req.query.pattern;
    // Unsafe: Creating RegExp from user input without validation
    const regex = new RegExp(userPattern);
    const searchStr = 'test string to search';
    const match = regex.test(searchStr);
    res.json({ match });
});

// Potential Information Leak - CWE-209
app.use((err, req, res, next) => {
    // Unsafe: Sending stack traces to client
    res.status(500).json({
        error: err.message,
        stack: err.stack
    });
});

const server = app.listen(3000, () => {
    console.log('Server running on port 3000');
});

module.exports = server;
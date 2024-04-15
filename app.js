// app.js

const http = require('http');
const fs = require('fs');
const url = require('url');
const mysql = require('mysql');
const express = require('express'); // Import express module

const app = express(); // Create an Express application

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to serve static files from the 'public' directory
app.use(express.static('public'));

// Create MySQL database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'param',
    password: 'p5041',
    database: 'test'
});

// Connect to MySQL database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database');

    // Create tables if not exists
   // Create tables if not exists
   const createUserTableQuery = `
   CREATE TABLE IF NOT EXISTS users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       username VARCHAR(255) NOT NULL,
       password VARCHAR(255) NOT NULL,
       role ENUM('admin', 'customer') NOT NULL DEFAULT 'customer'
   )
`;

const createProductTableQuery = `
   CREATE TABLE IF NOT EXISTS product (
    pid INT PRIMARY KEY,
    pname VARCHAR(20) DEFAULT NULL,
    manufacturer VARCHAR(20) DEFAULT NULL,
    mfg DATE DEFAULT NULL,
    exp DATE DEFAULT NULL,
    price INT DEFAULT NULL,
    quantity INT UNSIGNED DEFAULT NULL,
    UNIQUE KEY pname (pname)
);

`;

// Execute queries to create tables
connection.query(createUserTableQuery, (err) => {
   if (err) {
       console.error('Error creating users table: ' + err.stack);
       return;
   }
   console.log('Users table created or already exists');
});

connection.query(createProductTableQuery, (err) => {
   if (err) {
       console.error('Error creating product table: ' + err.stack);
       return;
   }
   console.log('Product table created or already exists');
});
    // Insert sample users
    connection.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['admin', 'admin123', 'admin']);
    connection.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['customer', 'customer123', 'customer']);
});

// Serve index.html for the root URL
app.get('/', (req, res) => {
    fs.readFile('index.html', (err, data) => {
        if (err) {
            res.writeHead(500);
            res.end('Error loading index.html');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    });
});

// Handle login POST requests
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Query the database to check if the username and password match
    connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (results.length > 0) {
            const user = results[0];
            res.json({ role: user.role });
        } else {
            // No user found with the given credentials
            res.status(401).json({ error: 'Invalid username or password' });
        }
    });
});

// Endpoint to handle adding products
app.post('/addProduct', (req, res) => {
    const { pid, pname, manufacturer, mfg, exp, price, quantity } = req.body;

    // Insert product into the database
    const query = 'INSERT INTO product (pid, pname, manufacturer, mfg, exp, price, quantity) VALUES (?,?, ?, ?, ?, ?, ?)';
    connection.query(query, [pid, pname, manufacturer, mfg, exp, price, quantity], (err, results) => {
        if (err) {
            console.error('Error adding product:', err);
            res.status(500).json({ error: 'Failed to add product' });
        } else {
            console.log('Product added successfully');
            res.status(200).json({ message: 'Product added successfully' });
        }
    });
});

// Endpoint to fetch inventory
app.get('/inventory', (req, res) => {
    const query = 'SELECT * FROM product';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching inventory:', err);
            res.status(500).json({ error: 'Failed to fetch inventory' });
        } else {
            res.status(200).json(results);
        }
    });
});


// Endpoint to delete a product
app.delete('/product/:pid', (req, res) => {
    const pid = req.params.pid;
    const query = 'DELETE FROM product WHERE pid = ?';
    connection.query(query, [pid], (err, results) => {
        if (err) {
            console.error('Error deleting product:', err);
            res.status(500).json({ error: 'Failed to delete product' });
        } else {
            res.status(200).json({ message: 'Product deleted successfully' });
        }
    });
});

// Endpoint to update a product
app.put('/product/:pid', (req, res) => {
    const pid = req.params.pid;
    const { pname, manufacturer, mfg, exp, price, quantity } = req.body;
    const query = 'UPDATE product SET pname=?, manufacturer=?, mfg=?, exp=?, price=?, quantity=? WHERE pid=?';
    connection.query(query, [pname, manufacturer, mfg, exp, price, quantity, pid], (err, results) => {
        if (err) {
            console.error('Error updating product:', err);
            res.status(500).json({ error: 'Failed to update product' });
        } else {
            res.status(200).json({ message: 'Product updated successfully' });
        }
    });
});


// Start the server
const server = http.createServer(app);
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});

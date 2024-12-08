const express = require('express');
const app = express();
const PORT = 5000;
const cors = require("cors");
const fs = require('fs');

app.use(cors()); // Allow cross-origin requests
app.use(express.json());

// Mock user database
const usersDbPath = '../database/users.json';
const carts = {}; // In-memory session-based cart storage

// Helper function to load users from file
const loadUsers = () => {
    try {
        const data = fs.readFileSync(usersDbPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return []; // Return an empty array if users.json does not exist
    }
};

// Login endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Read users data
    const users = loadUsers();

    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
        return res.status(200).json({ message: 'Login successful', user });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
});

// Registration endpoint
app.post('/register', (req, res) => {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    // Load existing users
    const users = loadUsers();

    // Check if user already exists
    const exists = users.some((u) => u.email === email);
    if (exists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Add new user
    users.push({ email, password });

    // Save the updated users list to file
    try {
        fs.writeFileSync(usersDbPath, JSON.stringify(users));
        return res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Error saving user data:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


// Fetch Cart for User
app.get('/cart', (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ message: 'Email is required to fetch cart' });
    }

    const userCart = carts[email] || [];
    return res.status(200).json(userCart);
});

// Update Cart for User
app.post('/cart', (req, res) => {
    const { email, cart } = req.body;

    if (!email || !cart) {
        return res.status(400).json({ message: 'Email and cart data are required' });
    }

    // Store cart for the user
    carts[email] = cart;

    return res.status(200).json({ message: 'Cart updated successfully' });
});

// Server listening on port 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'supersecret';

// In-memory mock database
let users = [
    { username: 'admin', password: 'password', role: 'admin' },
    { username: 'user1', password: 'password', role: 'user' }
];

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        const token = jwt.sign({ username: user.username, role: user.role }, SECRET, { expiresIn: '1h' });
        return res.json({ token, role: user.role });
    }
    
    return res.status(401).json({ error: 'Invalid credentials' });
});

router.post('/register', (req, res) => {
    const { username, password, isAdmin } = req.body;
    
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ error: 'Username already exists' });
    }
    
    // In a real app, anyone creating an admin might require an admin token first
    // For demo purposes, we will allow creating an admin directly via a checkbox
    const role = isAdmin ? 'admin' : 'user';
    
    const newUser = { username, password, role };
    users.push(newUser);
    
    const token = jwt.sign({ username: newUser.username, role: newUser.role }, SECRET, { expiresIn: '1h' });
    return res.status(201).json({ token, role: newUser.role });
});

// Admin only routes
const requireAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    
    try {
        const decoded = jwt.verify(token, SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: Admins only' });
        }
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

router.get('/users', requireAdmin, (req, res) => {
    res.json(users.map(u => ({ username: u.username, role: u.role })));
});

router.delete('/users/:username', requireAdmin, (req, res) => {
    if (req.params.username === 'admin') {
        return res.status(400).json({ error: 'Cannot delete the master admin account' });
    }
    
    const initialLength = users.length;
    users = users.filter(u => u.username !== req.params.username);
    
    if (users.length < initialLength) {
        return res.json({ message: 'User deleted successfully' });
    }
    return res.status(404).json({ error: 'User not found' });
});

module.exports = router;

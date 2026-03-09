import express from 'express';
import cors from 'cors';

const router = express.Router();

// Mock database
const users = [
  { id: '1', username: 'admin', password: 'password', role: 'admin' }
];

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // New users are ALWAYS regular users
    const newUser = {
      id: Date.now().toString(),
      username,
      password, // In production, hash this
      role: 'user'
    };

    users.push(newUser);

    // Mock token creation
    const token = Buffer.from(JSON.stringify({ id: newUser.id, username: newUser.username, role: newUser.role })).toString('base64');
    
    res.status(201).json({ token, user: { id: newUser.id, username, role: newUser.role } });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = Buffer.from(JSON.stringify({ id: user.id, username: user.username, role: user.role })).toString('base64');
    
    res.json({ token, user: { id: user.id, username, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Admin strictly gets all users
router.get('/users', (req, res) => {
    // Vercel serverless lacks full middleware easily across files; 
    // verify inline or rely on headers passed from a vercel.json gateway
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
    
    try {
        const token = authHeader.split(' ')[1];
        const decoded = JSON.parse(Buffer.from(token, 'base64').toString('ascii'));
        if (decoded.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
        
        const safeUsers = users.map(({password, ...u}) => u);
        res.json(safeUsers);
    } catch(e) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

// Admin strictly deletes user
router.delete('/users/:username', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
    
    try {
        const token = authHeader.split(' ')[1];
        const decoded = JSON.parse(Buffer.from(token, 'base64').toString('ascii'));
        if (decoded.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
        
        const username = req.params.username;
        if (username === 'admin') return res.status(400).json({ error: 'Cannot delete admin' });

        const initialLength = users.length;
        const newUsers = users.filter(u => u.username !== username);
        if (newUsers.length === initialLength) {
             return res.status(404).json({ error: 'User not found' });
        }
        
        // Truncate and replace mock database
        users.length = 0;
        users.push(...newUsers);

        res.json({ message: 'User deleted' });
    } catch(e) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

const app = express();
app.use(cors());
app.use(express.json());
// Mount to /api/auth namespace
app.use('/api/auth', router);

export default app;

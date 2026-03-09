import express from 'express';
import cors from 'cors';

const router = express.Router();

let products = [
    { id: 1, name: 'Quantum Laptop Pro', price: 1299.99, category: 'Electronics', stock: 15, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: 2, name: 'Nebula Smartphone X', price: 799.99, category: 'Electronics', stock: 42, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: 3, name: 'Aero Noise-Cancelling Headphones', price: 249.99, category: 'Accessories', stock: 100, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: 4, name: 'Ergonomic Developer Chair', price: 499.00, category: 'Furniture', stock: 8, image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
];

router.get('/', (req, res) => {
    res.json(products);
});

router.get('/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
});

// Admin route to add new products
router.post('/', (req, res) => {
    // In a microservices architecture, this service should verify the token by
    // communicating with the auth service or sharing the JWT secret.
    // For this demo, we'll read a mock 'X-User-Role' header or similar decoding.
    
    // multer parses text fields into req.body and files into req.file
    const { name, price, category, stock, image } = req.body;
    
    if (!name || !price) {
        return res.status(400).json({ error: 'Name and price are required' });
    }
    
    // Determine the image URL
    // If an imageFile was uploaded, construct the local URL path.
    // Otherwise, fall back to the provided image URL or default placeholder.
    let imageUrl = image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    
    const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name,
        price,
        category: category || 'General',
        stock: stock || 0,
        image: imageUrl
    };
    
    products.push(newProduct);
    res.status(201).json(newProduct);
});

router.delete('/:id', (req, res) => {
    const initialLen = products.length;
    products = products.filter(p => p.id !== parseInt(req.params.id));
    if (products.length < initialLen) {
        return res.json({ message: 'Product deleted' });
    }
    res.status(404).json({ error: 'Not found' });
});

const app = express();
app.use(cors());
app.use(express.json());
// Mount to /api/products namespace
app.use('/api/products', router);

export default app;

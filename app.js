const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for development
}));

app.use(cors({
    origin: false, // Allow all origins since we're serving from same domain
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from current directory
app.use(express.static('.', {
    extensions: ['html', 'htm'],
    index: ['index.html']
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// In-memory storage (for demo purposes)
const carts = new Map();
const orders = new Map();
const products = new Map();

// Initialize products
const initializeProducts = () => {
    const productData = [
        {
            id: 'oily-skin-solution',
            name: 'Oily Skin Solution',
            price: 599,
            spf: 'SPF 50+ PA+++',
            category: 'oily',
            description: 'Oil-free formula with mattifying effect for shine-free protection',
            image: '/images/oily-skin.jpg',
            stock: 100
        },
        {
            id: 'dry-skin-comfort',
            name: 'Dry Skin Comfort',
            price: 599,
            spf: 'SPF 50+ PA+++',
            category: 'dry',
            description: 'Hydrating formula with hyaluronic acid for moisturized protection',
            image: '/images/dry-skin.jpg',
            stock: 100
        },
        {
            id: 'combination-skin-balance',
            name: 'Combination Skin Balance',
            price: 599,
            spf: 'SPF 50+ PA+++',
            category: 'combination',
            description: 'Perfect balance of hydration and oil control',
            image: '/images/combination-skin.jpg',
            stock: 100
        },
        {
            id: 'acne-prone-shield',
            name: 'Acne-Prone Skin Shield',
            price: 649,
            spf: 'SPF 50+ PA+++',
            category: 'acne',
            description: 'Salicylic acid formula that protects while preventing breakouts',
            image: '/images/acne-prone.jpg',
            stock: 100
        },
        {
            id: 'tinted-oily-skin',
            name: 'Tinted Oily Skin Solution',
            price: 699,
            spf: 'SPF 50+ PA+++',
            category: 'oily',
            description: 'Light coverage with oil control for a natural, protected look',
            image: '/images/tinted-oily.jpg',
            stock: 100
        },
        {
            id: 'luxury-dry-skin',
            name: 'Luxury Dry Skin Formula',
            price: 899,
            spf: 'SPF 50+ PA++++',
            category: 'dry',
            description: 'Premium formula with peptides and botanical extracts',
            image: '/images/luxury-dry.jpg',
            stock: 100
        }
    ];

    productData.forEach(product => {
        products.set(product.id, product);
    });
};

initializeProducts();

// Helper functions
const getOrCreateCart = (sessionId) => {
    if (!carts.has(sessionId)) {
        carts.set(sessionId, {
            id: sessionId,
            items: [],
            total: 0,
            createdAt: new Date()
        });
    }
    return carts.get(sessionId);
};

const calculateCartTotal = (cart) => {
    let total = 0;
    cart.items.forEach(item => {
        const product = products.get(item.productId);
        if (product) {
            total += product.price * item.quantity;
        }
    });
    cart.total = total;
    return total;
};

// API Routes

// Get all products
app.get('/api/products', (req, res) => {
    try {
        const productList = Array.from(products.values());
        res.json({
            success: true,
            data: productList
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching products'
        });
    }
});

// Get single product
app.get('/api/products/:id', (req, res) => {
    try {
        const product = products.get(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching product'
        });
    }
});

// Get cart
app.get('/api/cart', (req, res) => {
    try {
        const sessionId = req.headers['x-session-id'] || uuidv4();
        const cart = getOrCreateCart(sessionId);
        calculateCartTotal(cart);
        
        res.json({
            success: true,
            data: cart,
            sessionId: sessionId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching cart'
        });
    }
});

// Add item to cart
app.post('/api/cart/add', (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const sessionId = req.headers['x-session-id'] || uuidv4();
        
        const product = products.get(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock'
            });
        }

        const cart = getOrCreateCart(sessionId);
        
        // Check if item already exists in cart
        const existingItem = cart.items.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                productId,
                quantity,
                addedAt: new Date()
            });
        }

        calculateCartTotal(cart);

        res.json({
            success: true,
            data: cart,
            message: 'Item added to cart successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding item to cart'
        });
    }

// Create order
app.post('/api/orders', (req, res) => {
    try {
        const { customerInfo, paymentMethod = 'cod' } = req.body;
        const sessionId = req.headers['x-session-id'];
        
        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: 'Session ID required'
            });
        }

        const cart = carts.get(sessionId);
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        // Validate customer information
        const requiredFields = ['name', 'email', 'phone', 'address'];
        const missingFields = requiredFields.filter(field => !customerInfo[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Create order
        const orderId = uuidv4();
        const order = {
            id: orderId,
            customerInfo,
            items: cart.items.map(item => {
                const product = products.get(item.productId);
                return {
                    productId: item.productId,
                    name: product.name,
                    price: product.price,
                    quantity: item.quantity,
                    subtotal: product.price * item.quantity
                };
            }),
            total: cart.total,
            paymentMethod,
            status: 'pending',
            createdAt: new Date(),
            sessionId
        };

        orders.set(orderId, order);

        // Clear cart after order creation
        cart.items = [];
        cart.total = 0;

        res.json({
            success: true,
            data: order,
            message: 'Order created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating order'
        });
    }
});

// Get order by ID
app.get('/api/orders/:orderId', (req, res) => {
    try {
        const order = orders.get(req.params.orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching order'
        });
    }
});

// Payment processing (mock implementation)
app.post('/api/payment/process', (req, res) => {
    try {
        const { orderId, paymentDetails } = req.body;
        
        // Process payment (mock implementation)
        const paymentSuccess = Math.random() > 0.1; // 90% success rate for demo
        
        if (paymentSuccess) {
            // Update order status
            const orderIndex = orders.findIndex(o => o.id === orderId);
            if (orderIndex !== -1) {
                orders[orderIndex].status = 'processing';
                orders[orderIndex].paymentId = `PAY_${Date.now()}`;
            }
            
            res.json({
                success: true,
                message: 'Payment processed successfully',
                orderId: orderId,
                paymentId: orders[orderIndex]?.paymentId
            });
        } else {
            res.json({
                success: false,
                message: 'Payment failed. Please try again.'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Payment processing failed',
            error: error.message
        });
    }
});

// Frontend routes - serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, 'products.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/why-choose-us', (req, res) => {
    res.sendFile(path.join(__dirname, 'why-choose-us.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API route not found'
    });
});

// 404 handler for frontend routes
app.use('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`\n=====================================`);
    console.log(`   Solara Skincare Website`);
    console.log(`=====================================\n`);
    console.log(`Server running on: http://localhost:${PORT}`);
    console.log(`Frontend: http://localhost:${PORT}`);
    console.log(`API: http://localhost:${PORT}/api`);
    console.log(`\nAvailable pages:`);
    console.log(`  Home: http://localhost:${PORT}/`);
    console.log(`  Products: http://localhost:${PORT}/products`);
    console.log(`  Cart: http://localhost:${PORT}/cart`);
    console.log(`  About: http://localhost:${PORT}/about`);
    console.log(`  Why Choose Us: http://localhost:${PORT}/why-choose-us`);
    console.log(`  Contact: http://localhost:${PORT}/contact`);
    console.log(`\nAPI Endpoints:`);
    console.log(`  GET /api/health - Health check`);
    console.log(`  GET /api/products - Get all products`);
    console.log(`  GET /api/cart - Get cart`);
    console.log(`  POST /api/cart/add - Add to cart`);
    console.log(`  POST /api/orders - Create order`);
    console.log(`\n=====================================\n`);
});

module.exports = app;

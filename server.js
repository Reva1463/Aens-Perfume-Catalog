const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aens_perfume', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Product Schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['masculine', 'feminine', 'unisex'],
        default: 'unisex'
    },
    stock: {
        type: Number,
        default: 0,
        min: 0
    },
    fragrance_notes: {
        top: [String],
        middle: [String],
        base: [String]
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
    customer: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        address: {
            street: String,
            city: String,
            province: String,
            postal_code: String
        }
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        }
    }],
    total_amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    payment_method: {
        type: String,
        enum: ['transfer', 'cod', 'ewallet'],
        required: true
    },
    payment_status: {
        type: String,
        enum: ['unpaid', 'paid', 'refunded'],
        default: 'unpaid'
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

// File Upload Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

// ============== PRODUCT ROUTES ==============

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const { category, featured, search, sort, limit = 10, page = 1 } = req.query;
        
        let query = {};
        
        if (category) query.category = category;
        if (featured) query.featured = featured === 'true';
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        
        let sortOption = {};
        if (sort === 'price_asc') sortOption.price = 1;
        else if (sort === 'price_desc') sortOption.price = -1;
        else if (sort === 'newest') sortOption.createdAt = -1;
        else sortOption.createdAt = -1;
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const products = await Product.find(query)
            .sort(sortOption)
            .limit(parseInt(limit))
            .skip(skip);
        
        const total = await Product.countDocuments(query);
        
        res.json({
            success: true,
            data: products,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create product
app.post('/api/products', upload.single('image'), async (req, res) => {
    try {
        const productData = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            image: req.file ? `/uploads/${req.file.filename}` : req.body.image,
            category: req.body.category,
            stock: req.body.stock,
            featured: req.body.featured === 'true'
        };
        
        if (req.body.fragrance_notes) {
            productData.fragrance_notes = JSON.parse(req.body.fragrance_notes);
        }
        
        const product = new Product(productData);
        await product.save();
        
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Update product
app.put('/api/products/:id', upload.single('image'), async (req, res) => {
    try {
        const updateData = { ...req.body };
        
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }
        
        if (req.body.fragrance_notes) {
            updateData.fragrance_notes = JSON.parse(req.body.fragrance_notes);
        }
        
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============== ORDER ROUTES ==============

// Get all orders
app.get('/api/orders', async (req, res) => {
    try {
        const { status, payment_status, limit = 10, page = 1 } = req.query;
        
        let query = {};
        if (status) query.status = status;
        if (payment_status) query.payment_status = payment_status;
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const orders = await Order.find(query)
            .populate('items.product')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip);
        
        const total = await Order.countDocuments(query);
        
        res.json({
            success: true,
            data: orders,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get single order
app.get('/api/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.product');
        
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create order
app.post('/api/orders', async (req, res) => {
    try {
        const { customer, items, payment_method } = req.body;
        
        // Calculate total
        let total_amount = 0;
        const orderItems = [];
        
        for (const item of items) {
            const product = await Product.findById(item.product);
            
            if (!product) {
                return res.status(404).json({ 
                    success: false, 
                    message: `Product ${item.product} not found` 
                });
            }
            
            if (product.stock < item.quantity) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Insufficient stock for ${product.name}` 
                });
            }
            
            const itemTotal = product.price * item.quantity;
            total_amount += itemTotal;
            
            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });
            
            // Update stock
            product.stock -= item.quantity;
            await product.save();
        }
        
        const order = new Order({
            customer,
            items: orderItems,
            total_amount,
            payment_method
        });
        
        await order.save();
        await order.populate('items.product');
        
        res.status(201).json({ success: true, data: order });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Update order status
app.patch('/api/orders/:id/status', async (req, res) => {
    try {
        const { status, payment_status } = req.body;
        
        const updateData = {};
        if (status) updateData.status = status;
        if (payment_status) updateData.payment_status = payment_status;
        
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('items.product');
        
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// ============== STATISTICS ROUTES ==============

app.get('/api/stats', async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        
        const revenue = await Order.aggregate([
            { $match: { payment_status: 'paid' } },
            { $group: { _id: null, total: { $sum: '$total_amount' } } }
        ]);
        
        res.json({
            success: true,
            data: {
                totalProducts,
                totalOrders,
                pendingOrders,
                totalRevenue: revenue[0]?.total || 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'AENS Perfume API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌸 AENS Perfume Backend API Ready`);
});
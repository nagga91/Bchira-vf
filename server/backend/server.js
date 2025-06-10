const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path=require('path')
const session = require('express-session');
const MongoStore = require('connect-mongo');
// Load environment variables
dotenv.config();

// Import routes
const userRoutes = require('./routers/user');
const productRoutes = require('./routers/product');
const orderRoutes = require('./routers/order');
const cartRoutes = require('./routers/cart'); 

// Initialize express app
const app = express();
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Store your secret in .env
    resave: false, // Prevents session being saved back to the store if not modified
    saveUninitialized: false, // Don't save empty sessions
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }), // Storing session in MongoDB
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Secure cookie for HTTPS in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
    },
  })
);
// Middleware
app.use(cors());
// Serve uploaded images statically
const uploadsPath = path.join(__dirname, '..', 'uploads');
app.use('/uploads', express.static(uploadsPath));

app.use(express.json()); // To parse JSON bodies
app.use(cookieParser()); // Use cookie parser to parse cookies
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.log('MongoDB connection error:', err));
   
// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
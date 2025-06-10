// routers/cart.js

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart');

// Routes for cart management
router.post('/add', cartController.addToCart);
router.get('/', cartController.getCart);
router.post('/remove', cartController.removeFromCart);
router.post('/clear', cartController.clearCart);

module.exports = router;
const express = require('express');
const OrderController = require('../controllers/order');
const isAdmin = require('../middleware/isAdmin'); // Assuming only admins can update or delete orders

const orderRouter = express.Router();

// Get all orders (Admin-only)
orderRouter.get('/', isAdmin, OrderController.getAllOrders);

// Create a new order (Accessible to users)
orderRouter.post('/createOrder', OrderController.createOrder);

// Update an order (Admin-only)
orderRouter.put('/updateOrder/:id', isAdmin, OrderController.updateOrder);

// Delete an order (Admin-only)
orderRouter.delete('/deleteOrder/:id', isAdmin, OrderController.deleteOrder);

module.exports = orderRouter;
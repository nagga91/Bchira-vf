const express = require('express');
const ProductController = require('../controllers/product');
const isAdmin = require('../middleware/isAdmin');
const upload = require('../middleware/upload')
const prodrouter = express.Router();

// Public routes to get products
prodrouter.get('/', ProductController.getAllProducts); // Get all products
prodrouter.get('/product/:id', ProductController.getProductById); // Get product by ID
prodrouter.get('/latest',ProductController.getLatestProductsByCategory)

prodrouter.post('/addProduct', isAdmin,upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'colorImages', maxCount: 10 }
  ]), ProductController.addProduct);
prodrouter.put('/editProduct/:id', isAdmin,upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'colorImages', maxCount: 10 }
  ]), ProductController.editProduct);
prodrouter.delete('/deleteProduct/:id', isAdmin, ProductController.deleteProduct);

module.exports = prodrouter;
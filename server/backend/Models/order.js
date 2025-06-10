const mongoose = require('mongoose');
const productSchema = require('./product').schema; // réutilise le schéma ci-dessus

// un item du panier
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  length: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
}, { _id: false });

// schéma de la commande complète
const orderSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String },
  address:   { type: String, required: true },
  phoneNumber: { type: String, required: true },
  city:        { type: String },
  email:       { type: String },
  zipCode:     { type: String },

  cart: {
    type: [cartItemSchema],
    required: true,
  },

  totalPrice: {
    type: Number,
    required: true,
  },

  orderDate: {
    type: Date,
    default: Date.now,
  },

  status: {
    type: String,
    enum: ['pending', 'received', 'canceled'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);

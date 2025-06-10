// models/CartItem.js

import mongoose from 'mongoose';
import Joi from 'joi';

// Define the cart item schema
export const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  reference: {
    type: String,
    required: true,
  },
  images: {
    type: [String],     // URLs of the rideau images
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  length: {
    type: Number,       // how many meters the user wants
    required: true,
  },
  price: {
    type: Number,       // €/m
    required: true,
  },
  amount: {
    type: Number,       // computed total: price * length
  },
}, { _id: false });

// Auto-calculate amount before saving
cartItemSchema.pre('save', function(next) {
  if (this.price != null && this.length != null) {
    this.amount = this.price * this.length;
  }
  next();
});

// Create the model
const CartItem = mongoose.model('CartItem', cartItemSchema);

// Joi validation for incoming data
export const validateCartItem = (data, { update } = {}) => {
  const schema = Joi.object({
    product: update
      ? Joi.string().length(24)
      : Joi.string().length(24).required(),
    reference: update
      ? Joi.string()
      : Joi.string().required(),
    images: update
      ? Joi.array().items(Joi.string())
      : Joi.array().items(Joi.string()).min(1).required(),
    color: update
      ? Joi.string().min(3)
      : Joi.string().min(3).required(),
    length: update
      ? Joi.number().positive()
      : Joi.number().positive().required(),
    price: update
      ? Joi.number()
      : Joi.number().required(),
    amount: Joi.number(),  // optional, computed server-side
  });

  return schema.validate(data, { abortEarly: false });
};

export default CartItem;

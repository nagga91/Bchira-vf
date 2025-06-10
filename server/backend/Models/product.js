const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  reference: { type: String, required: true },
  description: { type: String, required: true },

  // price per meter
  price: { 
    type: Number, 
    required: true 
  },

  // largeur fixe du rideau/fabric (en cm)
  largeur: { 
    type: Number, 
    required: true 
  },

  category: {
    type: String,
    enum: ['Coton', 'Lin', 'Soie', 'Polyester', 'Velours', 'Mélange'],
    required: true,
  },
  sousCategory: { type: String, default: "" },
  inStock: { type: Boolean, default: true },

  images: { type: [String], required: true },
  colors: {
    type: [{
      name: String,
      image: String,
    }],
    required: true,
  },

  promo: { type: Number, default: 0 },  // % de réduction
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);

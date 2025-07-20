import React, { useState } from 'react';

const products = [
  { id: 1, name: "Velvet Blackout Curtains", price: 129.99, category: "Blackout" },
  { id: 2, name: "Sheer Linen Curtains", price: 89.99, category: "Linen" },
  { id: 3, name: "Geometric Pattern Curtains", price: 149.99, category: "Pattern" },
  { id: 4, name: "Cotton Blend Curtains", price: 99.99, category: "Blend" },
  { id: 5, name: "Silk Elegance Curtains", price: 179.99, category: "Silk" },
  { id: 6, name: "Classic Drapery", price: 139.99, category: "Traditional" },
  { id: 7, name: "Modern Minimalist Curtains", price: 159.99, category: "Modern" },
  { id: 8, name: "Vintage Floral Curtains", price: 119.99, category: "Vintage" }
];

const uniqueCategories = ["All", ...new Set(products.map(product => product.category))];

function Shop() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="shop-page">
      <h1 className="shop-title">Notre Collection</h1>
      <div className="filters">
        <input
          type="text"
          placeholder="Rechercher des produits..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-input"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="filter-select"
        >
          {uniqueCategories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div className="products-grid shop-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <svg className="product-image" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id={`shop-gradient-${product.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fff" />
                  <stop offset="100%" stopColor="#ccc" />
                </linearGradient>
              </defs>
              <rect width="400" height="300" fill={`url(#shop-gradient-${product.id})`} />
              <text
                x="200"
                y="150"
                fill="#666"
                fontSize="20"
                fontFamily="sans-serif"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {product.name}
              </text>
            </svg>
            <div className="product-info">
              <h3 className="product-title">{product.name}</h3>
              <p className="product-price">${product.price.toFixed(2)}</p>
              <p className="product-category">{product.category}</p>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <p style={{ textAlign: 'center', width: '100%' }}>Aucun produit trouvé.</p>
        )}
      </div>
    </div>
  );
}

export default Shop;
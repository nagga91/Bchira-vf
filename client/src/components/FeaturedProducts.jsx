import React from 'react';

const products = [
  {
    id: 1,
    name: "Rideaux occultants en velours",
    price: "$129.99"
  },
  {
    id: 2,
    name: "Rideaux en lin transparent",
    price: "$89.99"
  },
  {
    id: 3,
    name: "Rideaux à motifs géométriques",
    price: "$149.99"
  },
  {
    id: 4,
    name: "Rideaux en mélange de coton",
    price: "$99.99"
  }
];

function FeaturedProducts() {
  return (
    <section className="featured">
      <h2 className="section-title">Produits phares</h2>
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <svg className="product-image" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id={`gradient-${product.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f5f7fa" />
                  <stop offset="100%" stopColor="#c3cfe2" />
                </linearGradient>
              </defs>
              <rect width="400" height="300" fill={`url(#gradient-${product.id})`} />
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
              <p className="product-price">{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;
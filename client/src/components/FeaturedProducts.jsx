import React from 'react';

// const products = [
//   {
//     id: 1,
//     name: "Rideaux occultants en velours",
//     price: "$129.99"
//   },
//   {
//     id: 2,
//     name: "Rideaux en lin transparent",
//     price: "$89.99"
//   },
//   {
//     id: 3,
//     name: "Rideaux à motifs géométriques",
//     price: "$149.99"
//   },
//   {
//     id: 4,
//     name: "Rideaux en mélange de coton",
//     price: "$99.99"
//   }
// ];

function FeaturedProducts({products}) {
  return (
    <section className="featured">
      <h2 className="section-title">Produits phares</h2>
      <div className="products-grid">
        {products?.slice(0,4).map(product => (
          <div key={product._id} className="product-card">
            <img className="product-image" src={product.images[0]} alt="" />
            {/* <svg className="product-image" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id={`gradient-${product._id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f5f7fa" />
                  <stop offset="100%" stopColor="#c3cfe2" />
                </linearGradient>
              </defs>
              <rect width="400" height="300" fill={`url(#gradient-${product._id})`} />
            
              <img src={product.images[0]} alt="" />
            </svg> */}
            <div className="product-info">
              <h3 className="product-title">{product.name}</h3>
              <p className="product-price">{product.price} TND</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;
import React from 'react';

const benefits = [
  {
    icon: "🚚",
    title: "Free Shipping",
    description: "Free shipping on all orders over $200"
  },
  {
    icon: "🔒",
    title: "Secure Payment",
    description: "100% secure payment processing"
  },
  {
    icon: "↩️",
    title: "Easy Returns",
    description: "30-day money-back guarantee"
  },
  {
    icon: "👨‍💼",
    title: "Expert Support",
    description: "Professional design consultation available"
  }
];

function Benefits() {
  return (
    <section className="benefits">
      <h2 className="section-title">Why Choose Us</h2>
      <div className="benefits-grid">
        {benefits.map((benefit, index) => (
          <div key={index} className="benefit-card">
            <div className="benefit-icon">{benefit.icon}</div>
            <h3 className="benefit-title">{benefit.title}</h3>
            <p className="benefit-description">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Benefits;
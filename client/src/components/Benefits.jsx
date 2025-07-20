import React from 'react';

const benefits = [
  {
    icon: "🚚",
    title: "Livraison gratuite",
    description: "Livraison offerte pour toute commande supérieure à 200$"
  },
  {
    icon: "🔒",
    title: "Paiement sécurisé",
    description: "Traitement de paiement 100% sécurisé"
  },
  {
    icon: "↩️",
    title: "Retours faciles",
    description: "Garantie satisfait ou remboursé sous 30 jours"
  },
  {
    icon: "👨‍💼",
    title: "Support expert",
    description: "Conseil professionnel en design disponible"
  }
];

function Benefits() {
  return (
    <section className="benefits">
      <h2 className="section-title">Pourquoi nous choisir</h2>
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
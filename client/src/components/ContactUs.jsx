import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const ContactUs = () => {
  const [form, setForm] = useState({ nom: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nom || !form.email || !form.message) {
      toast.error('Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/users/contact', {
        name: form.nom,
        email: form.email,
        message: form.message,
      });
      toast.success('Votre message a été envoyé avec succès !');
      setForm({ nom: '', email: '', message: '' });
    } catch (err) {
      toast.error("Erreur lors de l'envoi du message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section py-16">
      <div className="container mx-auto px-6 max-w-xl bg-white rounded-lg shadow-md pb-10">
        <h2 className="section-title mb-8">Contactez-nous</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">Nom</label>
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-accent"
              placeholder="Votre nom"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-accent"
              placeholder="Votre email"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-accent"
              placeholder="Votre message..."
              rows={5}
              required
            />
          </div>
          <button
            type="submit"
            className="cta-button w-full"
            disabled={loading}
          >
            {loading ? 'Envoi en cours...' : 'Envoyer'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactUs; 
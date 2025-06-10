import axios from "axios";
import React, { useState } from "react";
import { useLoaderData, useRevalidator } from "react-router-dom";
import { toast } from "react-toastify";

const Panier = () => {
  const cartItems = useLoaderData();
  console.log(cartItems)
  const { revalidate } = useRevalidator();

  // Formulaire Livraison
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    city: "",
    address: "",
    zipCode: "",
  });
  const [errors, setErrors] = useState({});
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Calcul du total depuis cartItems.amount
  const total = cartItems.reduce(
    (acc, item) => acc + (item.amount || 0),
    0
  );

  // Gestion changement formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Suppression d'un item (identifié par produit+couleur)
  const handleRemoveFromCart = async (productId, color) => {
    try {
      const res = await axios.post(
        "/api/cart/remove",
        { productId, color },
        { withCredentials: true }
      );
      if (res.status === 200) revalidate();
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  // Vider le panier
  const handleClearCart = async () => {
    try {
      await axios.post(
        "/api/cart/clear",
        {},
        { withCredentials: true }
      );
      revalidate();
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  // Soumission de la commande
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation
    const newErrors = {};
    ["firstName", "lastName", "phoneNumber", "city", "address"].forEach(
      (key) => {
        if (!formData[key]) newErrors[key] = "Ce champ est obligatoire";
      }
    );
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    try {
      const orderData = {
        ...formData,
        cart: cartItems,        
        totalPrice: total + 7,  
      };
      const resp = await axios.post(
        "/api/orders/createOrder",
        orderData
      );
      if (resp.status === 201) {
        setOrderSuccess(true);
        toast.success("Merci, votre commande sera traitée");
        setTimeout(handleClearCart, 2000);
      }
    } catch (err) {
      setErrorMessage("Erreur lors de la création de la commande.");
      console.error(err);
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container px-4 mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Panier</h1>
        <div className="flex flex-wrap -mx-4">
          {/* Liste des items */}
          <div className="w-full lg:w-2/3 px-4">
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="px-6 py-3">Produit</th>
                    <th className="px-6 py-3">Prix unitaire (TND/m)</th>
                    <th className="px-6 py-3">Longueur (m)</th>
                    <th className="px-6 py-3">Total (TND)</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={`${item.product._id}-${item.color}`} className="border-t">
                      <td className="px-6 py-4 flex items-center gap-4">
                        <img
                          src={`/${item.images[0]}`}
                          alt={item.product}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <p className="font-semibold">{item.product.name}</p>
                          <p>Ref: {item.reference}</p>
                          <p>Couleur: {item.color}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                      {item.price}
                        {/* {(item.price - (item.price * item.product.promo) / 100).toFixed(2)} */}
                      </td>
                      <td className="px-6 py-4">{item.length}</td>
                      <td className="px-6 py-4">{item.amount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleRemoveFromCart(item.product, item.color)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Résumé du panier */}
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">Résumé de commande</h2>
              <div className="flex justify-between mb-2">
                <span>Total</span><span>{total.toFixed(2)} TND</span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Livraison</span><span>7.00 TND</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>À payer</span><span>{(total + 7).toFixed(2)} TND</span>
              </div>
            </div>
          </div>

          {/* Formulaire livraison */}
          <div className="w-full lg:w-1/3 px-4">
            <h2 className="text-2xl font-semibold mb-4">Informations de livraison</h2>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
              {[
                { label: 'Prénom', name: 'firstName' },
                { label: 'Nom', name: 'lastName' },
                { label: 'Téléphone', name: 'phoneNumber' },
                { label: 'Ville', name: 'city' },
                { label: 'Adresse', name: 'address' },
              ].map(({ label, name }) => (
                <div key={name} className="mb-4">
                  <label className="block mb-1 font-medium">{label} <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                  {errors[name] && <p className="text-red-500 text-xs">{errors[name]}</p>}
                </div>
              ))}
              <div className="mb-4">
                <label className="block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="mb-6">
                <label className="block mb-1 font-medium">Code Postal</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <button type="submit" className="w-full bg-red-500 text-white py-3 rounded">
                Confirmer la commande
              </button>
              {orderSuccess && <p className="text-green-500 mt-4">Commande réussie!</p>}
              {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Panier;

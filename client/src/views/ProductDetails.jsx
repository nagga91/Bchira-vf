import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLoaderData, useNavigate, useRevalidator } from "react-router-dom";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const product = useLoaderData();
  const navigate = useNavigate();
  const {revalidate}=useRevalidator()

  // Longueur en mètres choisie par l'utilisateur
  const [length, setLength] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [image, setImage] = useState(product?.images[0]);

  // Données du formulaire de livraison
  const [formData, setFormData] = useState({
    firstName: "",
    phoneNumber: "",
    address: "",
  });

  // Erreurs de validation
  const [errors, setErrors] = useState({});
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Calcul du total pour la commande
  const total = (product.price - (product.price * product.promo) / 100) * length;

  // Réinitialisation lors du changement de produit
  useEffect(() => {
    setImage(product?.images[0]);
    setSelectedColor(null);
    setLength(1);
  }, [product]);

  // Chargement des produits liés
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const resp = await axios.get("/api/products/latest", {
          params: { category: product.category, sousCategory: product.sousCategory }
        });
        setRelatedProducts(resp.data);
      } catch (err) {
        console.error("Error fetching related products:", err);
      }
    };
    if (product.category && product.sousCategory) fetchRelated();
  }, [product]);

  // Gestion des changements de formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Ajout au panier
  const addToCart = async () => {
    if (length <= 0) {
      toast.error("Veuillez saisir une longueur valide...");
      return;
    }
    if (!selectedColor) {
      toast.error("Veuillez choisir une couleur...");
      return;
    }
    try {
      setIsAdding(true);
      const res = await axios.post(
        "/api/cart/add",
        { productId: product._id, length, color: selectedColor, price: product.price },
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success("Produit ajouté au panier");
        // navigate("/cart");
        revalidate()
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Erreur lors de l'ajout au panier");
    } finally {
      setIsAdding(false);
    }
  };

  // Création de la commande
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (length <= 0) {
      toast.error("Veuillez saisir une longueur valide...");
      return;
    }
    if (!selectedColor) {
      toast.error("Veuillez choisir une couleur...");
      return;
    }
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (!formData[key]) newErrors[key] = "Ce champ est obligatoire";
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        const orderData = {
          ...formData,
          cart: [{ product: product._id, color: selectedColor, length, price: total }],
          totalPrice: total + 7
        };
        const resp = await axios.post("/api/orders/createOrder", orderData);
        if (resp.status === 201) {
          setOrderSuccess(true);
          toast.success("Merci, votre commande sera traitée");
        }
      } catch (err) {
        setErrorMessage("Erreur lors de la création de la commande.");
        console.error(err);
      }
    }
  };

  return (
    <section className="pt-36 md:py-32 lg:py-36">
      <div className="container px-4 mx-auto">
        <div className="max-w-xl mx-auto lg:max-w-6xl">
          <div className="flex flex-wrap -mx-4">
            {/* Gauche: Aperçu des images */}
            <div className="w-full lg:w-1/2 px-4 mb-12 lg:mb-0">
              <div className="flex flex-col-reverse -mx-3">
                <div className="w-96 md:w-full px-3">
                  <div className="flex max-md:flex-row gap-4 justify-center items-center my-1 w-full">
                    {[...product.images, ...product.colors.map(c => c.image)].map(src => (
                      <button key={src} onClick={() => setImage(src)} className="block opacity-50 hover:opacity-100 mb-3 sm:mb-6">
                        <img src={`/${src}`} alt="apercu" className="block rounded-xl w-full h-14 sm:h-20 md:h-28" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="w-auto px-3">
                  <img src={`/${image || product.images[0]}`} alt="principal" className="block h-full rounded-xl object-fill w-full" />
                </div>
              </div>
            </div>

            {/* Droite: Détails produit */}
            <div className="w-full lg:w-1/2 px-4">
              <div className="max-w-lg lg:ml-auto">
                <div className="inline-block mb-4 bg-orange-500 rounded-full px-4 py-1 uppercase text-white text-xs font-bold tracking-widest">En stock</div>
                <h1 className="mb-4 text-4xl text-gray-800 font-semibold">{product.name}</h1>
                <h2 className="text-4xl text-gray-800 font-semibold mb-6">{(product.price - (product.price * product.promo)/100).toFixed(2)} TND</h2>
                <p className="mb-6 text-gray-500">{product.description}</p>

                {/* Sélection couleur */}
                <div className="mb-8">
                  <p className="uppercase text-xs font-bold text-gray-600 mb-3">Couleur</p>
                  <div className="flex gap-3">
                    {product.colors.map((col, idx) => (
                      <button key={idx} onClick={() => { setSelectedColor(col.name); setImage(col.image); }} className={`w-10 h-10 rounded-full border-4 overflow-hidden transition duration-200 ${selectedColor === col.name ? "border-green-500" : "border-gray-300 hover:border-gray-500"}`}>
                        <img src={`/${col.image}`} alt={col.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Choix de la longueur */}
                <div className="mb-8">
                  <p className="uppercase text-xs font-bold text-gray-600 mb-3">Longueur (m)</p>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={length}
                    onChange={e => setLength(parseFloat(e.target.value) || 0)}
                    className="p-2 border rounded w-24"
                  />
                </div>

                {/* Formulaire et totaux */}
                {/* <div className="bg-white w-full rounded-xl shadow-md p-6 mb-6">
                  <h6 className="mb-2 text-xl text-center">Informations de livraison</h6>
                  <form className="flex flex-wrap -m-2.5 mb-7" onSubmit={handleSubmit}>
                    <div className="w-full p-2.5">
                   
                      <div className="w-full mb-2">
                        <label className="inline-block text-sm font-semibold mb-1.5">Nom et Prénom<span className="text-red-500">*</span></label>
                        <input name="firstName" type="text" className="py-3 px-4 w-full border rounded-md" placeholder="Entrez votre nom" value={formData.firstName} onChange={handleChange} />
                        {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
                      </div>
                     
                      <div className="w-full mb-2">
                        <label className="inline-block text-sm font-semibold mb-1.5">Numéro de téléphone<span className="text-red-500">*</span></label>
                        <input name="phoneNumber" type="text" className="py-3 px-4 w-full border rounded-md" placeholder="Entrez votre numéro" value={formData.phoneNumber} onChange={handleChange} />
                        {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber}</p>}
                      </div>
                     
                      <div className="w-full">
                        <label className="inline-block text-sm font-semibold mb-1.5">Adresse<span className="text-red-500">*</span></label>
                        <input name="address" type="text" className="py-3 px-4 w-full border rounded-md" placeholder="Entrez votre adresse" value={formData.address} onChange={handleChange} />
                        {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
                      </div>
                    </div>
                    <div className="w-full p-2.5">
                      <div className="border-b border-gray-200 flex justify-between pb-4 mb-4">
                        <span>Total</span><span>{total.toFixed(2)} TND</span>
                      </div>
                      <div className="border-b border-gray-200 flex justify-between pb-4 mb-4">
                        <span>Livraison</span><span>7.00 TND</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Coût total</span><span>{(total + 7).toFixed(2)} TND</span>
                      </div>
                    </div>
                    <button type="submit" className="w-full py-3 bg-red-500 text-white rounded-md">Acheter maintenant</button>
                    {orderSuccess && <p className="text-green-500 mt-4">Commande réussie!</p>}
                    {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
                  </form>
                </div> */}

                {/* Bouton Panier */}
                <div className="flex gap-2 mb-10">
                  <button disabled={isAdding} onClick={addToCart} className="flex-1 py-3 bg-black text-white rounded-full text-center">{isAdding ? "Ajout..." : "Ajouter au Panier"}</button>
                </div>
              </div>
            </div>
          </div>

          {/* Section produits liés */}
          {relatedProducts.length > 0 && (
            <div className="mt-10">
              <h3 className="text-2xl font-bold text-center mb-6">Produits similaires</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map(item => (
                  <div key={item._id} className="p-4 bg-white border rounded-lg shadow hover:shadow-lg">
                    <div className="h-40 flex items-center justify-center overflow-hidden">
                      <img src={`/${item.images[0]}`} alt={item.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <h4 className="mt-4 font-semibold">{item.name}</h4>
                    <p className="mt-2 text-gray-500">{(item.price - (item.price * item.promo)/100).toFixed(2)} TND</p>
                    <Link to={`/product/${item._id}`} className="mt-3 inline-block text-blue-500 underline text-sm">Voir détails</Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;

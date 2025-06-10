// controllers/cart.js
const Product = require("../Models/product");

exports.addToCart = async (req, res) => {
  try {
    const { productId, length, color } = req.body;

    // Vérification des champs obligatoires
    if (!productId || length == null || !color) {
      return res.status(400).json({ message: "Champs manquants" });
    }

    // Récupérer le produit en base
    const foundProduct = await Product.findById(productId);
    if (!foundProduct) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    // Prix unitaire (€ / m)
    const unitPrice = foundProduct.price;
    const amount = unitPrice * length;  

    // Initialiser le panier en session si inexistant
    req.session.cart = req.session.cart || [];

    // Rechercher un item identique (même produit + même couleur)
    const existingIndex = req.session.cart.findIndex(item =>
      item.product.toString() === productId &&
      item.color === color
    );

    if (existingIndex > -1) {
      // On ajoute la longueur
      req.session.cart[existingIndex].length += length;
      // Recalcul du montant
      req.session.cart[existingIndex].amount =
        req.session.cart[existingIndex].price *
        req.session.cart[existingIndex].length;
    } else {
      // Nouveau item
      req.session.cart.push({
        product: productId,
        reference: foundProduct.reference,
        images: foundProduct.images,
        color,
        price: unitPrice,
        length,
        amount
      });
    }

    return res
      .status(200)
      .json({ message: "Produit ajouté au panier", cart: req.session.cart });

  } catch (error) {
    console.error("Error adding to cart:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de l'ajout au panier", error: error.message });
  }
};

exports.getCart = (req, res) => {
  try {
    const cart = (req.session && req.session.cart) || [];
    return res.status(200).json({ cart });
  } catch (error) {
    console.error("Error retrieving cart:", error);
    return res.status(500).json({ message: "Erreur interne" });
  }
};

exports.removeFromCart = (req, res) => {
  const { productId, color } = req.body;
  if (!req.session.cart) req.session.cart = [];

  // On enlève tous les items correspondant au produit+couleur
  req.session.cart = req.session.cart.filter(item =>
    !(item.product.toString() === productId && item.color === color)
  );

  return res
    .status(200)
    .json({ message: "Produit retiré du panier", cart: req.session.cart });
};

exports.clearCart = (req, res) => {
  req.session.cart = [];
  return res.status(200).json({ message: "Panier vidé", cart: [] });
};

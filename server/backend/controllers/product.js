// Controllers/product.js
const Product = require('../Models/product');

// Add product
exports.addProduct = async (req, res) => {
  try {
     // 1. Données texte
     const {
      name,
      reference,
      description,
      price,
      category,
      sousCategory = '',
      largeur,
      promo = 0,
      colors: colorsJson = '[]'       // ex. '[ "Rouge", "Bleu" ]'
    } = req.body
    console.log(req.body)
    // 2. Images principales
    const images = (req.files.images || []).map(file => file.path)

    // 3. Noms de couleurs
    const colorNames = JSON.parse(colorsJson)      // tableau de strings

    // 4. Fichiers d'échantillons de couleur
    const colorFiles = req.files.colorImages || []

    // 5. Constitution du tableau `colors`
    const colors = colorNames.map((name, i) => ({
      name,
      image: colorFiles[i] ? colorFiles[i].path : ''
    }))

    // 6. Création du document
    const newProduct = new Product({
      name,
      reference,
      description,
      price: Number(price),
      category,
      sousCategory,
      largeur: Number(largeur),
      promo: Number(promo),
      images,
      colors
    })
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error });
  }
};

// Edit product
exports.editProduct = async (req, res) => {
  try {
    const updates = { ...req.body }
    const { colors: colorsJson = '[]' } = req.body

    // Remplacement éventuel des images produit
    if (req.files.images) {
      updates.images = req.files.images.map(f => f.path)
    }

    // Remplacement éventuel des images de couleur
    if (req.files.colorImages) {
      const colorNames = JSON.parse(colorsJson)
      const colorFiles = req.files.colorImages
      updates.colors = colorNames.map((name, i) => ({
        name,
        image: colorFiles[i] ? colorFiles[i].path : ''
      }))
    }

    // Conversion des champs numériques
    if (updates.price != null)   updates.price = Number(updates.price)
    if (updates.largeur != null) updates.largeur = Number(updates.largeur)
    if (updates.promo != null)   updates.promo = Number(updates.promo)

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    )
    res.status(200).json({ message: 'Product updated', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products', error });
    }
  };
  
  // Get product by ID
  exports.getProductById = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching product', error });
    }
  };

  // Get the latest 4 products for a given category and sousCategory
exports.getLatestProductsByCategory = async (req, res) => {
  // You can either use route parameters or query parameters.
  // For this example, we assume they are passed as query parameters.
  const { category, sousCategory } = req.query;
  try {
    // Find products matching the criteria, sort by creation date descending, and limit to 4
    const products = await Product.find({
      category: category,
      sousCategory: sousCategory,
    })
      .sort({ createdAt: -1 })
      .limit(4);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

  
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddProduct = () => {
  const [loading, setLoading] = useState(false);

  // text fields
  const [reference, setReference] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [promo, setPromo] = useState(0);
  const [category, setCategory] = useState('');
  const [sousCategory, setSousCategory] = useState('');
  const [largeur, setLargeur] = useState('');

  // product images
  const [productImages, setProductImages] = useState([]);       // File[]
  const [productPreviews, setProductPreviews] = useState([]);   // string[]

  // colors: each { name, file, preview }
  const [colors, setColors] = useState([
    { name: '', file: null, preview: '' },
  ]);

  // --- Handlers ---

  // Product images selection & previews
  const handleProductImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProductImages(files);
    setProductPreviews(files.map(f => URL.createObjectURL(f)));
  };

  // Color name change
  const handleColorNameChange = (idx, value) => {
    setColors(cs => {
      const copy = [...cs];
      copy[idx].name = value;
      return copy;
    });
  };

  // Color image selection & preview
  const handleColorFileChange = (idx, file) => {
    setColors(cs => {
      const copy = [...cs];
      copy[idx].file = file;
      copy[idx].preview = URL.createObjectURL(file);
      return copy;
    });
  };

  // Add extra color slot
  const handleAddColor = () =>
    setColors(cs => [...cs, { name: '', file: null, preview: '' }]);

  // Remove a color slot
  const handleRemoveColor = (idx) =>
    setColors(cs => cs.filter((_, i) => i !== idx));

  // --- Submit to backend ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reference || !name || !price || !category || !largeur) {
      return toast.error("Merci de remplir tous les champs obligatoires");
    }

    const formData = new FormData();
    // text fields
    formData.append('reference', reference);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('promo', promo);
    formData.append('category', category);
    formData.append('sousCategory', sousCategory);
    formData.append('largeur', largeur);
    // colors names as JSON
    formData.append('colors', JSON.stringify(colors.map(c => c.name)));

    // product image files
    productImages.forEach(file => {
      formData.append('images', file);
    });

    // color image files
    colors.forEach(c => {
      if (c.file) {
        formData.append('colorImages', c.file);
      }
    });

    try {
      setLoading(true);
      await axios.post('/api/products/addProduct', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      toast.success('Produit ajouté avec succès');
      // reset form or redirect...
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de l\'ajout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-md shadow-md max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Ajouter un rideau</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Reference, Name, Description */}
        {/*** similar blocks for reference, name, description ***/}
        <div className="mb-4">
          <label className="block">Référence *</label>
          <input
            type="text"
            value={reference}
            onChange={e => setReference(e.target.value)}
            className="mt-1 w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block">Nom *</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="mt-1 w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="mt-1 w-full p-2 border rounded"
          />
        </div>

        {/* Price, Promo, Largeur */}
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label className="block">Prix €/m *</label>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              className="mt-1 w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block">Promo %</label>
            <input
              type="number"
              value={promo}
              onChange={e => setPromo(e.target.value)}
              className="mt-1 p-2 w-20 border rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block">Largeur (cm) *</label>
            <input
              type="number"
              value={largeur}
              onChange={e => setLargeur(e.target.value)}
              className="mt-1 w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        {/* Category & Sous-Category */}
        <div className="mb-4">
          <label className="block">Catégorie *</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="mt-1 w-full p-2 border rounded"
            required
          >
            <option value="" disabled>Choisir...</option>
            <option value="Coton">Coton</option>
            <option value="Lin">Lin</option>
            <option value="Soie">Soie</option>
            <option value="Polyester">Polyester</option>
            <option value="Velours">Velours</option>
            <option value="Mélange">Mélange</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block">Sous-catégorie</label>
          <input
            type="text"
            value={sousCategory}
            onChange={e => setSousCategory(e.target.value)}
            className="mt-1 w-full p-2 border rounded"
          />
        </div>

        {/* Colors */}
        <div className="mb-6">
          <label className="block mb-2">Couleurs</label>
          {colors.map((c, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Nom couleur"
                value={c.name}
                onChange={e => handleColorNameChange(i, e.target.value)}
                className="p-2 border rounded flex-1"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={e => handleColorFileChange(i, e.target.files[0])}
                className="p-2 border rounded"
                required
              />
              {c.preview && (
                <img
                  src={c.preview}
                  alt={`Aperçu ${c.name}`}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              {colors.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveColor(i)}
                  className="text-red-500"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddColor}
            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
          >
            Ajouter une couleur
          </button>
        </div>

        {/* Product Images */}
        <div className="mb-6">
          <label className="block mb-2">Photos du rideau</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleProductImageChange}
            className="p-2 border rounded"
            required
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {productPreviews.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Produit ${idx}`}
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          {loading ? 'Ajout en cours…' : 'Ajouter le rideau'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

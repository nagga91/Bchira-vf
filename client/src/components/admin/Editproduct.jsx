import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLoaderData } from 'react-router-dom';

const SERVER_URL = 'http://localhost:5000'; // ✅ Update this if deploying

const EditProduct = () => {
  const product = useLoaderData();
  const [loading, setLoading] = useState(false);

  const [reference, setReference] = useState(product.reference || '');
  const [name, setName] = useState(product.name || '');
  const [description, setDescription] = useState(product.description || '');
  const [price, setPrice] = useState(product.price || '');
  const [promo, setPromo] = useState(product.promo || 0);
  const [category, setCategory] = useState(product.category || '');
  const [sousCategory, setSousCategory] = useState(product.sousCategory || '');
  const [largeur, setLargeur] = useState(product.largeur || '');

  const [productImages, setProductImages] = useState([]);
  const [productPreviews, setProductPreviews] = useState(
    (product.images || []).map(img =>
      img.startsWith('http') ? img : `${SERVER_URL}/${img.replace(/\\/g, '/')}`
    )
  );

  const [colors, setColors] = useState(
    product.colors && product.colors.length
      ? product.colors.map(c => ({
          name: c.name,
          file: null,
          preview: c.image.startsWith('http') ? c.image : `${SERVER_URL}/${c.image.replace(/\\/g, '/')}`,
          image: c.image
        }))
      : [{ name: '', file: null, preview: '', image: '' }]
  );

  const handleProductImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProductImages(files);
    setProductPreviews(prev => [
      ...prev.filter(url => url.startsWith('http')),
      ...files.map(f => URL.createObjectURL(f))
    ]);
  };

  const handleRemoveProductPreview = (idx) => {
    setProductPreviews(previews => previews.filter((_, i) => i !== idx));
  };

  const handleColorNameChange = (idx, value) => {
    setColors(cs => {
      const copy = [...cs];
      copy[idx].name = value;
      return copy;
    });
  };

  const handleColorFileChange = (idx, file) => {
    setColors(cs => {
      const copy = [...cs];
      copy[idx].file = file;
      copy[idx].preview = URL.createObjectURL(file);
      return copy;
    });
  };

  const handleAddColor = () => {
    setColors(cs => [...cs, { name: '', file: null, preview: '', image: '' }]);
  };

  const handleRemoveColor = (idx) => {
    setColors(cs => cs.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reference || !name || !price || !category || !largeur) {
      return toast.error("Merci de remplir tous les champs obligatoires");
    }

    const hasMissingColorImage = colors.some(c => !c.image && !c.file);
    if (hasMissingColorImage) {
      toast.error("Chaque couleur doit avoir une image.");
      return;
    }

    const existingImages = productPreviews.filter(url => url.startsWith(SERVER_URL)).map(url =>
      url.replace(`${SERVER_URL}/`, '').replace(/\//g, '\\')
    );

    const formData = new FormData();
    formData.append('reference', reference);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('promo', promo);
    formData.append('category', category);
    formData.append('sousCategory', sousCategory);
    formData.append('largeur', largeur);
    formData.append('existingImages', JSON.stringify(existingImages));

    colors.forEach((c, i) => {
      formData.append(`colorNames[${i}]`, c.name);
      if (c.file) {
        formData.append('colorImages', c.file); // ✅ flat field name
      } else {
        formData.append(`existingColorImages[${i}]`, c.image);
      }
    });

    productImages.forEach(file => {
      formData.append('images', file);
    });

    try {
      setLoading(true);
      await axios.put(`/api/products/editProduct/${product._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      toast.success('Produit modifié avec succès');
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la modification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-md shadow-md max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Modifier un rideau</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Fields for reference, name, description, etc. */}
        <div className="mb-4">
          <label className="block">Référence *</label>
          <input type="text" value={reference} onChange={e => setReference(e.target.value)} className="mt-1 w-full p-2 border rounded" required />
        </div>
        <div className="mb-4">
          <label className="block">Nom *</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full p-2 border rounded" required />
        </div>
        <div className="mb-4">
          <label className="block">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="mt-1 w-full p-2 border rounded" />
        </div>

        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label className="block">Prix €/m *</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="mt-1 w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block">Promo %</label>
            <input type="number" value={promo} onChange={e => setPromo(e.target.value)} className="mt-1 p-2 w-20 border rounded" />
          </div>
          <div className="flex-1">
            <label className="block">Largeur (cm) *</label>
            <input type="number" value={largeur} onChange={e => setLargeur(e.target.value)} className="mt-1 w-full p-2 border rounded" required />
          </div>
        </div>

        <div className="mb-4">
          <label className="block">Catégorie *</label>
          <select value={category} onChange={e => setCategory(e.target.value)} className="mt-1 w-full p-2 border rounded" required>
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
          <input type="text" value={sousCategory} onChange={e => setSousCategory(e.target.value)} className="mt-1 w-full p-2 border rounded" />
        </div>

        {/* Colors */}
        <div className="mb-6">
          <label className="block mb-2">Couleurs</label>
          {colors.map((c, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <input type="text" placeholder="Nom couleur" value={c.name} onChange={e => handleColorNameChange(i, e.target.value)} className="p-2 border rounded flex-1" required />
              <input type="file" accept="image/*" onChange={e => handleColorFileChange(i, e.target.files[0])} className="p-2 border rounded" required={!c.image && !c.file} />
              {c.preview && <img src={c.preview} alt={`Aperçu ${c.name}`} className="w-12 h-12 object-cover rounded" />}
              {colors.length > 1 && <button type="button" onClick={() => handleRemoveColor(i)} className="text-red-500">×</button>}
            </div>
          ))}
          <button type="button" onClick={handleAddColor} className="mt-2 bg-blue-500 text-white px-3 py-1 rounded">Ajouter une couleur</button>
        </div>

        {/* Product Images */}
        <div className="mb-6">
          <label className="block mb-2">Photos du rideau</label>
          <input type="file" multiple accept="image/*" onChange={handleProductImageChange} className="p-2 border rounded" required={productPreviews.length === 0 && productImages.length === 0} />
          <div className="mt-2 flex flex-wrap gap-2">
            {productPreviews.map((src, idx) => (
              <div key={idx} className="relative">
                <img src={src} alt={`Produit ${idx}`} className="w-20 h-20 object-cover rounded" />
                <button type="button" onClick={() => handleRemoveProductPreview(idx)} className="absolute top-0 right-0 bg-red-500 text-white px-1 text-xs rounded">×</button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
          {loading ? 'Modification en cours…' : 'Modifier le rideau'}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;

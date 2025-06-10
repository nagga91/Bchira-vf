import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLoaderData } from 'react-router-dom';

const EditProduct = () => {
  const product = useLoaderData();

  const [load, setLoad] = useState(false);
  const [reference, setReference] = useState(product.reference || '');
  const [name, setName] = useState(product.name || '');
  const [description, setDescription] = useState(product.description || '');
  const [price, setPrice] = useState(product.price || '');
  const [category, setCategory] = useState(product.category || '');
  // Initialize colors: if product.colors exists use it; otherwise, initialize with three empty color objects.
  const [colors, setColors] = useState(
    product.colors && product.colors.length
      ? product.colors
      : [
          { name: '', image: '' },
          { name: '', image: '' }
        ]
  );
  const [sizes, setSizes] = useState(product.sizes || []);
  const [sousCategory, setsousCategory] = useState(product.sousCategory || '');
  const [imageUrls, setImageUrls] = useState(product.images || []);
  const [promo, setpromo] = useState(product.promo || 0);
  const [ispromo, setIspromo] = useState(product.ispromo || false);

  const availableSizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

  // Handle sizes checkboxes
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSizes((prev) => [...prev, value]);
    } else {
      setSizes((prev) => prev.filter((size) => size !== value));
    }
  };

  // Upload product images (not color images)
  const handleImageUpload = async (files) => {
    setLoad(true);
    const formData = new FormData();
    for (let file of files) {
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default'); // Cloudinary preset
      try {
        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/dwb8dvmbw/image/upload',
          formData
        );
        setImageUrls((prev) => [...prev, response.data.secure_url]);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
    setLoad(false);
  };

  // Remove product image
  const handleRemoveImage = (url) => {
    setImageUrls((prev) => prev.filter((image) => image !== url));
  };

  // Upload image for a specific color
  const handleColorImageUpload = async (event, index) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');
    try {
      setLoad(true);
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dwb8dvmbw/image/upload',
        formData
      );
      setColors((prev) => {
        const updated = [...prev];
        updated[index].image = response.data.secure_url;
        return updated;
      });
      setLoad(false);
    } catch (error) {
      console.error('Error uploading color image:', error);
      setLoad(false);
    }
  };

  // Update color name for a given input
  const handleColorNameChange = (event, index) => {
    const value = event.target.value;
    setColors((prev) => {
      const updated = [...prev];
      updated[index].name = value;
      return updated;
    });
  };

  // Add a new color input pair
  const handleAddColor = () => {
    setColors((prev) => [...prev, { name: '', image: '' }]);
  };

  // Remove a color input pair
  const handleRemoveColor = (index) => {
    setColors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      reference,
      name,
      description,
      price: parseFloat(price),
      category,
      images: imageUrls,
      colors, // sending the array of color objects
      sizes,
      sousCategory,
      promo,
      inStock: true,
      ispromo,
    };

    try {
      if (sizes.length !== 0) {
        setLoad(true);
        // Assuming product._id exists and is used to identify the product
        await axios.put(`/api/products/editProduct/${product._id}`, updatedProduct, {
          withCredentials: true,
        });
        toast.success('Product updated successfully!');
      } else {
        toast.error('Please select available sizes');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error updating product');
    } finally {
      setLoad(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit}>
        {/* Reference */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Reference</label>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
            required
          />
        </div>
        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
            required
          />
        </div>
        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
            required
          />
        </div>
        {/* Price */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
            required
          />
        </div>
        {/* Promo */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Pourcentage Promo</label>
          <input
            type="number"
            value={promo}
            onChange={(e) => setpromo(e.target.value)}
            className="mt-1 p-2 w-1/2 border rounded"
            required
          />
          <span>%</span>
        </div>
        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
            required
          >
            <option value="" disabled>
              Choose the category
            </option>
            <option value="femme">Femme</option>
            <option value="homme">Homme</option>
          </select>
        </div>
        {/* Sous Category */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Sous Category</label>
          <select
            value={sousCategory}
            onChange={(e) => setsousCategory(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
            required
          >
            <option value="" disabled>
              Choose the sous category of shoes
            </option>
            <option value="Sneakers">Sneakers</option>
            <option value="Mocassins">Mocassins</option>
            <option value="Chaussures de ville">Chaussures de ville</option>
          </select>
        </div>
        {/* Colors */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Colors</label>
          <div className="space-y-4">
            {colors.map((colorObj, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center gap-2">
                <input
                  type="text"
                  placeholder="Color Name"
                  value={colorObj.name}
                  onChange={(e) => handleColorNameChange(e, index)}
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="file"
                  onChange={(e) => handleColorImageUpload(e, index)}
                  className="p-2 border rounded"
                />
                {colorObj.image && (
                  <img
                    src={colorObj.image}
                    alt={`Color ${colorObj.name}`}
                    className="w-16 h-16 object-cover"
                  />
                )}
                {/* Remove Color button */}
                <button
                  type="button"
                  onClick={() => handleRemoveColor(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                >
                  Remove Color
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddColor}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Color
          </button>
        </div>
        {/* Sizes */}
        <div className="mb-4">
          <h3>Select Available Sizes:</h3>
          <div className="flex gap-3">
            {availableSizes.map((size, index) => (
              <label key={index} style={{ display: 'block', marginBottom: '4px' }}>
                <input
                  type="checkbox"
                  value={size}
                  checked={sizes.includes(size)}
                  onChange={handleCheckboxChange}
                />
                {size}
              </label>
            ))}
          </div>
          <div>
            <strong>Selected Sizes:</strong> {sizes.join(', ')}
          </div>
        </div>
        {/* Product Images */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Product Images</label>
          <input
            type="file"
            multiple
            onChange={(e) => handleImageUpload(e.target.files)}
            className="mt-1 p-2 w-full border rounded"
          />
          <div className="mt-2 flex flex-wrap gap-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative">
                <img src={url} alt="Product" className="w-32 h-32 object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(url)}
                  className="absolute top-0 right-0 bg-red-500 text-white px-1 text-xs"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
        <button
          disabled={load}
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          {load ? 'Updating...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;

import { useState } from 'react';
import { useLoaderData, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// Loader function to fetch products using Axios
export const productsLoader = async () => {
  try {
    const response = await axios.get('/api/products');
    return response.data.reverse(); // Assuming the products are in response.data
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

const AdminProducts = () => {
  const products = useLoaderData();
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showModal, setShowModal] = useState(false); // For controlling the modal
  const [productToDelete, setProductToDelete] = useState(null); // For tracking which product to delete
  const [error, setError] = useState(null);

  // Pagination logic
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setShowModal(true); // Show the modal when the Delete button is clicked
  };

  const handleDelete = async () => {
    try {
      // Send request to delete the product
      await axios.delete(`/api/products/deleteProduct/${productToDelete}`, {
        withCredentials: true, // Include cookies if needed
      });
      // Close the modal and refresh the page (or refetch the products)
      setShowModal(false);
      window.location.reload(); // Refresh the page after deletion
    } catch (err) {
      setError('Error deleting the product');
      console.log(err);
    }
  };

  const handleupdate = async (id,data) => {
    try {
      // Send request to update the product
      await axios.put( `/api/products/editProduct/${id}`,data, {
        withCredentials: true, // Include cookies if needed
      });
    
      toast.success('Product updated successfully!')
      setTimeout(() => {
        window.location.reload(); // Refresh the page after update
      }, 2000); 
     
    } catch (err) {
      setError('Error updating the product');
      console.log(err);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setProductToDelete(null); // Clear the product to delete
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-6">Gérer les produits</h2>
      <Link
        to="/admin/addProduct"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block"
      >
        Ajouter un produit
      </Link>

      <table className="min-w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-left text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6">Image</th>
            <th className="py-3 px-6">Nom</th>
            <th className="py-3 px-6">Catégorie</th>
            <th className="py-3 px-6">Prix</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {paginatedProducts.map((product) => (
            <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-center">
                <img src={`/${product.images[0]}`} alt={product.name} className="h-16 w-16 object-cover rounded-md" />
              </td>
              <td className="py-3 px-6">{product.name}</td>
              <td className="py-3 px-6">{product.category}</td>
              <td className="py-3 px-6">{product.price-product.price * product.promo /100} TND</td>
              <td className="py-3 px-6 text-center">
                <Link
                  to={`/admin/editProduct/${product._id}`}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded mr-2"
                >
                  Modifier
                </Link>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                  onClick={() => handleDeleteClick(product._id)} // Show the modal before deleting
                >
                  Supprimer
                </button>
                {/* <button
                  className="bg-black hover:bg-gray-800 text-white font-bold py-1 px-3 rounded"
                  onClick={() => handleupdate(product._id,{rupture:!product.rupture})} // Show the modal before deleting
                >
                  En/Hors stock
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 mx-1 bg-gray-300 rounded ${
            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400'
          }`}
        >
          Précédent
        </button>
        <span className="px-4 py-2">Page {currentPage} sur {totalPages}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 mx-1 bg-gray-300 rounded ${
            currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400'
          }`}
        >
          Suivant
        </button>
      </div>

      {/* Modal for confirming deletion */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Êtes-vous sûr de vouloir supprimer ce produit ?</h2>
            <div className="flex justify-end">
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={handleDelete} // Confirm deletion
              >
                Oui
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded"
                onClick={handleCancel} // Cancel deletion
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

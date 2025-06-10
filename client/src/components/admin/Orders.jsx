import { useLoaderData } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

// Loader function to fetch orders
export const ordersLoader = async () => {
  const response = await axios.get('/api/orders', {
    withCredentials: true, // Send cookies with the request
  });
  return response.data.orders.reverse(); // Assuming orders are returned from the API
};

const Orders = () => {
  const orderslist = useLoaderData();
  console.log(orderslist)
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const [selectedOrder, setSelectedOrder] = useState(null); // For showing cart details
  const [isModalOpen, setIsModalOpen] = useState(false); // To manage modal visibility

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orderslist.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(orderslist.length / ordersPerPage);

  // Open modal and set selected order
  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const updateorder=async(orderID,status)=>{
    try {
      
    const res=await axios.put(`/api/orders/updateOrder/${orderID}`,status,{
      withCredentials: true, // Send cookies with the request
    })
    toast.success("order updated")
    setTimeout(() => {
      window.location.reload();
    }, 500);
    
  } catch (error) {
   toast.error("failed to update order")   
  }
  
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Manage Orders</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Address</th>
              
              <th className="py-2 px-4 border-b">Phone</th>
              <th className="py-2 px-4 border-b">Total Price</th>
              <th className="py-2 px-4 border-b">date</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order._id}>
                <td className="py-2 px-4 border-b">
                  {order.firstName} {order.lastName}
                </td>
                <td className="py-2 px-4 border-b">{order.address}</td>
                
                <td className="py-2 px-4 border-b">{order.phoneNumber}</td>
                <td className="py-2 px-4 border-b">{order.totalPrice.toFixed(2)} TND</td>
                <td className="py-2 px-4 border-b">{new Date(order.orderDate).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}</td>
                <td className="py-2 px-4 border-b">{order.status}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => openModal(order)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                  >
                    Show Cart
                  </button>
                  <div className='flex '>
                  <button
                    onClick={()=>updateorder(order._id,{status:"received"})}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
                  >
                    <i className="fa-solid fa-check"></i>
                  </button>
                  <button
                    onClick={()=>updateorder(order._id,{status:"canceled"})}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                  >
                    <i className="fa-solid fa-x"></i>
                  </button>
                  </div>
                  

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 mx-1 border ${
              currentPage === index + 1 ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            } hover:bg-gray-300 transition duration-200`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Modal for Cart Details */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-1/2 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={closeModal}
            >
              X
            </button>
            <h3 className="font-semibold text-xl mb-4">Cart Details for {selectedOrder.firstName} {selectedOrder.lastName}</h3>
            <table >
              {selectedOrder.cart.map((item) => (
                <tr key={item.product._id} className="flex gap-4" >
                  <td><img src={`/${item.product.images[0]}`} className="w-16" alt="produit" /></td>
                  <td>ref:<strong>{item.product.reference}</strong> </td>
                  <td>length: {item.length}</td>
                  <td>Color: {item.color}</td>
                 
                <hr />
                </tr>
                
              ))}
            </table>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;

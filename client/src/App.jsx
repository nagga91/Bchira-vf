import React, { useEffect, useState } from 'react';
import { Routes, Route, useLoaderData, Navigate, Outlet, createBrowserRouter, RouterProvider, useLocation } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Shop from './components/Shop';
import ProductsPage from './views/ProductsPage';
import ProductDetails from './views/ProductDetails';
import axios from 'axios';
import Contact from './components/Contact';
import Dashboard, { getcurrent } from './components/admin/Dashbord';
import AdminProducts from './components/admin/Products';
import Orders, { ordersLoader } from './components/admin/Orders';
import AddProduct from './components/admin/Addproduct';
import EditProduct from './components/admin/Editproduct';
import Login from './components/admin/Login';
import Panier from './views/Checkout';
import ContactUs from './components/ContactUs';


const ProtectedRoute = ({ isAuthenticated, children }) => {
  const user=useLoaderData()
 
   if (!user) {
     return <Navigate to="/admin/login" />;
   }
 
   return children;
 };

 // Loader function to fetch products using Axios
export const productsLoader = async () => {
  try {
    const response = await axios.get("/api/products");
    return response.data; // Assuming the products are in response.data
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Loader function to fetch a single product by ID
export const productLoader = async ({ params }) => {
  try {
    const response = await axios.get(`/api/products/product/${params.id}`);
    return response.data; // Assuming the product is returned in response.data
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

function Layout() {
  const location = useLocation();
 const cart=useLoaderData()
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      {!location.pathname.includes("admin")?<Header cart={cart}/>:null}
      <div>
        <Outlet />
      </div>
      {!location.pathname.includes("admin")?<Footer />:null}
      <ToastContainer position="bottom-right" />
    </>
  );
}

function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

   // Function to fetch the cart data
   const fetchCart = async () => {
    try {
      const response = await axios.get("/api/cart", {
        withCredentials: true,
      });
      return response.data.cart || [];
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const router=createBrowserRouter([
    {
      path: "/",
      element: <Layout/>,
      loader: fetchCart,
      children:[
        {
          index: true,
          element:<Home />,
          loader:productsLoader
        },
        {
          path:'/shop/:id',
          element:<ProductDetails/>,
          loader:productLoader
        },
        {path:"/checkout",element:<Panier />,loader:fetchCart},
        { path: "/contact", element: <ContactUs /> },
        { path: "/shop", element: <ProductsPage />, loader: productsLoader },
        {
          path: "/admin",
          element: (
            <ProtectedRoute isAuthenticated={isAdminAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          ),
          loader: getcurrent,
          children: [
            { index:true, element: <AdminProducts />, loader: productsLoader },
            { path: "orders", element: <Orders />, loader: ordersLoader },
            { path: "addProduct", element: <AddProduct /> },
            { path: "editProduct/:id", element: <EditProduct />, loader: productLoader },
          ],
        },
        { path: "/admin/login", element: <Login setIsAdminAuthenticated={setIsAdminAuthenticated} /> },
      ]
    }
  ])
  return (
    <RouterProvider router={router} />
  );
}

export default App;
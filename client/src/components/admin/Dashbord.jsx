import { Outlet, Link, useLoaderData } from 'react-router-dom';
import axios from 'axios';


export const getcurrent = async () => {
  try {
    const response = await axios.get('/api/users/me', {
      withCredentials: true, // Send cookies with the request
    });
    return response.data;
  } catch (error) {
    console.log(error)
    return null;
  }
};
const Dashboard = () => {
    const user = useLoaderData(); // Get the user data from loader
   console.log(user)

    return (
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white flex flex-col">
          <div className="p-4 text-center bg-gray-800">
            <h2 className="text-xl font-bold">Admin Dashboard</h2>
            <p>Welcome, {user?.email}</p>
          </div>
          <nav className="flex-1 p-4 space-y-4">
            <Link
              to="/admin"
              className="block px-3 py-2 rounded hover:bg-gray-700 transition duration-200"
            >
              Manage Products
            </Link>
            <Link
              to="/admin/orders"
              className="block px-3 py-2 rounded hover:bg-gray-700 transition duration-200"
            >
              Manage Orders
            </Link>
            <Link
              to="/"
              className="block px-3 py-2 rounded hover:bg-gray-700 transition duration-200"
            >
              Visitez le site web
            </Link>
          </nav>
          <div className="p-4">
            <button
              
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
            >
              Log out
            </button>
          </div>
        </aside>
  
        {/* Main Content */}
        <div className="flex-1 p-6">

        

          <Outlet /> {/* Nested routes (like Products and Orders) will be rendered here */}
        </div>
      </div>
    );
  };
  
  export default Dashboard;

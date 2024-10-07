import React from 'react';
import { Link } from 'react-router-dom'; // Ensure you have react-router-dom installed

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-center">Dashboard</h1>
      </div>
      <nav className="mt-10 flex-grow">
        <ul className="space-y-4 px-4">
          <li className="hover:bg-gray-800 rounded-lg transition duration-200">
            <Link to="/donation" className="block py-3 px-4 text-lg font-semibold">
              Donation
            </Link>
          </li>
          <li className="hover:bg-gray-800 rounded-lg transition duration-200">
            <Link to="/table" className="block py-3 px-4 text-lg font-semibold">
              Table
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700 text-center text-gray-400">
        © 2024 MyApp
      </div>
    </div>
  );
};

export default Sidebar;

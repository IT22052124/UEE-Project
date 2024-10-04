import React from 'react';
import { Link } from 'react-router-dom'; // Ensure you have react-router-dom installed

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white">
      <div className="p-5">
        <h1 className="text-xl font-bold">My Application</h1>
      </div>
      <nav className="mt-10">
        <ul>
          <li className="hover:bg-gray-700">
            <Link to="/donation" className="block py-2 px-4">
              Donation
            </Link>
          </li>
          <li className="hover:bg-gray-700">
            <Link to="/table" className="block py-2 px-4">
              Table
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

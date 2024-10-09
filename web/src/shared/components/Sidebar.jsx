import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegHeart, FaTable, FaChartBar,FaHome  } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="w-64 h-100 fixed bg-gradient-to-b from-blue-900 to-blue-400 text-white flex flex-col shadow-xl relative overflow-hidden">
      {/* Pattern overlay */}
      <div className="absolute inset-0 bg-pattern opacity-10"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <FaChartBar className="text-purple-600 text-xl" />
            </div>
            <h1 className="text-2xl font-bold">Erase Poverty</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex-grow">
          <ul className="space-y-2 px-4">
          <li>
              <Link
                to="/"
                className="flex items-center py-3 px-4 text-lg font-medium rounded-lg transition duration-200 hover:bg-white/10 group"
              >
                <FaHome className="mr-3 text-pink-300 group-hover:text-white transition-colors duration-200" />
                <span className="group-hover:translate-x-1 transition-transform duration-200">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/table"
                className="flex items-center py-3 px-4 text-lg font-medium rounded-lg transition duration-200 hover:bg-white/10 group"
              >
                <FaTable className="mr-3 text-pink-300 group-hover:text-white transition-colors duration-200" />
                <span className="group-hover:translate-x-1 transition-transform duration-200">Donation</span>
              </Link>
            </li>
            <li>
              <Link
                to="/donation"
                className="flex items-center py-3 px-4 text-lg font-medium rounded-lg transition duration-200 hover:bg-white/10 group"
              >
                <FaRegHeart  className="mr-3 text-blue-300 group-hover:text-white transition-colors duration-200" />
                <span className="group-hover:translate-x-1 transition-transform duration-200">Create donation</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 text-center">
          <p className="text-sm text-indigo-200">© 2024 MyApp</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
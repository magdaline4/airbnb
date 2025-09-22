import React from "react";
import { FaSearch, FaGlobe, FaBars, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="w-full shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="text-2xl font-bold text-red-500 cursor-pointer">
          airbnb
        </div>

        {/* Search bar */}
        <div className="hidden md:flex items-center space-x-2 border rounded-full px-4 py-2 shadow-sm hover:shadow-md transition">
          <span className="text-sm">Anywhere</span>
          <span className="border-l h-5"></span>
          <span className="text-sm">Any week</span>
          <span className="border-l h-5"></span>
          <span className="text-sm text-gray-500">Add guests</span>
          <button className="bg-red-500 text-white p-2 rounded-full">
            <FaSearch size={12} />
          </button>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          <span className="text-sm cursor-pointer">Become a host</span>
          <FaGlobe className="cursor-pointer" />
          <div className="flex items-center space-x-2 border rounded-full px-2 py-1 cursor-pointer">
            <FaBars />
            <FaUserCircle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

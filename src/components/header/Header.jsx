import React from 'react';
import { FaTachometerAlt, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { IoHome } from "react-icons/io5";
import { FaWpforms } from "react-icons/fa6";
const Header = () => {
  return (
    <header className="bg-blue-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-end items-center">
        
        {/* Navigation with text + icon together */}
        <ul className="flex space-x-6 text-white font-medium">
          <li className="flex items-center space-x-2 hover:text-gray-200 transition-colors duration-200 cursor-pointer">
            <IoHome />
            <Link to='/' ><span >Home</span></Link>
          </li>
          <li className="flex items-center space-x-2 hover:text-gray-200 transition-colors duration-200 cursor-pointer">
            <FaTachometerAlt />
            <Link to='/dashboard' ><span >Dashboard</span></Link>
          </li>
          <li className="flex items-center space-x-2 hover:text-gray-200 transition-colors duration-200 cursor-pointer">
            <FaWpforms/>
           <Link to='/forms/all'><span>Fill Forms</span></Link> 
          </li>
        </ul>

      </div>
    </header>
  );
};

export default Header;

import React from 'react';
import { Menu, Search } from 'lucide-react';

const Navbar = ({ toggleSidebar, searchQuery, setSearchQuery }) => {
  return (
    <nav className="bg-white shadow-md px-4 py-3 flex items-center justify-between fixed w-full top-0 z-50">
      <div className="flex items-center gap-4">
        <Menu
          className="cursor-pointer hover:text-blue-600 transition-colors"
          onClick={toggleSidebar}
        />
        <h1 className="text-xl font-bold text-blue-600">Arbitrex</h1>
      </div>
      <div className="relative max-w-md w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
        />
      </div>
    </nav>
  );
};

export default Navbar;

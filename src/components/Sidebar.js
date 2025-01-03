import React from 'react';
import { X } from 'lucide-react';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white shadow-lg w-64 transform transition-transform duration-300 ease-in-out z-40 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-4 pt-20">
        <button onClick={toggleSidebar} className="absolute top-4 right-4">
          <X className="hover:text-blue-600 transition-colors" />
        </button>
        <ul className="space-y-4">
          <li className="p-2 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors">
            News
          </li>
          <li className="p-2 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors">
            Top 30
          </li>
          <li className="p-2 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors">
            Ranks
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

import React, { useState } from 'react';
import './app.css';
import Prices from './components/Prices';
import NewsCard from './components/News';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-left">
          <button 
            className="menu-button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>
          <h1 className="logo">Arbitrex</h1>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </nav>

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button 
          className="close-button"
          onClick={() => setIsSidebarOpen(false)}
        >
          ×
        </button>
        <ul className="sidebar-menu">
          <li>News</li>
          <li>Top 30</li>
          <li>Ranks</li>
        </ul>
      </div>

      <div className="content-wrapper">
        <Prices></Prices>
        <NewsCard></NewsCard>
      </div>
    </div>
  );
};

export default App;
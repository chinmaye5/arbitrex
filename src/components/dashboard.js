// Dashboard.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Moon, Sun, Menu, Home, LineChart, Settings,Newspaper } from 'lucide-react';
import CryptoArbitrageTracker from './Prices';
import CryptoNews from './News';
import CryptoPricesDashboard from './test';
import './Dashboard.css';

// Content Components
const DashboardContent = () => (
  <div>
    <h1>Dashboard Overview</h1>
    <p>Welcome to your trading dashboard. Here's your overview for today.</p>
    {/* Add your dashboard content here */}
  </div>
);


const SettingsContent = () => (
  <div>
    <h1>Account Settings</h1>
    <p>Manage your account preferences and settings.</p>
    {/* Add your settings content here */}
  </div>
);

// NavItem Component
const NavItem = ({ path, name, icon: Icon, isActive }) => (
  <Link
    to={path}
    className={`nav-item ${isActive ? 'active' : ''}`}
  >
    <Icon size={20} />
    <span>{name}</span>
  </Link>
);

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  // Initialize theme based on system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme ? savedTheme === 'dark' : prefersDark;
    
    setIsDarkMode(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme ? 'dark' : 'light');
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
  };

  const navItems = [
    { path: '/dashboard/overview', name: 'Dashboard', icon: Home },
    { path: '/dashboard/trading', name: 'Arbitrage table', icon: LineChart },
    { path: '/dashboard/history', name: 'Latest news', icon: Newspaper },
    { path: '/dashboard/settings', name: 'Settings', icon: Settings },
  ];

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-brand">
          <button
            className="icon-button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
          <span>
          <Link 
            to="/" 
            style={{ 
              textDecoration: 'none',  // Removes underline
              color: 'inherit',        // Inherits the color from the parent
              fontWeight: 'inherit',   // Inherits the font weight from the parent
              display: 'inline'        // Keeps it inline with surrounding elements
            }}
          >
            ARBITREX
          </Link>
          </span>
        </div>
        <div className="navbar-actions">
          <button
            className="icon-button"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </nav>

      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <nav className="nav-items">
          {navItems.map((item) => (
            <NavItem
              key={item.name}
              {...item}
              isActive={location.pathname === item.path}
            />
          ))}
        </nav>
      </aside>

      <main className={`main-content ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard/overview" replace />} />
          <Route path="/overview" element={<DashboardContent />} />
          <Route path="/trading" element={<CryptoArbitrageTracker/>} />
          <Route path="/history" element={<CryptoNews />} />
          <Route path="/settings" element={<CryptoPricesDashboard></CryptoPricesDashboard>} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
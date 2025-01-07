// src/components/Dashboard/Dashboard.js
import React, { useState } from 'react';
import './Dashboard.css'

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="dashboard-nav">
        <div className="nav-left">
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <h1 className="brand">ARBITREX</h1>
        </div>
        <div className="nav-right">
          <span className="user-name">John Doe</span>
          <div className="avatar">JD</div>
        </div>
      </nav>

      <div className="dashboard-main">
        {/* Sidebar */}
        <div className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="menu-items">
            <a href="#" className="menu-item active">Dashboard</a>
            <a href="#" className="menu-item">Trading</a>
            <a href="#" className="menu-item">History</a>
            <a href="#" className="menu-item">Settings</a>
          </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-content">
          <div className="stats-container">
            <div className="stat-card">
              <h3>Total Balance</h3>
              <p className="stat-value">$24,500</p>
              <p className="stat-change positive">+2.5%</p>
            </div>
            <div className="stat-card">
              <h3>Active Trades</h3>
              <p className="stat-value">12</p>
              <p className="stat-change">Current</p>
            </div>
            <div className="stat-card">
              <h3>Total Profit</h3>
              <p className="stat-value">$1,245</p>
              <p className="stat-change positive">+5.2%</p>
            </div>
          </div>

          <div className="recent-activity">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-info">
                  <h4>BTC/USD Trade</h4>
                  <p>Successful trade execution</p>
                </div>
                <span className="activity-time">2h ago</span>
              </div>
              <div className="activity-item">
                <div className="activity-info">
                  <h4>ETH/USD Trade</h4>
                  <p>Position opened</p>
                </div>
                <span className="activity-time">5h ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
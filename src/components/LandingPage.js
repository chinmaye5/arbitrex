import React, { useState, useEffect } from 'react';
import { Sun, Moon, AlertCircle, Shield, Bell, ArrowRight, Facebook, Twitter, Linkedin } from 'lucide-react';
import './LandingPage.css';
import Exchanges from './Exchanges';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import binanceLogo from '../assets/binance.svg';
import bitfinexLogo from '../assets/Bitfinex-Logo.wine.svg';
import coinbaseLogo from '../assets/Coinbase.svg';
import geminiLogo from '../assets/gemini.png';

const LandingPage = () => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.classList.remove('hidden');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
  
  const exchanges = [
    { name: 'Binance', logo: binanceLogo },
    { name: 'bitfinex', logo: bitfinexLogo },
    { name: 'coinbase', logo: coinbaseLogo },
    { name: 'gemini', logo: geminiLogo },
  ];

  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/auth"); // Navigate to the AuthForm component
  };


  return (
    <div className={`landing-page ${darkMode ? 'dark' : 'light'}`}>
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">ARBITREX</div>
          <nav className="nav">
            {['Home', 'Features', 'Pricing', 'About', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="nav-link">
                {item}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="dark-mode-toggle-landing"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="login-button" onClick={handleLoginClick}>Login</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container text-center">
          <h1 className="hero-title animate-on-scroll hidden">
            Maximize Your Crypto Gains with Arbitrex
          </h1>
          <p className="hero-subtitle animate-on-scroll hidden">
            Find real-time arbitrage opportunities across exchanges
          </p>
          <Link to="/dashboard">
      <button className="cta-button animate-on-scroll hidden">
        Get Started
      </button>
    </Link>
        </div>
      </section>

      <Exchanges exchanges={exchanges} />

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <h2 className="section-title">Features</h2>
          <div className="features-grid">
            {[
              { icon: <AlertCircle size={32} />, title: 'Real-Time Analytics', desc: 'Up-to-date arbitrage insights' },
              { icon: <Shield size={32} />, title: 'Secure', desc: 'Your data is always safe' },
              { icon: <Bell size={32} />, title: 'Custom Alerts', desc: 'Notifications for profitable opportunities' },
              { icon: <ArrowRight size={32} />, title: 'Multi-Exchange Support', desc: 'Supports top crypto platforms' }
            ].map((feature, index) => (
              <div key={index} className="feature-card animate-on-scroll hidden">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing" id="pricing">
        <div className="container">
          <h2 className="section-title">Pricing Plans</h2>
          <div className="pricing-grid">
            {[
              { title: 'Free', price: '$0', features: ['Basic Analytics', '5 Exchanges', 'Standard Support'] },
              { title: 'Standard', price: '$4.99', features: ['Advanced Analytics', '10 Exchanges', 'Priority Support'] },
              { title: 'Premium', price: '$9.99', features: ['Unlimited Exchanges', '24/7 Support', 'API Access'] }
            ].map((plan, index) => (
              <div key={index} className="pricing-card animate-on-scroll hidden">
                <h3 className="plan-title">{plan.title}</h3>
                <p className="plan-price">{plan.price}<span>/month</span></p>
                <ul className="plan-features">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="plan-feature">{feature}</li>
                  ))}
                </ul>
                <button className="plan-button">Choose Plan</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-section">
            <h4 className="footer-title">Arbitrex</h4>
            <p className="footer-desc">Simplifying crypto arbitrage for everyone.</p>
          </div>
          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Privacy Policy</a></li>
              <li><a href="#" className="footer-link">Terms of Service</a></li>
              <li><a href="#" className="footer-link">Support</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="footer-title">Follow Us</h4>
            <div className="social-icons">
              <Facebook className="social-icon" />
              <Twitter className="social-icon" />
              <Linkedin className="social-icon" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

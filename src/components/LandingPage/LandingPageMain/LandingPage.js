import React, { useState, useEffect } from 'react';
import { Sun, Moon, AlertCircle, Shield, Bell, ArrowRight, Facebook, Twitter, Linkedin,Sparkles, LineChart } from 'lucide-react';
import './LandingPage.css';
import Exchanges from '../Exchanges/Exchanges';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import binanceLogo from '../../../assets/binance.svg'
import bitfinexLogo from '../../../assets/Bitfinex-Logo.wine.svg';
import coinbaseLogo from '../../../assets/Coinbase.svg';
import geminiLogo from '../../../assets/gemini.png';
import img1 from '../../../assets/img1.png';
import img2 from '../../../assets/img2.png';
import img3 from '../../../assets/img3.png';

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
    navigate("/auth");
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
      <section className="hero" id='home'>
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title animate-on-scroll hidden">
          <span className="highlight">Turn Market Inefficiencies Into Profitable Opportunities</span>
          </h1>
          
          <p className="hero-subtitle animate-on-scroll hidden">
            Join thousands of traders using Arbitrex to discover and execute cross-exchange 
            arbitrage opportunities in real-time
          </p>

          <div className="cta-container animate-on-scroll hidden">
            <Link to="/dashboard" className="primary-button">
              Start Trading Now
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </section>

      <Exchanges exchanges={exchanges} />

      {/* arbitrage exp sec */}
    <section className="arbitrage-section" id="about">
      {/* Introduction Section */}
      <div className="content-block">
        <div className="text-content">
          <h2>What is Crypto Arbitrage?</h2>
          <p>
          <b>
            Crypto arbitrage is a trading strategy that takes advantage of price differences 
            for the same cryptocurrency across different exchanges. This price disparity 
            creates an opportunity for traders to profit by buying low on one exchange 
            and selling high on another.
          </b>
          </p>
          <p>
          <b>
            This strategy is considered relatively low-risk compared to traditional crypto 
            trading, as it capitalizes on existing price differences rather than speculating 
            on future price movements.
          </b>
          </p>
        </div>
        <div className="image-container">
          <div className="image-card">
            <img 
              src={img1}
              alt="Crypto arbitrage concept visualization"
            />
          </div>
        </div>
      </div>

      {/* Buy Low Section */}
      <div className="content-block reverse">
        <div className="text-content">
          <h2>Step 1: Buy Low</h2>
          <p>
          <b>
            The first step in crypto arbitrage is identifying exchanges where a 
            particular cryptocurrency is trading at a lower price. Advanced algorithms 
            and trading tools continuously monitor multiple exchanges to spot these 
            opportunities.
          </b>
          </p>
          <p>
          <b>
            Speed is crucial in this step, as price differences can exist for very 
            short periods. Having accounts pre-funded on multiple exchanges allows 
            for quick execution when opportunities arise.
          </b>
          </p>
        </div>
        <div className="image-container">
          <div className="image-card">
            <img 
              src={img2}
              alt="Buying cryptocurrency at lower price"
            />
          </div>
        </div>
      </div>

      {/* Profit Through Multiple Trades Section */}
      <div className="content-block">
        <div className="text-content">
          <h2>Step 2: Maximize Profits Through Multiple Trades</h2>
          <p>
            <b>
            Once you've purchased cryptocurrency at a lower price, the next step is 
            transferring and selling it on exchanges where it's trading at a higher 
            price. This process can be repeated multiple times to compound profits.
            </b>
          </p>
          <p>
            <b>
            Successful arbitrage traders often run multiple trades simultaneously, 
            taking advantage of price differences across various cryptocurrency pairs 
            and exchanges. This approach helps maximize potential returns while 
            diversifying risk.
            </b>
          </p>
          <ul>
            <li>Monitor multiple exchanges simultaneously</li>
            <li>Execute trades quickly when opportunities arise</li>
            <li>Account for transaction fees and transfer times</li>
            <li>Maintain sufficient balances across exchanges</li>
          </ul>
        </div>
        <div className="image-container">
          <div className="image-card">
            <img 
              src={img3}
              alt="Multiple trading visualization"
            />
          </div>
        </div>
      </div>
    </section>

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
      <footer className="footer" id="contact">
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

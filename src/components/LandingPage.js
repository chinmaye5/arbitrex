import React, { useState, useEffect } from 'react';
import { Sun, Moon, AlertCircle, Shield, Bell, ArrowRight, Facebook, Twitter, Linkedin } from 'lucide-react';
import styles from "../index.css"

const LandingPage = () => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-opacity-90 backdrop-blur-lg shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-extrabold tracking-wide">ARBITREX</div>
          <nav className="hidden md:flex space-x-6">
            {['Home', 'Features', 'Pricing', 'About', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-lg hover:text-blue-500 transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-cover bg-center" style={{ backgroundImage: "url('/hero-bg.jpg')" }}>
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            Maximize Your Crypto Gains with Arbitrex
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-70 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200">
            Find real-time arbitrage opportunities across exchanges
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition-colors animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-400">
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16" id="features">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <AlertCircle size={32} />, title: 'Real-Time Analytics', desc: 'Up-to-date arbitrage insights' },
              { icon: <Shield size={32} />, title: 'Secure', desc: 'Your data is always safe' },
              { icon: <Bell size={32} />, title: 'Custom Alerts', desc: 'Notifications for profitable opportunities' },
              { icon: <ArrowRight size={32} />, title: 'Multi-Exchange Support', desc: 'Supports top crypto platforms' }
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 text-center bg-gray-800 rounded-lg shadow-lg animate-on-scroll opacity-0 translate-y-8 transition-all duration-700"
              >
                <div className="mb-4 text-blue-500">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm opacity-70">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-100 dark:bg-gray-800" id="pricing">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Pricing Plans</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Free', price: '$0', features: ['Basic Analytics', '2 Exchanges', 'Standard Support'] },
              { title: 'Standard', price: '$49', features: ['Advanced Analytics', '5 Exchanges', 'Priority Support'] },
              { title: 'Premium', price: '$99', features: ['Unlimited Exchanges', '24/7 Support', 'API Access'] }
            ].map((plan, index) => (
              <div
                key={index}
                className={`p-8 rounded-lg shadow-lg ${darkMode ? 'bg-gray-900' : 'bg-white'} animate-on-scroll opacity-0 translate-y-8`}
              >
                <h3 className="text-2xl font-bold mb-4">{plan.title}</h3>
                <p className="text-4xl font-bold mb-6">
                  {plan.price}
                  <span className="text-sm opacity-70">/month</span>
                </p>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <ArrowRight size={16} className="mr-2 text-blue-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">Arbitrex</h4>
              <p className="opacity-70">Simplifying crypto arbitrage for everyone.</p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                <li><a href="#" className="hover:underline">Terms of Service</a></li>
                <li><a href="#" className="hover:underline">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <Facebook className="hover:text-blue-500 cursor-pointer" />
                <Twitter className="hover:text-blue-500 cursor-pointer" />
                <Linkedin className="hover:text-blue-500 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

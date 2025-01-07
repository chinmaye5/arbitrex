import React from 'react';
import './Exchange.css';

const Exchanges = ({ exchanges }) => {
  return (
    <div className="exchanges-container">
      <h2>Available Exchanges</h2>
      <div className="exchanges-grid">
        {exchanges.map((exchange, index) => (
          <div className="exchange-card" key={index}>
            <img
              src={exchange.logo}
              alt={`${exchange.name} logo`}
              className="exchange-logo"
            />
            <p className="exchange-name">{exchange.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exchanges;

import React, { useState, useEffect } from 'react';
import { fetchAllPrices } from '../apis/cryptoUtils';
import './ArbitrageCards.css';
import fire from '../../../assets/fire.gif';

const CryptoPriceCards = () => {
  const [priceData, setPriceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPrices = async () => {
      try {
        const prices = await fetchAllPrices('arbitragePercent', 'desc');
        setPriceData(prices);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    loadPrices();
  }, []);

  if (isLoading) return <div className="loading">Loading cryptocurrency prices...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="crypto-container">
      <h1>Cryptocurrency arbitrages</h1>
      <div className="crypto-grid">
        {priceData.map((crypto) => (
          <div key={crypto.symbol} className="crypto-card">
            <div className="card-header">
              <div className="symbol-badge">{crypto.symbol}</div>
            </div>
            
            <div className="price-comparison">
              <div className="highest-price">
                <p className="price-label">Highest Price</p>
                <p className="price-value">
                  ${crypto.highestPrice.toFixed(2)}
                  <span className="exchange">{crypto.highestPriceExchange}</span>
                </p>
              </div>
              
              <div className="lowest-price">
                <p className="price-label">Lowest Price</p>
                <p className="price-value">
                  ${crypto.lowestPrice.toFixed(2)}
                  <span className="exchange">{crypto.lowestPriceExchange}</span>
                </p>
              </div>
            </div>
            
            <div className="arbitrage-container">
              <div className="arbitrage-value">
                Arbitrage: {crypto.arbitragePercent}%
                {parseFloat(crypto.arbitragePercent) > 1 && (
                  <img 
                    src={fire}
                    alt="Hot opportunity" 
                    className="fire-gif"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoPriceCards;
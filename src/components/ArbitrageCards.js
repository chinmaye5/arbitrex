// ArbitrageCards.jsx
import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { fetchAllPrices } from './cryptoUtils';
import './ArbitrageCards.css';

const getArbitrageClass = (percentage) => {
  const num = parseFloat(percentage);
  if (num >= 2) return 'high-arbitrage';
  if (num >= 1) return 'medium-arbitrage';
  return 'low-arbitrage';
};

const ExchangeLogo = ({ exchange }) => {
  // You would need to add actual logo images to your project
  const logoUrl = `/logos/${exchange.toLowerCase()}.png`;
  
  return (
    <img 
      src={logoUrl} 
      alt={`${exchange} logo`} 
      className="exchange-logo"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = '/logos/default-exchange.png';
      }}
    />
  );
};

const ArbitrageCard = ({ data }) => {
  const arbitrageClass = getArbitrageClass(data.arbitragePercent);

  return (
    <div className="arbitrage-card">
      <div className="card-header">
        <span className="coin-symbol">{data.symbol}</span>
      </div>
      <div className="card-content">
        <div className="exchange-container">
          <ExchangeLogo exchange={data.lowestPriceExchange} />
          <div className="exchange-details">
            <span className="exchange-name">{data.lowestPriceExchange}</span>
            <span className="price">${data.lowestPrice.toFixed(4)}</span>
          </div>
        </div>

        <div className={`arbitrage-percentage ${arbitrageClass}`}>
          {data.arbitragePercent}%
        </div>

        <div className="exchange-container">
          <div className="exchange-details">
            <span className="exchange-name">{data.highestPriceExchange}</span>
            <span className="price">${data.highestPrice.toFixed(4)}</span>
          </div>
          <ExchangeLogo exchange={data.highestPriceExchange} />
        </div>
      </div>
    </div>
  );
};

const ArbitrageCards = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updatePrices = async () => {
    setLoading(true);
    try {
      const processedData = await fetchAllPrices();
      // Sort by arbitrage percentage in descending order
      const sortedData = processedData.sort(
        (a, b) => parseFloat(b.arbitragePercent) - parseFloat(a.arbitragePercent)
      );
      setData(sortedData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch cryptocurrency data. Please try again later.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updatePrices();
    const interval = setInterval(updatePrices, 10000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <>
      <div className="refresh-container">
        <h1>Arbitrage Opportunities</h1>
        <button
          onClick={updatePrices}
          className="refresh-button"
          disabled={loading}
        >
          <RefreshCw className={loading ? 'loading-spinner' : ''} size={20} />
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      <div className="arbitrage-cards-container">
        {data.map((crypto) => (
          <ArbitrageCard key={crypto.symbol} data={crypto} />
        ))}
      </div>
    </>
  );
};

export default ArbitrageCards;
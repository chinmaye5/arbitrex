import React, { useState, useEffect } from 'react';
import { ArrowUpCircle, ArrowDownCircle, AlertCircle, BarChart3 } from 'lucide-react';
import { cryptoService } from '../services/apiService';
import './Prices.css';

const Prices = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVolume, setShowVolume] = useState(false);

  useEffect(() => {
    // Initial fetch with loading state
    const initialFetch = async () => {
      try {
        const data = await cryptoService.getAllPrices();
        const sortedData = data.sort((a, b) => b.price - a.price);
        setPrices(sortedData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch prices. Please try again later.');
        console.error('Error fetching prices:', err);
      } finally {
        setLoading(false);
      }
    };

    // Subsequent fetches without loading state
    const updatePrices = async () => {
      try {
        const data = await cryptoService.getAllPrices();
        const sortedData = data.sort((a, b) => b.price - a.price);
        setPrices(sortedData);
        setError(null);
      } catch (err) {
        console.error('Error updating prices:', err);
        // Don't set error state for updates to avoid UI disruption
      }
    };

    initialFetch();
    const interval = setInterval(updatePrices, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatVolume = (volume) => {
    if (!volume) return 'N/A';
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(2)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(2)}K`;
    }
    return volume.toFixed(2);
  };

  const getHighestLowestPrice = () => {
    if (prices.length === 0) return { highest: 0, lowest: 0, diff: 0 };
    const highest = Math.max(...prices.map(p => p.price));
    const lowest = Math.min(...prices.map(p => p.price));
    const diff = ((highest - lowest) / lowest) * 100;
    return { highest, lowest, diff };
  };

  if (loading) {
    return (
      <div className="price-card">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (error && prices.length === 0) {
    return (
      <div className="price-card">
        <div className="error-message">
          <AlertCircle size={24} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  const { highest, lowest, diff } = getHighestLowestPrice();

  return (
    <div className="price-card">
      <div className="card-header">
        <div className="header-content">
          <h2>Bitcoin Prices Across Exchanges</h2>
          <button 
            className="volume-toggle"
            onClick={() => setShowVolume(!showVolume)}
          >
            <BarChart3 size={20} />
            {showVolume ? 'Hide Volume' : 'Show Volume'}
          </button>
        </div>
        <div className="arbitrage-info">
          <div className="arbitrage-detail">
            <span>Highest: </span>
            <span className="price-value">${highest.toLocaleString(undefined, { 
              minimumFractionDigits: 2,
              maximumFractionDigits: 2 
            })}</span>
          </div>
          <div className="arbitrage-detail">
            <span>Lowest: </span>
            <span className="price-value">${lowest.toLocaleString(undefined, { 
              minimumFractionDigits: 2,
              maximumFractionDigits: 2 
            })}</span>
          </div>
          <div className="arbitrage-detail">
            <span>Difference: </span>
            <span className="price-value">{diff.toFixed(2)}%</span>
          </div>
        </div>
      </div>
      <div className="card-content">
        {prices.map((data) => (
          <div key={data.exchange} className="price-row">
            <div className="exchange-info">
              <div className="exchange-name">{data.exchange}</div>
              {showVolume && (
                <div className="volume-info">
                  Vol: {formatVolume(data.volume)} BTC
                </div>
              )}
            </div>
            <div className="price-info">
              <div className="current-price">
                ${data.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
              <div className={`price-change ${data.change24h >= 0 ? 'positive' : 'negative'}`}>
                {data.change24h >= 0 ? (
                  <ArrowUpCircle size={16} />
                ) : (
                  <ArrowDownCircle size={16} />
                )}
                <span>{Math.abs(data.change24h).toFixed(2)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="card-footer">
        <div className="update-info">
          Last updated: {new Date().toLocaleTimeString()}
          {error && <span className="update-error"> - Update failed, retrying...</span>}
        </div>
      </div>
    </div>
  );
};

export default Prices;
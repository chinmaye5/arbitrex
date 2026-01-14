// CryptoArbitrageTracker.jsx
import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { fetchAllPrices } from '../apis/cryptoUtils';
import "./Prices.css"

const CryptoArbitrageTracker = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    field: null,
    direction: 'desc'
  });

  const updatePrices = async () => {
    setLoading(true);
    try {
      const processedData = await fetchAllPrices(sortConfig.field, sortConfig.direction);
      setData(processedData);
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
  }, [sortConfig]);

  const handleSort = (field) => {
    setSortConfig(prevConfig => ({
      field,
      direction: prevConfig.field === field && prevConfig.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  if (error) {
    return (
      <div>
        <div>{error}</div>
      </div>
    );
  }

  return (
    <div className="container-prices">
      <div className="header-prices">
        <h1 className="title-prices">Arbitrage Table</h1>
        <button
          onClick={updatePrices}
          className="refresh-button-prices"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="table-container-prices">
        <table className="table-prices">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Binance Price</th>
              <th>Coinbase Price</th>
              <th>Huobi Price</th>
              <th>Gemini Price</th>
              <th>Bybit Price</th>
              <th>Bitmart Price</th>
              <th>KuCoin Price</th>
              <th>Bitfinex Price</th>
              <th>OKX Price</th>
              <th>Gate.io Price</th>
              <th onClick={() => handleSort('lowestPrice')}>
                Lowest {sortConfig.field === 'lowestPrice' && (
                  <span className="sort-icon-prices">
                    {sortConfig.direction === 'desc' ? '↓' : '↑'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('highestPrice')}>
                Highest {sortConfig.field === 'highestPrice' && (
                  <span className="sort-icon-prices">
                    {sortConfig.direction === 'desc' ? '↓' : '↑'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('arbitragePercent')}>
                Arbitrage % {sortConfig.field === 'arbitragePercent' && (
                  <span className="sort-icon-prices">
                    {sortConfig.direction === 'desc' ? '↓' : '↑'}
                  </span>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((crypto) => (
              <tr key={crypto.symbol}>
                <td>{crypto.symbol}</td>
                <td>${crypto.exchanges.Binance?.toFixed(2) || 'N/A'}</td>
                <td>${crypto.exchanges.Coinbase?.toFixed(2) || 'N/A'}</td>
                <td>${crypto.exchanges.Huobi?.toFixed(2) || 'N/A'}</td>
                <td>${crypto.exchanges.Gemini?.toFixed(2) || 'N/A'}</td>
                <td>${crypto.exchanges.Bybit?.toFixed(2) || 'N/A'}</td>
                <td>${crypto.exchanges.Bitmart?.toFixed(2) || 'N/A'}</td>
                <td>${crypto.exchanges.Kucoin?.toFixed(2) || 'N/A'}</td>
                <td>${crypto.exchanges.Bitfinex?.toFixed(2) || 'N/A'}</td>
                <td>${crypto.exchanges.OKX?.toFixed(2) || 'N/A'}</td>
                <td>${crypto.exchanges['Gate.io']?.toFixed(2) || 'N/A'}</td>
                <td className="arbitrage-low-prices">
                  ${crypto.lowestPrice.toFixed(4)}
                  <span className="exchange-name-prices">
                    ({crypto.lowestPriceExchange})
                  </span>
                </td>
                <td className="arbitrage-high-prices">
                  ${crypto.highestPrice.toFixed(4)}
                  <span className="exchange-name-prices">
                    ({crypto.highestPriceExchange})
                  </span>
                </td>
                <td>
                  <span className={crypto.arbitragePercent > 1 ? 'arbitrage-high-prices' : ''}>
                    {crypto.arbitragePercent}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <div className="loading-prices">
            <RefreshCw className="loading-spinner-prices" />
            Fetching new data...
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoArbitrageTracker;

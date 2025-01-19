import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import fetchBinancePrices from './apis/fetchBinancePrices'
import fetchCoinbasePrices from './apis/fetchCoinbasePrices'
import fetchHuobiPrices from './apis/fetchHuobiPrices';
import fetchGeminiPrices from './apis/fetchGeminiPrices';
import fetchBybitPrices from './apis/fetchBybitPrices';
import fetchBitmartPrices from './apis/fetchBitmartPrices';
import fetchKucoinPrices from './apis/fetchKucoinPrices';
import fetchBitfinexPrices from './apis/fetchBitfinexPrices';
import fetchOkxPrices from './apis/fetchOkxPrices';
import fetchGateioPrices from './apis/fetchGateioPrices';

import './Prices.css';

const CryptoArbitrageTracker = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateArbitrage = (prices) => {
    if (prices.length < 2) return 0;
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    return ((maxPrice - minPrice) / minPrice * 100).toFixed(2);
};


const processPrices = (allPrices) => {
    const groupedPrices = {};
  
    allPrices.forEach(item => {
      if (!groupedPrices[item.symbol]) {
        groupedPrices[item.symbol] = {
          symbol: item.symbol,
          exchanges: {},
          prices: []
        };
      }
      groupedPrices[item.symbol].exchanges[item.exchange] = item.price;
      groupedPrices[item.symbol].prices.push(item.price);
    });
  
    return Object.values(groupedPrices).map(item => {
      // Find the highest and lowest prices
      const highestPrice = Math.max(...item.prices);
      const lowestPrice = Math.min(...item.prices);
  
      // Get the exchange names for highest and lowest prices
      const highestPriceExchange = Object.entries(item.exchanges).find(([exchange, price]) => price === highestPrice)[0];
      const lowestPriceExchange = Object.entries(item.exchanges).find(([exchange, price]) => price === lowestPrice)[0];
  
      return {
        ...item,
        arbitragePercent: calculateArbitrage(item.prices),
        highestPrice,
        lowestPrice,
        highestPriceExchange, // Added highest price exchange
        lowestPriceExchange  // Added lowest price exchange
      };
    });
  };
  

  const fetchAllPrices = async () => {
    setLoading(true);
    try {
      const [
        binancePrices,
        coinbasePrices,
        huobiPrices,
        geminiPrices,
        bybitPrices,
        bitmartPrices,
        kucoinPrices,
        bitfinexPrices,
        okxPrices,
        gateioPrices,
        
    ] = await Promise.all([
        fetchBinancePrices(),
        fetchCoinbasePrices(),
        fetchHuobiPrices(),
        fetchGeminiPrices(),
        fetchBybitPrices(),
        fetchBitmartPrices(),
        fetchKucoinPrices(),
        fetchBitfinexPrices(),
        fetchOkxPrices(),
        fetchGateioPrices(),
    ]);
    

    const allPrices = [
      ...binancePrices,
      ...coinbasePrices,
      ...huobiPrices,
      ...geminiPrices,
      ...bybitPrices,
      ...bitmartPrices,
      ...kucoinPrices,
      ...bitfinexPrices,
      ...okxPrices,
      ...gateioPrices,
    ];
  
      const processedData = processPrices(allPrices);
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
    fetchAllPrices();
    const interval = setInterval(fetchAllPrices, 10000);
    return () => clearInterval(interval);
  }, []);

  const sortData = (field) => {
    const sorted = [...data].sort((a, b) => b[field] - a[field]);
    setData(sorted);
  };

  if (error) {
    return (
      <div>
        <div >{error}</div>
      </div>
    );
  }

  return (
    <div className="container-prices">
      <div className="header-prices">
        <h1 className="title-prices">Crypto Arbitrage Opportunities</h1>
        <button
          onClick={fetchAllPrices}
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
              <th onClick={() => sortData('lowestPrice')}>
                Lowest <span className="sort-icon-prices">↕</span>
              </th>
              <th onClick={() => sortData('highestPrice')}>
                Highest <span className="sort-icon-prices">↕</span>
              </th>
              <th onClick={() => sortData('arbitragePercent')}>
                Arbitrage % <span className="sort-icon-prices">↕</span>
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
                  <span
                    className={
                      crypto.arbitragePercent > 1
                        ? 'arbitrage-high-prices'
                        : ''
                    }
                  >
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


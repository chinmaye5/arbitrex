import React, { useState, useEffect } from 'react';

const TRADING_PAIRS = [
  'BTC', 'ETH', 'BNB', 'XRP', 'SOL', 'ADA', 'DOGE', 'MATIC', 
  'LTC', 'DOT', 'SHIB', 'AVAX', 'UNI', 'LINK', 'XLM', 'ATOM'
];

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

  const fetchBinancePrices = async () => {
    try {
      const response = await fetch('https://api.binance.com/api/v3/ticker/price');
      const data = await response.json();
      return data
        .filter(item => TRADING_PAIRS.some(pair => item.symbol === `${pair}USDT`))
        .map(item => ({
          symbol: item.symbol.replace('USDT', ''),
          price: parseFloat(item.price),
          exchange: 'Binance',
        }));
    } catch (error) {
      console.error('Binance fetch error:', error);
      return [];
    }
  };

  const fetchCoinbasePrices = async () => {
    try {
      const symbols = TRADING_PAIRS.map(pair => `${pair}-USD`);
      const prices = await Promise.all(
        symbols.map(async (symbol) => {
          try {
            const response = await fetch(`https://api.exchange.coinbase.com/products/${symbol}/ticker`);
            const data = await response.json();
            if (data.price) {
              return {
                symbol: symbol.split('-')[0],
                price: parseFloat(data.price),
                exchange: 'Coinbase',
              };
            }
            return null;
          } catch (error) {
            console.error(`Error fetching ${symbol} from Coinbase:`, error);
            return null;
          }
        })
      );
      return prices.filter(price => price !== null);
    } catch (error) {
      console.error('Coinbase fetch error:', error);
      return [];
    }
  };

  const fetchKrakenPrices = async () => {
    try {
      const response = await fetch('https://api.kraken.com/0/public/Ticker?pair=BTCEUR,ETHEUR,XRPEUR,SOLUSD,ADAEUR,DOGEUSD');
      const data = await response.json();
      const prices = Object.keys(data.result).map(key => {
        const symbol = key.slice(0, 3); // Extract symbol (e.g., BTC)
        return {
          symbol,
          price: parseFloat(data.result[key].c[0]), // Current price
          exchange: 'Kraken',
        };
      });
      return prices;
    } catch (error) {
      console.error('Kraken fetch error:', error);
      return [];
    }
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

    return Object.values(groupedPrices).map(item => ({
      ...item,
      arbitragePercent: calculateArbitrage(item.prices),
      highestPrice: Math.max(...item.prices),
      lowestPrice: Math.min(...item.prices),
    }));
  };

  const fetchAllPrices = async () => {
    setLoading(true);
    try {
      const [binancePrices, coinbasePrices, krakenPrices] = await Promise.all([
        fetchBinancePrices(),
        fetchCoinbasePrices(),
        fetchKrakenPrices(),
      ]);

      const allPrices = [...binancePrices, ...coinbasePrices, ...krakenPrices];
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
    const interval = setInterval(fetchAllPrices, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const sortData = (field) => {
    const sorted = [...data].sort((a, b) => b[field] - a[field]);
    setData(sorted);
  };

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Crypto Arbitrage Opportunities</h2>
        <button 
          onClick={fetchAllPrices}
          style={styles.refreshButton}
          disabled={loading}
        >
          ↻ {loading && 'Refreshing...'}
        </button>
      </div>
      
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Symbol</th>
              <th style={styles.th}>Binance Price</th>
              <th style={styles.th}>Coinbase Price</th>
              <th style={styles.th}>Kraken Price</th>
              <th style={styles.th} onClick={() => sortData('highestPrice')}>
                Highest <span style={styles.sortIcon}>↕</span>
              </th>
              <th style={styles.th} onClick={() => sortData('lowestPrice')}>
                Lowest <span style={styles.sortIcon}>↕</span>
              </th>
              <th style={styles.th} onClick={() => sortData('arbitragePercent')}>
                Arbitrage % <span style={styles.sortIcon}>↕</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((crypto) => (
              <tr key={crypto.symbol}>
                <td style={styles.td}>{crypto.symbol}</td>
                <td style={styles.td}>${crypto.exchanges.Binance?.toFixed(2) || 'N/A'}</td>
                <td style={styles.td}>${crypto.exchanges.Coinbase?.toFixed(2) || 'N/A'}</td>
                <td style={styles.td}>${crypto.exchanges.Kraken?.toFixed(2) || 'N/A'}</td>
                <td style={styles.td}>${crypto.highestPrice.toFixed(2)}</td>
                <td style={styles.td}>${crypto.lowestPrice.toFixed(2)}</td>
                <td style={styles.td}>
                  <span style={crypto.arbitragePercent > 1 ? styles.arbitrageHigh : {}}>
                    {crypto.arbitragePercent}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p style={styles.loading}>Fetching new data...</p>}
      </div>
    </div>
  );
};

export default CryptoArbitrageTracker;

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  refreshButton: {
    padding: '8px 16px',
    fontSize: '1rem',
    cursor: 'pointer',
    backgroundColor: '#007BFF',
    color: '#FFF',
    border: 'none',
    borderRadius: '5px',
  },
  tableContainer: {
    marginTop: '20px',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '10px',
    textAlign: 'left',
    borderBottom: '2px solid #DDD',
    cursor: 'pointer',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #DDD',
  },
  sortIcon: {
    marginLeft: '8px',
    fontSize: '0.9rem',
  },
  arbitrageHigh: {
    color: 'green',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontSize: '1.2rem',
  },
  loading: {
    marginTop: '10px',
    fontSize: '1rem',
    color: '#666',
  },
};


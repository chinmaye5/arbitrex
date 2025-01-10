import React, { useState, useEffect } from 'react';

const styles = {
  container: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '0 10px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
  },
  refreshButton: {
    padding: '8px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '16px',
    lineHeight: '1',
    color: '#007BFF',
    transition: 'color 0.2s',
  },
  refreshButtonDisabled: {
    cursor: 'not-allowed',
    color: '#cccccc',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  th: {
    padding: '12px',
    borderBottom: '1px solid #ddd',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #ddd',
  },
  exchangeTag: {
    display: 'inline-block',
    padding: '4px 8px',
    margin: '2px',
    backgroundColor: '#e3f2fd',
    borderRadius: '16px',
    fontSize: '12px',
  },
  error: {
    color: '#e53935',
    padding: '20px',
    textAlign: 'center',
  },
  sortIcon: {
    marginLeft: '4px',
    fontSize: '12px',
  },
};

const CryptoPriceTracker = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateArbitrage = (highest, lowest) => {
    if (!highest || !lowest) return 0;
    return ((highest - lowest) / lowest * 100).toFixed(2);
  };

  const processExchangeData = (data) => {
    const cryptoMap = new Map();

    Object.entries(data).forEach(([exchange, tickers]) => {
      Object.entries(tickers).forEach(([pair, detail]) => {
        if (!cryptoMap.has(pair)) {
          cryptoMap.set(pair, {
            symbol: pair,
            exchanges: [],
            highestPrice: -Infinity,
            lowestPrice: Infinity,
            totalVolume: 0,
          });
        }

        const current = cryptoMap.get(pair);
        const price = parseFloat(detail.last || 0);
        const volume = parseFloat(detail.volume || 0);

        current.exchanges.push({
          name: exchange,
          price: price,
          volume: volume,
        });

        current.highestPrice = Math.max(current.highestPrice, price);
        current.lowestPrice = Math.min(current.lowestPrice, price);
        current.totalVolume += volume;
      });
    });

    return Array.from(cryptoMap.values()).map((item) => ({
      ...item,
      arbitragePercent: calculateArbitrage(item.highestPrice, item.lowestPrice),
    }));
  };

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.cryptowat.ch/markets/prices');
      const data = await response.json();
      const processedData = processExchangeData(data.result);
      setData(processedData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch cryptocurrency data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const sortData = (field) => {
    const sorted = [...data].sort((a, b) => b[field] - a[field]);
    setData(sorted);
  };

  const SortIcon = () => (
    <span style={styles.sortIcon}>↕</span>
  );

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
        <h2 style={styles.title}>Cryptocurrency Price Comparison</h2>
        <button
          onClick={fetchPrices}
          style={{
            ...styles.refreshButton,
            ...(loading ? styles.refreshButtonDisabled : {}),
          }}
          disabled={loading}
        >
          ↻
        </button>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Symbol</th>
              <th style={styles.th} onClick={() => sortData('totalVolume')}>
                Volume 24h <SortIcon />
              </th>
              <th style={styles.th} onClick={() => sortData('highestPrice')}>
                Highest Price <SortIcon />
              </th>
              <th style={styles.th} onClick={() => sortData('lowestPrice')}>
                Lowest Price <SortIcon />
              </th>
              <th style={styles.th} onClick={() => sortData('arbitragePercent')}>
                Arbitrage % <SortIcon />
              </th>
              <th style={styles.th}>Exchanges</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" style={{ ...styles.td, textAlign: 'center' }}>
                  Loading...
                </td>
              </tr>
            )}
            {!loading &&
              data.map((crypto) => (
                <tr key={crypto.symbol}>
                  <td style={styles.td}>{crypto.symbol}</td>
                  <td style={styles.td}>{crypto.totalVolume.toLocaleString()}</td>
                  <td style={styles.td}>${crypto.highestPrice.toFixed(2)}</td>
                  <td style={styles.td}>${crypto.lowestPrice.toFixed(2)}</td>
                  <td style={styles.td}>{crypto.arbitragePercent}%</td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {crypto.exchanges.map((exchange, idx) => (
                        <span key={idx} style={styles.exchangeTag}>
                          {exchange.name}: ${exchange.price.toFixed(2)}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoPriceTracker;

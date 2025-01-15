import React, { useEffect, useState } from 'react';

const TRADING_PAIRS = [
  'BTC', 'ETH', 'BNB', 'XRP', 'SOL', 'ADA', 'DOGE', 'MATIC',
  'LTC', 'DOT', 'SHIB', 'AVAX', 'UNI', 'LINK', 'XLM', 'ATOM',
  'APT', 'ARB', 'FIL', 'ALGO', 'ICP', 'SAND', 'APE', 'FTM', 
  'EOS', 'AAVE', 'THETA', 'NEAR', 'MANA', 'GALA', 'QNT', 'VET',
  'CRV', 'KLAY', 'IMX', 'CHZ', 'SNX', 'ENJ', 'STX', 'FLOW', 
  'XTZ', 'EGLD', 'ZIL', 'KAVA', 'LDO', 'RUNE', 'DYDX', 'CAKE'
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

  const fetchHuobiPrices = async () => {
    try {
      const symbols = TRADING_PAIRS.map(pair => pair.toLowerCase() + 'usdt');
      const prices = await Promise.all(
        symbols.map(async (symbol) => {
          try {
            const response = await fetch(`https://api.huobi.pro/market/detail/merged?symbol=${symbol}`);
            const data = await response.json();
            if (data.status === 'ok' && data.tick) {
              return {
                symbol: symbol.replace('usdt', '').toUpperCase(),
                price: parseFloat(data.tick.close),
                exchange: 'Huobi',
              };
            }
            return null;
          } catch (error) {
            console.error(`Error fetching ${symbol} from Huobi:`, error);
            return null;
          }
        })
      );
      return prices.filter(price => price !== null);
    } catch (error) {
      console.error('Huobi fetch error:', error);
      return [];
    }
  };

  const fetchGeminiPrices = async () => {
    try {
      const symbols = TRADING_PAIRS.map(pair => pair.toLowerCase() + 'usd');
      const prices = await Promise.all(
        symbols.map(async (symbol) => {
          try {
            const response = await fetch(`https://api.gemini.com/v1/pubticker/${symbol}`);
            const data = await response.json();
            if (data.last) {
              return {
                symbol: symbol.replace('usd', '').toUpperCase(),
                price: parseFloat(data.last),
                exchange: 'Gemini',
              };
            }
            return null;
          } catch (error) {
            console.error(`Error fetching ${symbol} from Gemini:`, error);
            return null;
          }
        })
      );
      return prices.filter(price => price !== null);
    } catch (error) {
      console.error('Gemini fetch error:', error);
      return [];
    }
  };

  const fetchBybitPrices = async () => {
    try {
      const response = await fetch('https://api.bybit.com/v5/market/tickers?category=spot');
      const data = await response.json();
      if (data.retCode === 0 && data.result.list) {
        return data.result.list
          .filter(item => TRADING_PAIRS.some(pair => item.symbol === `${pair}USDT`))
          .map(item => ({
            symbol: item.symbol.replace('USDT', ''),
            price: parseFloat(item.lastPrice),
            exchange: 'Bybit',
          }));
      }
      return [];
    } catch (error) {
      console.error('Bybit fetch error:', error);
      return [];
    }
  };

  const fetchBitmartPrices = async () => {
    try {
      const promises = TRADING_PAIRS.map(async (pair) => {
        try {
          const symbol = `${pair}_USDT`;
          const response = await fetch(`https://api-cloud.bitmart.com/spot/v1/ticker?symbol=${symbol}`, {
            headers: {
              'Content-Type': 'application/json',
              'X-BM-USER-AGENT': 'api-arbitrage-tracker'
            }
          });
          const data = await response.json();
          if (data.data && data.data.tickers && data.data.tickers[0]) {
            return {
              symbol: pair,
              price: parseFloat(data.data.tickers[0].last_price),
              exchange: 'Bitmart'
            };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching ${pair} from Bitmart:`, error);
          return null;
        }
      });
      const results = await Promise.all(promises);
      return results.filter(result => result !== null);
    } catch (error) {
      console.error('Bitmart fetch error:', error);
      return [];
    }
  };

  const fetchKucoinPrices = async () => {
    try {
      const response = await fetch('https://api.kucoin.com/api/v1/market/allTickers');
      const data = await response.json();
      
      if (data.data && data.data.ticker) {
        return TRADING_PAIRS.map(pair => {
          const symbol = `${pair}-USDT`;
          const ticker = data.data.ticker.find(t => t.symbol === symbol);
          if (ticker && ticker.last) {
            return {
              symbol: pair,
              price: parseFloat(ticker.last),
              exchange: 'KuCoin'
            };
          }
          return null;
        }).filter(item => item !== null);
      }
      return [];
    } catch (error) {
      console.error('KuCoin fetch error:', error);
      return [];
    }
  };


  const fetchBitfinexPrices = async () => {
    try {
      const promises = TRADING_PAIRS.map(async pair => {
        try {
          const symbol = `t${pair}USD`;
          const response = await fetch(`https://api-pub.bitfinex.com/v2/ticker/${symbol}`);
          const data = await response.json();
          if (Array.isArray(data) && data.length >= 7) {
            return {
              symbol: pair,
              price: parseFloat(data[6]),
              exchange: 'Bitfinex'
            };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching ${pair} from Bitfinex:`, error);
          return null;
        }
      });
      const results = await Promise.all(promises);
      return results.filter(result => result !== null);
    } catch (error) {
      console.error('Bitfinex fetch error:', error);
      return [];
    }
  };

  const fetchOkxPrices = async () => {
    try {
      const promises = TRADING_PAIRS.map(async pair => {
        try {
          const symbol = `${pair}-USDT`;
          const response = await fetch(`https://www.okx.com/api/v5/market/ticker?instId=${symbol}`);
          const data = await response.json();
          if (data.data && data.data[0] && data.data[0].last) {
            return {
              symbol: pair,
              price: parseFloat(data.data[0].last),
              exchange: 'OKX'
            };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching ${pair} from OKX:`, error);
          return null;
        }
      });
      const results = await Promise.all(promises);
      return results.filter(result => result !== null);
    } catch (error) {
      console.error('OKX fetch error:', error);
      return [];
    }
  };

  const fetchGateioPrices = async () => {
    try {
      const promises = TRADING_PAIRS.map(async pair => {
        try {
          const symbol = `${pair}_USDT`;
          const response = await fetch(`https://api.gateio.ws/api/v4/spot/tickers`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
          const data = await response.json();
          const ticker = data.find(t => t.currency_pair === symbol);
          if (ticker && ticker.last) {
            return {
              symbol: pair,
              price: parseFloat(ticker.last),
              exchange: 'Gate.io'
            };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching ${pair} from Gate.io:`, error);
          return null;
        }
      });
      const results = await Promise.all(promises);
      return results.filter(result => result !== null);
    } catch (error) {
      console.error('Gate.io fetch error:', error);
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
              <th style={styles.th}>Huobi Price</th>
              <th style={styles.th}>Gemini Price</th>
              <th style={styles.th}>Bybit Price</th>
              <th style={styles.th}>Bitmart Price</th>
              <th style={styles.th}>KuCoin Price</th>
              <th style={styles.th}>Bitfinex Price</th>
              <th style={styles.th}>OKX Price</th>
              <th style={styles.th}>Gate.io Price</th>
              
              <th style={styles.th} onClick={() => sortData('lowestPrice')}>
                Lowest <span style={styles.sortIcon}>↕</span>
              </th>
              <th style={styles.th} onClick={() => sortData('highestPrice')}>
                Highest <span style={styles.sortIcon}>↕</span>
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
                <td style={styles.td}>${crypto.exchanges.Huobi?.toFixed(2) || 'N/A'}</td>
                <td style={styles.td}>${crypto.exchanges.Gemini?.toFixed(2) || 'N/A'}</td>
                <td style={styles.td}>${crypto.exchanges.Bybit?.toFixed(2) || 'N/A'}</td>
                <td style={styles.td}>${crypto.exchanges.Bitmart?.toFixed(2) || 'N/A'}</td>
                <td style={styles.td}>${crypto.exchanges.Kucoin?.toFixed(2) || 'N/A'}</td>
                <td style={styles.td}>${crypto.exchanges.Bitfinex?.toFixed(2) || 'N/A'}</td>
                <td style={styles.td}>${crypto.exchanges.OKX?.toFixed(2) || 'N/A'}</td>
                <td style={styles.td}>${crypto.exchanges['Gate.io']?.toFixed(2) || 'N/A'}</td>
                <td style={{ ...styles.td, color: 'green', fontWeight: 'bold' }}>
                  ${crypto.lowestPrice.toFixed(4)} ({crypto.lowestPriceExchange})
                </td>
                <td style={{ ...styles.td, color: 'red', fontWeight: 'bold' }}>
                  ${crypto.highestPrice.toFixed(4)} ({crypto.highestPriceExchange})
                </td>
                

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


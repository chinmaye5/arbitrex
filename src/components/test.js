import React, { useEffect, useState } from 'react';

const BitfinexTickers = () => {
  const [tickers, setTickers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickers = async () => {
      try {
        const response = await fetch('https://api-pub.bitfinex.com/v2/tickers?symbols=ALL');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setTickers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Bitfinex Tickers</h1>
      <table border="1" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Last Price</th>
            <th>Daily Change</th>
            <th>Daily Change (%)</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          {tickers.map((ticker, index) => (
            <tr key={index}>
              <td>{ticker[0]}</td>
              <td>{ticker[7]}</td>
              <td>{ticker[5]}</td>
              <td>{(ticker[6] * 100).toFixed(2)}%</td>
              <td>{ticker[8]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BitfinexTickers;

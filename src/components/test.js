import React, { useState, useEffect } from 'react';

const PriceComparisonDashboard = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/prices');
      if (!response.ok) {
        throw new Error('Failed to fetch prices');
      }
      const data = await response.json();
      setPrices(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    return price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    });
  };

  // Group prices by symbol
  const groupedPrices = prices.reduce((acc, item) => {
    if (!acc[item.symbol]) {
      acc[item.symbol] = {};
    }
    acc[item.symbol][item.exchange] = item.price;
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Exchange Price Comparison</h1>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-sm text-gray-500">
              Updated: {lastUpdated}
            </span>
          )}
          <button
            onClick={fetchPrices}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error ? (
        <div className="text-red-500 p-4 text-center">
          Error: {error}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead> 
              <tr className="bg-gray-50">
                <th className="p-3 text-left font-semibold">Symbol</th>
                <th className="p-3 text-right font-semibold">Gate.io</th>
                <th className="p-3 text-right font-semibold">Bitfinex</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedPrices).map(([symbol, prices]) => (
                <tr key={symbol} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{symbol}</td>
                  <td className="p-3 text-right font-mono">
                    {prices['Gate.io'] ? formatPrice(prices['Gate.io']) : '-'}
                  </td>
                  <td className="p-3 text-right font-mono">
                    {prices['Bitfinex'] ? formatPrice(prices['Bitfinex']) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PriceComparisonDashboard;
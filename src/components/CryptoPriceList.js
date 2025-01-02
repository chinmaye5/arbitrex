import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CryptoPriceList = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get('API_ENDPOINT_HERE'); // Replace with actual API endpoint
        setPrices(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  const identifyArbitrageOpportunities = () => {
    const arbitrageOpportunities = [];
  
    // Group prices by cryptocurrency
    const groupedPrices = prices.reduce((acc, price) => {
      if (!acc[price.name]) {
        acc[price.name] = [];
      }
      acc[price.name].push({ exchange: price.exchange, price: price.current_price });
      return acc;
    }, {});
  
    // Find arbitrage opportunities
    for (const [crypto, priceList] of Object.entries(groupedPrices)) {
      if (priceList.length > 1) {
        const sortedPrices = priceList.sort((a, b) => a.price - b.price);
        const lowest = sortedPrices[0];
        const highest = sortedPrices[sortedPrices.length - 1];
  
        const potentialProfit = highest.price - lowest.price;
        if (potentialProfit > 0) {
          arbitrageOpportunities.push({
            crypto,
            buyFrom: lowest.exchange,
            sellTo: highest.exchange,
            profit: potentialProfit,
          });
        }
      }
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching prices: {error.message}</div>;

  return (
    <div>
      <h2>Cryptocurrency Prices</h2>
      <ul>
        {prices.map((price) => (
          <li key={price.id}>
            {price.name}: ${price.current_price} (Exchange: {price.exchange})
          </li>
        ))}
      </ul>
      {identifyArbitrageOpportunities()}
      <div>
      <h3>Arbitrage Opportunities</h3>
      <ul>
        {arbitrageOpportunities.map((opportunity, index) => (
          <li key={index}>
            {opportunity.crypto}: Buy from {opportunity.buyFrom} at $
            {opportunity.profit.toFixed(2)} and sell to {opportunity.sellTo} for a profit of $
            {opportunity.profit.toFixed(2)}.
          </li>
        ))}
      </ul>
    </div>
    </div>
    
  );
};

export default CryptoPriceList;
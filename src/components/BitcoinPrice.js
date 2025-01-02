import React, { useState, useEffect } from "react";

const BitcoinPrice = () => {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    const fetchBTCPrice = async () => {
      try {
        const response = await fetch(
          "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
        );
        const data = await response.json();
        setPrice(data.price);
      } catch (error) {
        console.error("Error fetching BTC price:", error);
      }
    };

    fetchBTCPrice();
    const interval = setInterval(fetchBTCPrice, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Bitcoin Price</h1>
      {price ? (
        <p style={{ fontSize: "24px", fontWeight: "bold" }}>
          ${parseFloat(price).toFixed(2)}
        </p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default BitcoinPrice;

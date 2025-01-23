import axios from 'axios';

const TRADING_PAIRS = [
  'BTC', 'ETH', 'BNB', 'XRP', 'SOL', 'ADA', 'DOGE', 'MATIC',
  'LTC', 'DOT', 'SHIB', 'AVAX', 'UNI', 'LINK', 'XLM', 'ATOM',
  'APT', 'ARB', 'FIL', 'ALGO', 'ICP', 'SAND', 'APE', 'FTM', 
  'EOS', 'AAVE', 'THETA', 'NEAR', 'MANA', 'GALA', 'QNT', 'VET',
  'CRV', 'KLAY', 'IMX', 'CHZ', 'SNX', 'ENJ', 'STX', 'FLOW', 
  'XTZ', 'EGLD', 'ZIL', 'KAVA', 'LDO', 'RUNE', 'DYDX', 'CAKE'
];

const fetchBitfinexPrices = async () => {
  try {
    // Fetch all tickers from Bitfinex
    const response = await axios.get('https://api-pub.bitfinex.com/v2/tickers?symbols=ALL');

    // Filter for the relevant trading pairs
    const filteredData = response.data
      .filter(ticker => TRADING_PAIRS.includes(ticker[0].slice(1, -3))) // Match pairs like 'tBTCUSD'
      .map(ticker => ({
        symbol: ticker[0].slice(1, -3), // Extract the pair symbol, e.g., 'BTC' from 'tBTCUSD'
        price: parseFloat(ticker[7]),  // Bitfinex index 7 is the last price
        exchange: 'Bitfinex',
      }));

    return filteredData;
  } catch (error) {
    console.error('Error fetching prices from Bitfinex:', error);
    return [];
  }
};

export default fetchBitfinexPrices;

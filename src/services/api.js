import axios from 'axios';

const API_URLS = {
  binance: 'https://api.binance.com/api/v3/ticker/price',
  coinbase: 'https://api.coinbase.com/v2/prices/spot?currency=USD',
  kraken: 'https://api.kraken.com/0/public/Ticker?pair=XXBTZUSD',
};

export const fetchBinancePrices = async () => {
  const response = await axios.get(API_URLS.binance);
  return response.data;
};

export const fetchCoinbasePrices = async () => {
  const response = await axios.get(API_URLS.coinbase);
  return response.data.data;
};

export const fetchKrakenPrices = async () => {
  const response = await axios.get(API_URLS.kraken);
  return response.data.result;
};
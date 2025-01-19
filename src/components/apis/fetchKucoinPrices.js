const TRADING_PAIRS = [
  'BTC', 'ETH', 'BNB', 'XRP', 'SOL', 'ADA', 'DOGE', 'MATIC',
  'LTC', 'DOT', 'SHIB', 'AVAX', 'UNI', 'LINK', 'XLM', 'ATOM',
  'APT', 'ARB', 'FIL', 'ALGO', 'ICP', 'SAND', 'APE', 'FTM', 
  'EOS', 'AAVE', 'THETA', 'NEAR', 'MANA', 'GALA', 'QNT', 'VET',
  'CRV', 'KLAY', 'IMX', 'CHZ', 'SNX', 'ENJ', 'STX', 'FLOW', 
  'XTZ', 'EGLD', 'ZIL', 'KAVA', 'LDO', 'RUNE', 'DYDX', 'CAKE'
];

const fetchKucoinPrices = async () => {
  try {
    // Use a CORS proxy here (CORS Anywhere or any other proxy you prefer)
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // Proxy URL
    const targetUrl = 'https://api.kucoin.com/api/v1/market/allTickers'; // KuCoin API

    // Fetch data through the CORS proxy
    const response = await fetch(proxyUrl + targetUrl);
    const data = await response.json();

    if (data.code !== '200000') {
      throw new Error('KuCoin API error');
    }

    return data.data.ticker
      .filter(item => TRADING_PAIRS.some(pair => item.symbol === `${pair}-USDT`))
      .map(item => ({
        symbol: item.symbol.replace('-USDT', ''),
        price: parseFloat(item.last),
        exchange: 'KuCoin',
      }));
  } catch (error) {
    console.error('KuCoin fetch error:', error);
    return [];
  }
};

export default fetchKucoinPrices;

const TRADING_PAIRS = [
    'BTC', 'ETH', 'BNB', 'XRP', 'SOL', 'ADA', 'DOGE', 'MATIC',
    'LTC', 'DOT', 'SHIB', 'AVAX', 'UNI', 'LINK', 'XLM', 'ATOM',
    'APT', 'ARB', 'FIL', 'ALGO', 'ICP', 'SAND', 'APE', 'FTM', 
    'EOS', 'AAVE', 'THETA', 'NEAR', 'MANA', 'GALA', 'QNT', 'VET',
    'CRV', 'KLAY', 'IMX', 'CHZ', 'SNX', 'ENJ', 'STX', 'FLOW', 
    'XTZ', 'EGLD', 'ZIL', 'KAVA', 'LDO', 'RUNE', 'DYDX', 'CAKE'
  ];

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

export default fetchBybitPrices;
const TRADING_PAIRS = [
    'BTC', 'ETH', 'BNB', 'XRP', 'SOL', 'ADA', 'DOGE', 'MATIC',
    'LTC', 'DOT', 'SHIB', 'AVAX', 'UNI', 'LINK', 'XLM', 'ATOM',
    'APT', 'ARB', 'FIL', 'ALGO', 'ICP', 'SAND', 'APE', 'FTM', 
    'EOS', 'AAVE', 'THETA', 'NEAR', 'MANA', 'GALA', 'QNT', 'VET',
    'CRV', 'KLAY', 'IMX', 'CHZ', 'SNX', 'ENJ', 'STX', 'FLOW', 
    'XTZ', 'EGLD', 'ZIL', 'KAVA', 'LDO', 'RUNE', 'DYDX', 'CAKE'
  ];
  
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
  
  export default fetchBinancePrices;
  
const TRADING_PAIRS = [
    'BTC', 'ETH', 'BNB', 'XRP', 'SOL', 'ADA', 'DOGE', 'MATIC',
    'LTC', 'DOT', 'SHIB', 'AVAX', 'UNI', 'LINK', 'XLM', 'ATOM',
    'APT', 'ARB', 'FIL', 'ALGO', 'ICP', 'SAND', 'APE', 'FTM', 
    'EOS', 'AAVE', 'THETA', 'NEAR', 'MANA', 'GALA', 'QNT', 'VET',
    'CRV', 'KLAY', 'IMX', 'CHZ', 'SNX', 'ENJ', 'STX', 'FLOW', 
    'XTZ', 'EGLD', 'ZIL', 'KAVA', 'LDO', 'RUNE', 'DYDX', 'CAKE'
  ];


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

  export default fetchCoinbasePrices;
const TRADING_PAIRS = [
    'BTC', 'ETH', 'BNB', 'XRP', 'SOL', 'ADA', 'DOGE', 'MATIC',
    'LTC', 'DOT', 'SHIB', 'AVAX', 'UNI', 'LINK', 'XLM', 'ATOM',
    'APT', 'ARB', 'FIL', 'ALGO', 'ICP', 'SAND', 'APE', 'FTM', 
    'EOS', 'AAVE', 'THETA', 'NEAR', 'MANA', 'GALA', 'QNT', 'VET',
    'CRV', 'KLAY', 'IMX', 'CHZ', 'SNX', 'ENJ', 'STX', 'FLOW', 
    'XTZ', 'EGLD', 'ZIL', 'KAVA', 'LDO', 'RUNE', 'DYDX', 'CAKE'
  ];

const fetchHuobiPrices = async () => {
    try {
      const symbols = TRADING_PAIRS.map(pair => pair.toLowerCase() + 'usdt');
      const prices = await Promise.all(
        symbols.map(async (symbol) => {
          try {
            const response = await fetch(`https://api.huobi.pro/market/detail/merged?symbol=${symbol}`);
            const data = await response.json();
            if (data.status === 'ok' && data.tick) {
              return {
                symbol: symbol.replace('usdt', '').toUpperCase(),
                price: parseFloat(data.tick.close),
                exchange: 'Huobi',
              };
            }
            return null;
          } catch (error) {
            console.error(`Error fetching ${symbol} from Huobi:`, error);
            return null;
          }
        })
      );
      return prices.filter(price => price !== null);
    } catch (error) {
      console.error('Huobi fetch error:', error);
      return [];
    }
};

export default fetchHuobiPrices;
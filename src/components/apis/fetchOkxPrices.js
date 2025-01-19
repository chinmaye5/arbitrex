const TRADING_PAIRS = [
    'BTC', 'ETH', 'BNB', 'XRP', 'SOL', 'ADA', 'DOGE', 'MATIC',
    'LTC', 'DOT', 'SHIB', 'AVAX', 'UNI', 'LINK', 'XLM', 'ATOM',
    'APT', 'ARB', 'FIL', 'ALGO', 'ICP', 'SAND', 'APE', 'FTM', 
    'EOS', 'AAVE', 'THETA', 'NEAR', 'MANA', 'GALA', 'QNT', 'VET',
    'CRV', 'KLAY', 'IMX', 'CHZ', 'SNX', 'ENJ', 'STX', 'FLOW', 
    'XTZ', 'EGLD', 'ZIL', 'KAVA', 'LDO', 'RUNE', 'DYDX', 'CAKE'
];

const fetchOkxPrices = async () => {
    try {
      const promises = TRADING_PAIRS.map(async pair => {
        try {
          const symbol = `${pair}-USDT`;
          const response = await fetch(`https://www.okx.com/api/v5/market/ticker?instId=${symbol}`);
          const data = await response.json();
          if (data.data && data.data[0] && data.data[0].last) {
            return {
              symbol: pair,
              price: parseFloat(data.data[0].last),
              exchange: 'OKX'
            };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching ${pair} from OKX:`, error);
          return null;
        }
      });
      const results = await Promise.all(promises);
      return results.filter(result => result !== null);
    } catch (error) {
      console.error('OKX fetch error:', error);
      return [];
    }
};

export default fetchOkxPrices;
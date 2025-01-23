const TRADING_PAIRS = [
    'BTC', 'ETH', 'BNB', 'XRP', 'SOL', 'ADA', 'DOGE', 'MATIC',
    'LTC', 'DOT', 'SHIB', 'AVAX', 'UNI', 'LINK', 'XLM', 'ATOM',
    'APT', 'ARB', 'FIL', 'ALGO', 'ICP', 'SAND', 'APE', 'FTM', 
    'EOS', 'AAVE', 'THETA', 'NEAR', 'MANA', 'GALA', 'QNT', 'VET',
    'CRV', 'KLAY', 'IMX', 'CHZ', 'SNX', 'ENJ', 'STX', 'FLOW', 
    'XTZ', 'EGLD', 'ZIL', 'KAVA', 'LDO', 'RUNE', 'DYDX', 'CAKE'
];

const fetchGateioPrices = async () => {
    try {
      const promises = TRADING_PAIRS.map(async pair => {
        try {
          const symbol = `${pair}_USDT`;
          const response = await fetch(`https://api.gateio.ws/api/v4/spot/tickers`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
          const data = await response.json();
          const ticker = data.find(t => t.currency_pair === symbol);
          if (ticker && ticker.last) {
            return {
              symbol: pair,
              price: parseFloat(ticker.last),
              exchange: 'Gate.io'
            };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching ${pair} from Gate.io:`, error);
          return null;
        }
      });
      const results = await Promise.all(promises);
      return results.filter(result => result !== null);
    } catch (error) {
      console.error('Gate.io fetch error:', error);
      return [];
    }
};

export default fetchGateioPrices;
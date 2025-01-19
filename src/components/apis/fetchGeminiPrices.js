const TRADING_PAIRS = [
    'BTC', 'ETH', 'BNB', 'XRP', 'SOL', 'ADA', 'DOGE', 'MATIC',
    'LTC', 'DOT', 'SHIB', 'AVAX', 'UNI', 'LINK', 'XLM', 'ATOM',
    'APT', 'ARB', 'FIL', 'ALGO', 'ICP', 'SAND', 'APE', 'FTM', 
    'EOS', 'AAVE', 'THETA', 'NEAR', 'MANA', 'GALA', 'QNT', 'VET',
    'CRV', 'KLAY', 'IMX', 'CHZ', 'SNX', 'ENJ', 'STX', 'FLOW', 
    'XTZ', 'EGLD', 'ZIL', 'KAVA', 'LDO', 'RUNE', 'DYDX', 'CAKE'
  ];

const fetchGeminiPrices = async () => {
    try {
      const symbols = TRADING_PAIRS.map(pair => pair.toLowerCase() + 'usd');
      const prices = await Promise.all(
        symbols.map(async (symbol) => {
          try {
            const response = await fetch(`https://api.gemini.com/v1/pubticker/${symbol}`);
            const data = await response.json();
            if (data.last) {
              return {
                symbol: symbol.replace('usd', '').toUpperCase(),
                price: parseFloat(data.last),
                exchange: 'Gemini',
              };
            }
            return null;
          } catch (error) {
            console.error(`Error fetching ${symbol} from Gemini:`, error);
            return null;
          }
        })
      );
      return prices.filter(price => price !== null);
    } catch (error) {
      console.error('Gemini fetch error:', error);
      return [];
    }
};

export default fetchGeminiPrices;
const TRADING_PAIRS = [
    'BTC', 'ETH', 'BNB', 'XRP', 'SOL', 'ADA', 'DOGE', 'MATIC',
    'LTC', 'DOT', 'SHIB', 'AVAX', 'UNI', 'LINK', 'XLM', 'ATOM',
    'APT', 'ARB', 'FIL', 'ALGO', 'ICP', 'SAND', 'APE', 'FTM', 
    'EOS', 'AAVE', 'THETA', 'NEAR', 'MANA', 'GALA', 'QNT', 'VET',
    'CRV', 'KLAY', 'IMX', 'CHZ', 'SNX', 'ENJ', 'STX', 'FLOW', 
    'XTZ', 'EGLD', 'ZIL', 'KAVA', 'LDO', 'RUNE', 'DYDX', 'CAKE'
];

const fetchBitmartPrices = async () => {
    try {
        const response = await fetch('https://api-cloud.bitmart.com/spot/v1/ticker');
        const data = await response.json();
        
        // Bitmart returns data in a different structure with a 'data' object containing 'tickers' array
        if (!data.data || !data.data.tickers) {
            throw new Error('Invalid response structure from Bitmart');
        }

        return data.data.tickers
            .filter(item => TRADING_PAIRS.some(pair => item.symbol === `${pair}_USDT`))
            .map(item => ({
                symbol: item.symbol.split('_')[0],
                price: parseFloat(item.last_price),
                exchange: 'Bitmart',
            }));
    } catch (error) {
        console.error('Bitmart fetch error:', error);
        return [];
    }
};

export default fetchBitmartPrices;
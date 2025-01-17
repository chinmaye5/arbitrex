const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5000;

// Mapping between standard symbols and exchange-specific symbols
const SYMBOL_MAPPING = {
    'BTC': { gateio: 'BTC_USDT', bitfinex: 'tBTCUSD' },
    'ETH': { gateio: 'ETH_USDT', bitfinex: 'tETHUSD' },
    'XRP': { gateio: 'XRP_USDT', bitfinex: 'tXRPUSD' },
    'SOL': { gateio: 'SOL_USDT', bitfinex: 'tSOLUSD' },
    'LTC': { gateio: 'LTC_USDT', bitfinex: 'tLTCUSD' },
    'DOGE': { gateio: 'DOGE_USDT', bitfinex: 'tDOGE:USD' },
    'MATIC': { gateio: 'MATIC_USDT', bitfinex: 'tMATIC:USD' },
    'LINK': { gateio: 'LINK_USDT', bitfinex: 'tLINK:USD' },
    'DOT': { gateio: 'DOT_USDT', bitfinex: 'tDOTUSD' },
    'ADA': { gateio: 'ADA_USDT', bitfinex: 'tADAUSD' },
    'UNI': { gateio: 'UNI_USDT', bitfinex: 'tUNIUSD' },
    'AVAX': { gateio: 'AVAX_USDT', bitfinex: 'tAVAX:USD' },
    'ATOM': { gateio: 'ATOM_USDT', bitfinex: 'tATOMUSD' },
    'FIL': { gateio: 'FIL_USDT', bitfinex: 'tFILUSD' },
    'EOS': { gateio: 'EOS_USDT', bitfinex: 'tEOSUSD' },
    'AAVE': { gateio: 'AAVE_USDT', bitfinex: 'tAAVE:USD' },
    'XLM': { gateio: 'XLM_USDT', bitfinex: 'tXLMUSD' },
    'APT': { gateio: 'APT_USDT', bitfinex: 'tAPTUSD' },
    'NEAR': { gateio: 'NEAR_USDT', bitfinex: 'tNEAR:USD' },
    'CRV': { gateio: 'CRV_USDT', bitfinex: 'tCRV:USD' },
    'SNX': { gateio: 'SNX_USDT', bitfinex: 'tSNXUSD' }
    // Add more mappings as needed
};

app.use(cors());

app.get('/api/prices', async (req, res) => {
    try {
        // Fetch from both exchanges simultaneously
        const [gateioResponse, bitfinexResponse] = await Promise.all([
            axios.get('https://api.gateio.ws/api/v4/spot/tickers'),
            axios.get('https://api-pub.bitfinex.com/v2/tickers?symbols=ALL')
        ]);

        // Create lookup objects for both exchanges
        const gateioLookup = {};
        gateioResponse.data.forEach(ticker => {
            gateioLookup[ticker.currency_pair] = parseFloat(ticker.last);
        });

        const bitfinexLookup = {};
        bitfinexResponse.data.forEach(ticker => {
            bitfinexLookup[ticker[0]] = parseFloat(ticker[7]);
        });

        // Compile final price data
        const priceData = [];
        
        for (const [standardSymbol, mappings] of Object.entries(SYMBOL_MAPPING)) {
            const gateioPrice = gateioLookup[mappings.gateio];
            const bitfinexPrice = bitfinexLookup[mappings.bitfinex];
            
            // Only include if we have prices from both exchanges
            if (gateioPrice && bitfinexPrice) {
                priceData.push({
                    symbol: standardSymbol,
                    gateio: gateioPrice,
                    bitfinex: bitfinexPrice,
                    priceDiff: ((gateioPrice - bitfinexPrice) / bitfinexPrice * 100).toFixed(2)
                });
            }
        }

        // Sort by symbol
        priceData.sort((a, b) => a.symbol.localeCompare(b.symbol));

        res.json(priceData);
    } catch (error) {
        console.error('Error fetching prices:', error);
        res.status(500).json({ error: 'Failed to fetch prices' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
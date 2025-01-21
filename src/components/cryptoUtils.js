import fetchBinancePrices from './apis/fetchBinancePrices'
import fetchCoinbasePrices from './apis/fetchCoinbasePrices'
import fetchHuobiPrices from './apis/fetchHuobiPrices';
import fetchGeminiPrices from './apis/fetchGeminiPrices';
import fetchBybitPrices from './apis/fetchBybitPrices';
import fetchBitmartPrices from './apis/fetchBitmartPrices';
import fetchKucoinPrices from './apis/fetchKucoinPrices';
import fetchBitfinexPrices from './apis/fetchBitfinexPrices';
import fetchOkxPrices from './apis/fetchOkxPrices';
import fetchGateioPrices from './apis/fetchGateioPrices';
// cryptoUtils.js
export const calculateArbitrage = (prices) => {
    if (prices.length < 2) return 0;
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    return ((maxPrice - minPrice) / minPrice * 100).toFixed(2);
  };
  
  export const sortPriceData = (data, field, direction = 'desc') => {
    if (!field) return data;
    
    return [...data].sort((a, b) => {
      const comparison = direction === 'desc' ? b[field] - a[field] : a[field] - b[field];
      return comparison;
    });
  };
  
  export const processPrices = (allPrices, sortField = null, sortDirection = 'desc') => {
    const groupedPrices = {};
  
    allPrices.forEach(item => {
      if (!groupedPrices[item.symbol]) {
        groupedPrices[item.symbol] = {
          symbol: item.symbol,
          exchanges: {},
          prices: []
        };
      }
      groupedPrices[item.symbol].exchanges[item.exchange] = item.price;
      groupedPrices[item.symbol].prices.push(item.price);
    });
  
    const processedData = Object.values(groupedPrices).map(item => {
      const highestPrice = Math.max(...item.prices);
      const lowestPrice = Math.min(...item.prices);
      const highestPriceExchange = Object.entries(item.exchanges).find(([exchange, price]) => price === highestPrice)[0];
      const lowestPriceExchange = Object.entries(item.exchanges).find(([exchange, price]) => price === lowestPrice)[0];
  
      return {
        ...item,
        arbitragePercent: calculateArbitrage(item.prices),
        highestPrice,
        lowestPrice,
        highestPriceExchange,
        lowestPriceExchange
      };
    });
  
    return sortField ? sortPriceData(processedData, sortField, sortDirection) : processedData;
  };
  
  export const fetchAllPrices = async (sortField = null, sortDirection = 'desc') => {
    try {
      const [
        binancePrices,
        coinbasePrices,
        huobiPrices,
        geminiPrices,
        bybitPrices,
        bitmartPrices,
        kucoinPrices,
        bitfinexPrices,
        okxPrices,
        gateioPrices,
      ] = await Promise.all([
        fetchBinancePrices(),
        fetchCoinbasePrices(),
        fetchHuobiPrices(),
        fetchGeminiPrices(),
        fetchBybitPrices(),
        fetchBitmartPrices(),
        fetchKucoinPrices(),
        fetchBitfinexPrices(),
        fetchOkxPrices(),
        fetchGateioPrices(),
      ]);
  
      const allPrices = [
        ...binancePrices,
        ...coinbasePrices,
        ...huobiPrices,
        ...geminiPrices,
        ...bybitPrices,
        ...bitmartPrices,
        ...kucoinPrices,
        ...bitfinexPrices,
        ...okxPrices,
        ...gateioPrices,
      ];
  
      return processPrices(allPrices, sortField, sortDirection);
    } catch (error) {
      throw new Error('Failed to fetch cryptocurrency data: ' + error.message);
    }
  };
 
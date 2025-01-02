import axios from 'axios';
//public available apis of major crypto CEX
const ENDPOINTS = {
  BINANCE: 'https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT',
  COINBASE: 'https://api.coinbase.com/v2/prices/BTC-USD/spot',
  KRAKEN: 'https://api.kraken.com/0/public/Ticker?pair=XBTUSD',
  BITFINEX: 'https://api-pub.bitfinex.com/v2/ticker/tBTCUSD',
  GEMINI: 'https://api.gemini.com/v1/pubticker/btcusd',
  KUCOIN: 'https://api.kucoin.com/api/v1/market/stats?symbol=BTC-USDT',
  HUOBI: 'https://api.huobi.pro/market/detail/merged?symbol=btcusdt',
  BYBIT: 'https://api.bybit.com/v2/public/tickers?symbol=BTCUSD',
  OKEX: 'https://www.okex.com/api/v5/market/ticker?instId=BTC-USDT',
  GATE_IO: 'https://api.gateio.ws/api/v4/spot/tickers?currency_pair=BTC_USDT',
  BITSTAMP: 'https://www.bitstamp.net/api/v2/ticker/btcusd/',
  FTX: 'https://ftx.com/api/markets/BTC/USD'
};

class CryptoService {
  async getBinancePrice() {
    try {
      const response = await axios.get(ENDPOINTS.BINANCE);
      return {
        exchange: 'Binance',
        price: parseFloat(response.data.lastPrice),
        change24h: parseFloat(response.data.priceChangePercent),
        volume: parseFloat(response.data.volume)
      };
    } catch (error) {
      console.error('Binance API Error:', error);
      throw error;
    }
  }

  async getCoinbasePrice() {
    try {
      const response = await axios.get(ENDPOINTS.COINBASE);
      const prev24h = await axios.get(`${ENDPOINTS.COINBASE}?timestamp=${Date.now() - 24 * 60 * 60 * 1000}`);
      const currentPrice = parseFloat(response.data.data.amount);
      const prevPrice = parseFloat(prev24h.data.data.amount);
      const change24h = ((currentPrice - prevPrice) / prevPrice) * 100;
      
      return {
        exchange: 'Coinbase',
        price: currentPrice,
        change24h: change24h
      };
    } catch (error) {
      console.error('Coinbase API Error:', error);
      throw error;
    }
  }

  async getKrakenPrice() {
    try {
      const response = await axios.get(ENDPOINTS.KRAKEN);
      const data = response.data.result.XXBTZUSD;
      const currentPrice = parseFloat(data.c[0]);
      const openPrice = parseFloat(data.o);
      const change24h = ((currentPrice - openPrice) / openPrice) * 100;
      
      return {
        exchange: 'Kraken',
        price: currentPrice,
        change24h: change24h,
        volume: parseFloat(data.v[1])
      };
    } catch (error) {
      console.error('Kraken API Error:', error);
      throw error;
    }
  }

  async getBitfinexPrice() {
    try {
      const response = await axios.get(ENDPOINTS.BITFINEX);
      const [, lastPrice, , , change24h, , volume] = response.data;
      
      return {
        exchange: 'Bitfinex',
        price: lastPrice,
        change24h: change24h * 100,
        volume: volume
      };
    } catch (error) {
      console.error('Bitfinex API Error:', error);
      throw error;
    }
  }

  async getGeminiPrice() {
    try {
      const response = await axios.get(ENDPOINTS.GEMINI);
      const currentPrice = parseFloat(response.data.last);
      const openPrice = parseFloat(response.data.open);
      const change24h = ((currentPrice - openPrice) / openPrice) * 100;
      
      return {
        exchange: 'Gemini',
        price: currentPrice,
        change24h: change24h,
        volume: parseFloat(response.data.volume.BTC)
      };
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }

  async getKucoinPrice() {
    try {
      const response = await axios.get(ENDPOINTS.KUCOIN);
      const data = response.data.data;
      
      return {
        exchange: 'KuCoin',
        price: parseFloat(data.last),
        change24h: parseFloat(data.changeRate) * 100,
        volume: parseFloat(data.vol)
      };
    } catch (error) {
      console.error('KuCoin API Error:', error);
      throw error;
    }
  }

  async getHuobiPrice() {
    try {
      const response = await axios.get(ENDPOINTS.HUOBI);
      const data = response.data.tick;
      const price = parseFloat(data.close);
      const openPrice = parseFloat(data.open);
      const change24h = ((price - openPrice) / openPrice) * 100;
      
      return {
        exchange: 'Huobi',
        price: price,
        change24h: change24h,
        volume: parseFloat(data.vol)
      };
    } catch (error) {
      console.error('Huobi API Error:', error);
      throw error;
    }
  }

  async getBybitPrice() {
    try {
      const response = await axios.get(ENDPOINTS.BYBIT);
      const data = response.data.result[0];
      
      return {
        exchange: 'Bybit',
        price: parseFloat(data.last_price),
        change24h: parseFloat(data.price_24h_pcnt) * 100,
        volume: parseFloat(data.volume_24h)
      };
    } catch (error) {
      console.error('Bybit API Error:', error);
      throw error;
    }
  }

  async getOKExPrice() {
    try {
      const response = await axios.get(ENDPOINTS.OKEX);
      const data = response.data.data[0];
      const currentPrice = parseFloat(data.last);
      const openPrice = parseFloat(data.open24h);
      const change24h = ((currentPrice - openPrice) / openPrice) * 100;
      
      return {
        exchange: 'OKEx',
        price: currentPrice,
        change24h: change24h,
        volume: parseFloat(data.vol24h)
      };
    } catch (error) {
      console.error('OKEx API Error:', error);
      throw error;
    }
  }

  async getGateIOPrice() {
    try {
      const response = await axios.get(ENDPOINTS.GATE_IO);
      const data = response.data[0];
      
      return {
        exchange: 'Gate.io',
        price: parseFloat(data.last),
        change24h: parseFloat(data.change_percentage),
        volume: parseFloat(data.base_volume)
      };
    } catch (error) {
      console.error('Gate.io API Error:', error);
      throw error;
    }
  }

  async getBitstampPrice() {
    try {
      const response = await axios.get(ENDPOINTS.BITSTAMP);
      const currentPrice = parseFloat(response.data.last);
      const openPrice = parseFloat(response.data.open);
      const change24h = ((currentPrice - openPrice) / openPrice) * 100;
      
      return {
        exchange: 'Bitstamp',
        price: currentPrice,
        change24h: change24h,
        volume: parseFloat(response.data.volume)
      };
    } catch (error) {
      console.error('Bitstamp API Error:', error);
      throw error;
    }
  }

  async getAllPrices() {
    try {
      const results = await Promise.allSettled([
        this.getBinancePrice(),
        this.getCoinbasePrice(),
        this.getKrakenPrice(),
        this.getBitfinexPrice(),
        this.getGeminiPrice(),
        this.getKucoinPrice(),
        this.getHuobiPrice(),
        this.getBybitPrice(),
        this.getOKExPrice(),
        this.getGateIOPrice(),
        this.getBitstampPrice()
      ]);

      return results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);
    } catch (error) {
      console.error('Error fetching all prices:', error);
      throw error;
    }
  }
}

export const cryptoService = new CryptoService();
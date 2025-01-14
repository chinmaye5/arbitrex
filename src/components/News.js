import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import './CryptoNews.css';

const CryptoNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const analyzeSentiment = (title, description = '') => {
    const bullishWords = ['surge', 'jump', 'rise', 'gain', 'bull', 'high', 'up', 'growth', 'positive', 'boost'];
    const bearishWords = ['drop', 'fall', 'crash', 'decline', 'bear', 'low', 'down', 'loss', 'negative', 'plunge'];
    
    const contentLower = (title + ' ' + description).toLowerCase();
    
    const bullishScore = bullishWords.reduce((score, word) => 
      contentLower.includes(word) ? score + 1 : score, 0
    );
    
    const bearishScore = bearishWords.reduce((score, word) => 
      contentLower.includes(word) ? score + 1 : score, 0
    );
    
    return bullishScore > bearishScore ? 'bullish' : 
           bearishScore > bullishScore ? 'bearish' : 'neutral';
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Using CoinGecko's free API
        const response = await fetch(
          'https://api.coingecko.com/api/v3/news'
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }

        const data = await response.json();
        
        const formattedNews = data.slice(0, 10).map(item => ({
          id: item.id || Math.random().toString(),
          title: item.title,
          description: item.description,
          image: item.thumb_2x || '/api/placeholder/400/200',
          url: item.url,
          source: item.author,
          publishedAt: new Date(item.published_at).toLocaleDateString(),
          sentiment: analyzeSentiment(item.title, item.description)
        }));
        
        setNews(formattedNews);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setError('Failed to load news. Please try again later.');
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <Loader2 className="loading-spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="news-container">
      <h1 className="news-title">Latest Crypto News</h1>
      <div className="news-grid">
        {news.map((item) => (
          <div key={item.id} className="news-card">
            <div className="news-image-container">
              <img 
                src={item.image} 
                alt={item.title}
                className="news-image"
                onError={(e) => {
                  e.target.src = '/api/placeholder/400/200';
                }}
              />
              <div className="news-source">
                {item.source} • {item.publishedAt}
              </div>
            </div>
            <div className="news-content">
              <h2 className="news-headline">{item.title}</h2>
              <p className="news-description">
                {item.description.length > 150 
                  ? `${item.description.substring(0, 150)}...` 
                  : item.description}
              </p>
              <div className="sentiment-container">
                <span className="sentiment-label">Market Sentiment:</span>
                {item.sentiment === 'bullish' ? (
                  <div className="sentiment bullish">
                    <TrendingUp className="sentiment-icon" />
                    <span>Bullish</span>
                  </div>
                ) : item.sentiment === 'bearish' ? (
                  <div className="sentiment bearish">
                    <TrendingDown className="sentiment-icon" />
                    <span>Bearish</span>
                  </div>
                ) : (
                  <span className="sentiment neutral">Neutral</span>
                )}
              </div>
            </div>
            <div className="news-footer">
              <button 
                onClick={() => window.open(item.url, '_blank')}
                className="read-more-button"
              >
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoNews;
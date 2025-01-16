import React from 'react';
import { ExternalLink, Clock, ThumbsUp, TrendingUp, TrendingDown } from 'lucide-react';
import './News.css';

const CryptoNews = () => {
  const [news, setNews] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const analyzeSentiment = (item) => {
    const bullishKeywords = [
      // Price movements
      'surge', 'rally', 'bull', 'up', 'gain', 'growth', 'high', 'boost', 'positive',
      'soar', 'jump', 'climb', 'rise', 'rocket', 'moon', 'breakout', 'breakthrough',
      'outperform', 'rebound', 'recover', 'bounce', 'momentum', 'uptrend', 'peak',
      
      // Market sentiment
      'optimistic', 'confidence', 'strong', 'strength', 'promising', 'potential',
      'support', 'backed', 'upgrade', 'buy', 'accumulate', 'long', 'bullrun',
      
      // Adoption/Development
      'adoption', 'partnership', 'launch', 'upgrade', 'development', 'innovation',
      'expand', 'integration', 'milestone', 'breakthrough', 'success', 'achieve',
      
      // Institutional
      'institutional', 'investment', 'funding', 'backed', 'venture', 'accumulation',
      'whale', 'institutional', 'stake', 'staking'
  ];
  
  const bearishKeywords = [
      // Price movements
      'crash', 'bear', 'down', 'fall', 'drop', 'low', 'decrease', 'negative', 'loss',
      'plunge', 'dump', 'sink', 'tumble', 'collapse', 'decline', 'slide', 'dip',
      'plummet', 'tank', 'nosedive', 'downtrend', 'bottom', 'correction',
      
      // Market sentiment
      'pessimistic', 'fear', 'weak', 'weakness', 'concern', 'worried', 'warning',
      'risk', 'sell', 'short', 'bearish', 'capitulation', 'panic', 'downturn',
      
      // Problems/Issues
      'hack', 'scam', 'fraud', 'investigation', 'lawsuit', 'sec', 'regulation',
      'ban', 'restrict', 'crackdown', 'breach', 'vulnerability', 'exploit',
      
      // Market conditions
      'volatility', 'inflation', 'recession', 'bubble', 'debt', 'crisis',
      'liquidation', 'margin', 'resistance', 'overhead', 'correction'
  ];
  
    let score = 0;
    
    if (item.votes) {
      score += (item.votes.positive || 0) - (item.votes.negative || 0);
    }
    
    const titleLower = item.title.toLowerCase();
    bullishKeywords.forEach(word => {
      if (titleLower.includes(word)) score += 1;
    });
    bearishKeywords.forEach(word => {
      if (titleLower.includes(word)) score -= 1;
    });
    
    if (score > 0) return 'bullish';
    if (score < 0) return 'bearish';
    return 'neutral';
  };

  React.useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('https://cryptopanic.com/api/free/v1/posts/?auth_token=1ef39fd465bab737489a13ffb0fe73b633c0b295');
        const data = await response.json();
        setNews(data.results || []);
      } catch (err) {
        setError('Failed to fetch news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Loading news...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="news-container">
      <h1>Crypto News</h1>
      <div className="news-grid">
        {news.map((item) => {
          const sentiment = analyzeSentiment(item);
          return (
            <div key={item.id} className={`news-card ${sentiment}`}>
              <div className="card-header">
                <span className="source-badge">{item.source.domain}</span>
                <div className="timestamp">
                  <Clock className="icon" />
                  <span>{formatDate(item.created_at)}</span>
                </div>
              </div>
              
              <div className="sentiment-indicator">
                {sentiment === 'bullish' && (
                  <div className="sentiment bullish">
                    <TrendingUp className="icon" />
                    <span>Bullish</span>
                  </div>
                )}
                {sentiment === 'bearish' && (
                  <div className="sentiment bearish">
                    <TrendingDown className="icon" />
                    <span>Bearish</span>
                  </div>
                )}
                {sentiment === 'neutral' && (
                  <div className="sentiment neutral">
                    <span>Neutral</span>
                  </div>
                )}
              </div>
              
              <h2 className="news-title">{item.title}</h2>
              
              <div className="card-footer">
                <div className="votes">
                  <ThumbsUp className="icon" />
                  <span>{item.votes?.positive || 0}</span>
                </div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="read-more"
                >
                  Read more
                  <ExternalLink className="icon" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
      
      </div>
  );
};

export default CryptoNews;
import React from 'react';
import { ExternalLink, Clock, ThumbsUp, TrendingUp, TrendingDown } from 'lucide-react';

const CryptoNews = () => {
  const [news, setNews] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const analyzeSentiment = (item) => {
    const bullishKeywords = ['surge', 'rally', 'bull', 'up', 'gain', 'growth', 'high', 'boost', 'positive'];
    const bearishKeywords = ['crash', 'bear', 'down', 'fall', 'drop', 'low', 'decrease', 'negative', 'loss'];
    
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
        const response = await fetch('https://cryptopanic.com/api/free/v1/posts/?auth_token=1ef39fd465bab737489a13ffb0fe73b633c0b295&public=true');
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
      
      <style jsx>{`
        .news-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        h1 {
          font-size: 2rem;
          margin-bottom: 1.5rem;
          color: #1d4ed8;
        }

        .news-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .news-card {
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 20px;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.3s ease;
        }

        .news-card:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .source-badge {
          background: #2563eb;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          color: white;
        }

        .timestamp {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.875rem;
        }

        .news-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 10px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .sentiment-indicator {
          margin: 10px 0;
        }

        .sentiment {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .sentiment.bullish {
          background: #2563eb;
          color: white;
        }

        .sentiment.bearish {
          background: #dc2626;
          color: white;
        }

        .sentiment.neutral {
          background: #6b7280;
          color: white;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 15px;
          border-top: 1px solid #eee;
        }

        .votes {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .read-more {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #2563eb;
          text-decoration: none;
          font-size: 0.9rem;
        }

        .read-more:hover {
          color: #1d4ed8;
        }

        .icon {
          width: 16px;
          height: 16px;
        }

        .loading {
          text-align: center;
          padding: 40px;
          font-size: 1.125rem;
        }

        .error {
          text-align: center;
          padding: 40px;
          color: #dc2626;
        }

        @media (max-width: 768px) {
          .news-grid {
            grid-template-columns: 1fr;
          }
          
          .news-container {
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default CryptoNews;
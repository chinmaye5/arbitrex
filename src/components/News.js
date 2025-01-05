import React, { useState, useEffect } from 'react';

// Main component to fetch and display news articles
const NewsSearch = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          'https://google-news-api1.p.rapidapi.com/search',
          {
            method: 'GET',
            headers: {
              'x-rapidapi-host': 'google-news-api1.p.rapidapi.com',
              'x-rapidapi-key': 'YOUR_API_KEY', // Replace with your actual API key
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }

        const data = await response.json();
        setNews(data.articles || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <p style={styles.loading}>Loading...</p>;
  if (error) return <p style={styles.error}>Error: {error}</p>;

  return (
    <div style={styles.container}>
      {news.map((article, index) => (
        <div key={index} style={styles.card}>
          <img
            src={article.image || 'https://via.placeholder.com/150'}
            alt={article.title}
            style={styles.image}
          />
          <div style={styles.cardContent}>
            <h3 style={styles.title}>{article.title}</h3>
            <p style={styles.time}>{new Date(article.publishedAt).toLocaleString()}</p>
            <p style={styles.summary}>
              {article.description || 'No description available.'}
            </p>
            <button
              style={styles.button}
              onClick={() => window.open(article.link, '_blank')}
            >
              Read More
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// CSS-in-JS styles
const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    width: '300px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
  },
  cardContent: {
    padding: '15px',
    textAlign: 'left',
  },
  title: {
    fontSize: '18px',
    marginBottom: '10px',
  },
  time: {
    fontSize: '12px',
    color: '#888',
    marginBottom: '10px',
  },
  summary: {
    fontSize: '14px',
    color: '#555',
    marginBottom: '15px',
  },
  button: {
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  loading: {
    textAlign: 'center',
    fontSize: '18px',
  },
  error: {
    color: '#ff0000', // Red color for error messages
    textAlign: 'center',
    fontSize: '18px',
  },
};

export default NewsSearch;

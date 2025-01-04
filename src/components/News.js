import React, { useState, useEffect } from 'react';

const NewsCard = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the news from the API
    const fetchNews = async () => {
      try {
        const response = await fetch(
          'https://newsdata.io/api/1/news?apikey=pub_64381bc00dc92dcfbdcaaedecf46f3bffda84&q=cryptocurrency'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data = await response.json();
        setNews(data.results || []); // Assuming `results` contains the array of news
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={styles.container}>
      {news.map((item, index) => (
        <div key={index} style={styles.card}>
          <img
            src={item.image_url || 'https://via.placeholder.com/150'}
            alt={item.title}
            style={styles.image}
          />
          <h3 style={styles.title}>{item.title}</h3>
          <button
            style={styles.button}
            onClick={() => window.open(item.link, '_blank')}
          >
            Read More
          </button>
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
    padding: '15px',
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '5px',
  },
  title: {
    fontSize: '18px',
    margin: '15px 0',
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
};

export default NewsCard;

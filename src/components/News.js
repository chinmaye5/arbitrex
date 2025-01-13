import React, { useEffect, useState } from "react";
import axios from "axios";

const CryptoNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the latest cryptocurrency news
    const fetchNews = async () => {
      try {
        const response = await axios.get("https://api.coinstats.app/public/v1/news");
        setNews(response.data.news.slice(0, 10)); // Get only the latest 10 articles
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch news");
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <p>Loading news...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={styles.container}>
      {news.map((article) => (
        <div key={article.id} style={styles.card}>
          <img src={article.imgUrl} alt={article.title} style={styles.image} />
          <h3 style={styles.title}>{article.title}</h3>
          <p style={styles.summary}>{article.description}</p>
          <a href={article.link} target="_blank" rel="noopener noreferrer" style={styles.button}>
            Read More
          </a>
        </div>
      ))}
    </div>
  );
};

// Basic styles for the component
const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    padding: "20px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "15px",
    textAlign: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    marginBottom: "15px",
  },
  title: {
    fontSize: "1.2rem",
    margin: "10px 0",
  },
  summary: {
    fontSize: "0.9rem",
    color: "#555",
    marginBottom: "15px",
  },
  button: {
    display: "inline-block",
    padding: "10px 20px",
    color: "#fff",
    backgroundColor: "#007BFF",
    textDecoration: "none",
    borderRadius: "5px",
  },
};

export default CryptoNews;

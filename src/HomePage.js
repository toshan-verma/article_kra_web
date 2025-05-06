import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardComponent from './CardComponent';

const HomePage = () => {
const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
        setLoading(true);
        try {
          const response = await fetch('http://localhost:3002/1.1/api/v1/articles');
          const articles = await response.json();
          setArticles(articles?.data);
        } catch (err) {
            setLoading(false);
        } finally {
          setLoading(false);
        }
      };

    fetchTags();
  }, []);

  if (loading) return <p>Loading posts...</p>;

  return (
    <div>
      {/* Dynamically render the cards */}
      <div className="cards-container">
        {articles.map((card, index) => (
          <CardComponent
            key={index}
            image={card.article_image}
            name={card.title}
            description={card.description}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
//News.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { toast } from 'react-toastify';
import defaultNews from "../assets/defaultnews.png";
import defaultNews2 from "../assets/defaultnews2.png";
const API_KEY = "9ac74291a9b946408e8247bf0bf7b03e";
const baseURL = "https://newsapi.org/v2/everything";

/**
 * Renders a news component that displays news articles based on a user-selected category.
 * It fetches news articles from the NewsAPI and allows users to select between different news categories.
 */
const NewsComponent = () => {
  const { userProfile } = useUser();
  const [articles, setArticles] = useState([]);
  const [query, setQuery] = useState("Singaporean");
  const [selection, setSelection] = useState("Singaporean"); 

 // Fetch news articles when the query changes
  useEffect(() => {
    const fetchNews = async () => {
      const url = `${baseURL}?q=${query}&sortBy=popularity&apiKey=${API_KEY}`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        setArticles(data.articles);
      } catch (error) {
        toast.error("Cannot fetch news right now, please try again after some time! Sorry for the inconvenience!")
        console.error("Failed to fetch news:", error);
      }
    };

    fetchNews();
  }, [query]);

   // Handle category selection change, updating the query for news fetching
  const handleSelectionChange = (event) => {
    setQuery(event.target.value);
    setSelection(event.target.value); 
  };

  const topArticle = articles[0];
  const otherArticles = articles.slice(1);

  
  const topMargin = '70px';

  return (
    <div>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'white', zIndex: 1000, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '10px' }}>
        <div style={{ maxWidth: '1000px', margin: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <label htmlFor="news-selection" style={{ marginRight: '10px' }}>Select news category:</label>
          <select 
            id="news-selection"
            value={selection} 
            onChange={handleSelectionChange}
            style={{ padding: '10px', borderRadius: '5px', fontSize: '16px', width: '200px' }}
          >
            <option value="World">World</option>
            <option value="Singaporean">Singaporean</option>
            {userProfile && userProfile.nationality && (
              <option value={userProfile.nationality}>{userProfile.nationality}</option>
            )}
          </select>
        </div>
      </div>
      <div style={{ marginTop: topMargin, padding: '20px', maxWidth: '1000px', margin: 'auto' }}>
        {topArticle && (
          <div className="top-news" style={{ marginBottom: '20px', borderRadius: '5px', overflow: 'hidden', textAlign: 'center' }}>
            <img 
            src={topArticle.urlToImage} 
            alt={topArticle.title} 
            style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'cover' }}
            onError={(e) => { e.target.onerror = null; e.target.src = defaultNews; }}
          />
            <h1 style={{ padding: '0 15px' }}>{topArticle.title}</h1>
            <p style={{ padding: '0 15px' }}>{topArticle.description}</p>
          </div>
        )}

        <div id="cards-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
          {otherArticles.map((article, index) => (
            article.urlToImage && (
              <div 
                key={index} 
                className="news-card" 
                style={{ width: 'calc(33.333% - 10px)', marginBottom: '20px', borderRadius: '5px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }} 
                onClick={() => window.open(article.url, "_blank")}
              >
                <img src={article.urlToImage} alt={article.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                onError={(e) => { e.target.onerror = null; e.target.src = defaultNews2; }}
                />
                <div style={{ padding: '15px' }}>
                  <h2>{article.title}</h2>
                  <p>{article.description}</p>
                  <span>{article.source.name}</span>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsComponent;

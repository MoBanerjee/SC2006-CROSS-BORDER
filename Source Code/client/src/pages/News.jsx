//News.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { toast } from 'react-toastify';
import defaultNews from "../assets/defaultnews.png";
import defaultNews2 from "../assets/defaultnews2.png";
import logoImage from '../assets/landscapelogo.png'; 
import '../styles/NewsComponent.css';
import backImage from '../assets/back.png'; 
import {NEWS_AK} from './API_KEYS.jsx'

const API_KEY = NEWS_AK
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


  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <div className='news-main'>
      <div className="header-container">
        <img src={backImage} alt="back" className="back-image" onClick={handleBackClick}/>
        <img src={logoImage} alt="Logo" className="logo-image"/>
        <div></div>
      </div>
      <div class="news-header">
        <div class="news-header-container">
            <label for="news-selection">Select news category:</label>
            <select 
                id="news-selection"
                class="news-selection"
                value= {selection}
                onChange={handleSelectionChange}
            >
                <option value="World">World</option>
                <option value="Singaporean">Singaporean</option>

                {userProfile && userProfile.nationality && (
                    <option value={userProfile.nationality}>{userProfile.nationality}</option>
                )}
            </select>
        </div>
    </div>
    <div class="news-content"> 
        {topArticle && (
            <div class="top-news" onClick={() => window.open(topArticle.url, '_blank')}>
                <img 
                src={topArticle.urlToImage} 
                alt={topArticle.title}
                onError={(e) => { e.target.onerror = null; e.target.src = {defaultNews}; }}
                />
                <h2>{topArticle.title}</h2>
                <p>{topArticle.description}</p>
            </div>
        )}

        <div id="cards-container">
            {otherArticles.map((article, index) => (
                article.urlToImage && (
                    <div 
                        key={index} 
                        class="news-card" 
                        onClick={() => window.open(article.url, '_blank')}
                    >
                        <img 
                            src={article.urlToImage}
                            alt={article.title}
                            onError={(e) => { e.target.onerror = null; e.target.src = {defaultNews2}; }}
                        />
                        <div>
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

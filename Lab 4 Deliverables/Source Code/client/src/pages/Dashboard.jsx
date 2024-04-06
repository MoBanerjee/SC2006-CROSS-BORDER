//Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import CurrencyExchangeIcon from '../assets/currency.svg';
import NavigationIcon from '../assets/navigate.svg';
import AmenitiesIcon from '../assets/amenities.svg';
import NewsIcon from '../assets/news.svg';
import BotIcon from '../assets/bot.svg';
import SettingsIcon from '../assets/settings.svg';
import logoImage from '../assets/landscapelogo.png'; 
import defaultAvatarUrl from "../assets/defaultpfp.png";
import '../styles/Dashboard.css';

/**
 * The Dashboard component serves as the main user interface after login,
 * allowing access to various features such as currency conversion, navigation, amenities finder, news viewer, chatbot, and settings.
 */

const Dashboard = () => {
  const { userProfile } = useUser();
  const [avatar, setAvatar] = useState({ url: defaultAvatarUrl, name: 'Default Avatar' }); 
  const [isLoading, setIsLoading] = useState(false); 
  const [ token] = useState(localStorage.getItem("auth") || "");
  const navigate = useNavigate();

      /**
   * Fetches the user's avatar from the backend. Sets to default if not found or on error.
   */
  const fetchAvatar = async () => {
    setIsLoading(true); 
    const userProfileId = userProfile._id; 
    if (userProfileId) {
      try {
        const response = await axios.post(`http://localhost:3000/api/v1/avatar`, {
          userId: userProfileId,
        });
        setAvatar({ url: response.data.url, name: 'User Avatar' });
      } catch (error) {
        console.error("Error fetching avatar:", error);
        setAvatar({ url: defaultAvatarUrl, name: 'Default Avatar' });
      }
    }
    setIsLoading(false); 
  };

  // useEffect hook to fetch avatar when the userProfile is available
  useEffect(() => {
    if(!userProfile) return;
    fetchAvatar();
  }, [userProfile]);

   // Navigation handlers for each dashboard feature
  const handleButtonClickCurrency = () => {
   navigate("/currency");
  }; 
  const handleButtonClickNavigate = () => {
    navigate("/navigate");
   }; 
   const handleButtonClickAmenities = () => {
    navigate("/amenities");
   }; 
   const handleButtonClickNews = () => {
    navigate("/news");
   }; 
   const handleButtonClickSettings= () => {
    navigate("/settings");
   }; 
   const handleImageClick= () => {
    navigate("/edit");
   }; 

    // Redirect to login page if not logged in
  useEffect(() => {
    if(token === "null"){
      navigate("/login");
      toast.warn("Please login first to access dashboard");
    }
  }, [token]);
  return (
    <div className='dashboard-main'>

      <div className="header-container">
        <div></div>
        <img src={logoImage} alt="Logo" className="logo-image"/>
        <div className="profile-picture-wrapper" >
        <img src={avatar.url} alt={avatar.name} className="profile-picture" onClick={handleImageClick} style={{ cursor: 'pointer' }} />
        </div>
      </div>
    <div className="dashboard-grid">
      <div className='dashboard-box'>
        <button onClick={() => handleButtonClickCurrency()} className="icon-button">
          <img src={CurrencyExchangeIcon} alt="CurrencyExchangeIcon" />
        </button>
        <span>Currency Converter</span>
      </div>
      <div className='dashboard-box'>
        <button onClick={() => handleButtonClickNavigate()} className="icon-button">
          <img src={NavigationIcon} alt="NavigationIcon" />
        </button>
        <span>Navigation</span>
      </div>
      <div className='dashboard-box'>
        <button onClick={() => handleButtonClickAmenities()} className="icon-button">
          <img src={AmenitiesIcon} alt="AmenitiesIcon" />
        </button>
        <span>Nearest Amenities Finder</span>
      </div>
      <div className='dashboard-box'>
        <button onClick={() => handleButtonClickNews()} className="icon-button">
          <img src={NewsIcon} alt="NewsIcon" />
        </button>
        <span>News Viewer</span>
      </div>
      <div className='dashboard-box'>
        <button onClick={() => window.location.href = 'http://localhost:8501/'} className="icon-button">
          <img src={BotIcon} alt="BotIcon" />
        </button>
        <span>ChatBot</span>
      </div>
      <div className='dashboard-box'>
        <button onClick={() => handleButtonClickSettings()} className="icon-button">
          <img src={SettingsIcon} alt="SettingsIcon" />
        </button>
        <span>Settings</span>
      </div>
    </div>
    </div>
  );
}

export default Dashboard;
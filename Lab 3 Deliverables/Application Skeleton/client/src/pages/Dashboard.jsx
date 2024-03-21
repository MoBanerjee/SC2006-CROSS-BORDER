//Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import HotelIcon from '@mui/icons-material/Hotel';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import FlightIcon from '@mui/icons-material/Flight';
import AttractionsIcon from '@mui/icons-material/Attractions';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import logoImage from '../assets/landscapelogo.png'; 
import defaultAvatarUrl from "../assets/defaultpfp.png";
import '../styles/Dashboard.css';

/**
 * The Dashboard component serves as the main user interface after login,
 * allowing access to various features such as currency conversion, navigation, amenities finder, news viewer, chatbot, and settings.
 */
const Dashboard = () => {
  const { userProfile } = useUser();
  const [avatar, setAvatar] = useState({ url: defaultAvatarUrl, name: 'Default Avatar' }); // Add avatar state
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
    <div className="cross-border-container">
            <div className="dashboard-header">
        <img src={logoImage} alt="Logo" className="logo-image" />
        <div className="profile-picture-container">
          <img src={avatar.url} alt={avatar.name} className="profile-picture" onClick={handleImageClick} style={{ cursor: 'pointer' }}/>
        </div>
      </div>
    
      <div className="buttons-grid">
        <button onClick={() => handleButtonClickCurrency()} className="icon-button">
          <HotelIcon className="icon" />
          <span>Currency Converter</span>
        </button>
        <button onClick={() => handleButtonClickNavigate()} className="icon-button">
          <RestaurantIcon className="icon" />
          <span>Navigation</span>
        </button>
        <button onClick={() => handleButtonClickAmenities()} className="icon-button">
          <DirectionsBusIcon className="icon" />
          <span>Nearest Amenities Finder</span>
        </button>
        <button onClick={() => handleButtonClickNews()} className="icon-button">
          <FlightIcon className="icon" />
          <span>News Viewer</span>
        </button>
        <button onClick={() => window.location.href = 'http://localhost:8501/'} className="icon-button">
          <SmartToyOutlinedIcon className="icon" /> 
          <span>ChatBot</span>
        </button>
        <button onClick={() => handleButtonClickSettings()} className="icon-button">
          <AttractionsIcon className="icon" />
          <span>Settings</span>
        </button>
        
      </div>
    </div>
  );
}


export default Dashboard




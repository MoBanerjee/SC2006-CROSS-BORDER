//Settings.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import HotelIcon from '@mui/icons-material/Hotel';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import FlightIcon from '@mui/icons-material/Flight';
import AttractionsIcon from '@mui/icons-material/Attractions';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import logoImage from '../assets/landscapelogo.png'; 
import '../styles/Settings.css';

/**
 * The Settings component provides navigation buttons for different settings options
 * like changing password, editing profile, updating phone number, viewing terms and conditions,
 * accessing the help manual, and logging out.
 */
const Settings = () => {
  const [ token ] = useState(localStorage.getItem("auth") || "");
  const navigate = useNavigate();
  // Navigate to respective settings pages based on user interaction
  const handleButtonClickPswd = () => {
   navigate("/changepassword");
  }; 
  const handleButtonClickProfile = () => {
    navigate("/edit");
   }; 
   const handleButtonClickPhNum = () => {
    navigate("/changephonenum");
   }; 
   const handleButtonClickTC = () => {
    navigate("/tandc");
   }; 
   const handleButtonClickHelp = () => {
    navigate("/help");
   }; 
   const handleButtonClickLogout = () => {
    navigate("/logout");
   }; 

   // Effect hook to redirect unauthenticated users to the login page
  useEffect(() => {
    if(token === "null"){
      navigate("/login");
      toast.warn("Please login first to access settings");
    }
  }, [token]);
  return (
    <div className="cross-border-container">
      <img src={logoImage} alt="Logo" className="logo-image"/>
      <div className="buttons-grid">
        <button onClick={() => handleButtonClickPswd()} className="icon-button">
          <HotelIcon className="icon" />
          <span>Change Password</span>
        </button>
        <button onClick={() => handleButtonClickProfile()} className="icon-button">
          <RestaurantIcon className="icon" />
          <span>Edit Profile</span>
        </button>
        <button onClick={() => handleButtonClickPhNum()} className="icon-button">
          <DirectionsBusIcon className="icon" />
          <span>Change Phone Number</span>
        </button>
        <button onClick={() => handleButtonClickTC()} className="icon-button">
          <FlightIcon className="icon" />
          <span>Terms and Conditions</span>
        </button>
        <button onClick={() => handleButtonClickHelp()} className="icon-button">
          <AttractionsIcon className="icon" />
          <span>App Help Manual</span>
        </button>
        <button onClick={() => handleButtonClickLogout()} className="icon-button">
          <SmartToyOutlinedIcon className="icon" /> 
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}


export default Settings




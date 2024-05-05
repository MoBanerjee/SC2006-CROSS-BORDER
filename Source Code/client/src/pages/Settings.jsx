//Settings.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PhoneIcon from '@mui/icons-material/Phone';
import ArticleIcon from '@mui/icons-material/Article';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import logoImage from '../assets/landscapelogo.png'; 
import backImage from '../assets/back.png'; 
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

  const handleBackClick = () => {
    window.history.back();
  };

  return (
   
      <div className='settings-main'>
        <div className="header-container">
          <img src={backImage} alt="back" className="back-image" onClick={handleBackClick}/>
          <img src={logoImage} alt="Logo" className="logo-image"/>
          <div></div>
        </div>
        <div className="settings-grid">
          <div className='settings-box'>
          <button onClick={() => handleButtonClickPswd()} className="icon-button">
            <ChangeCircleIcon className="icon" sx={{ fontSize: 80 }}/>
          </button>
          <span>Change Password</span>
          </div>
          <div className='settings-box'>
          <button onClick={() => handleButtonClickProfile()} className="icon-button">
            <ManageAccountsIcon className="icon" sx={{ fontSize: 80 }} />
          </button>
          <span>Edit Profile</span>
          </div>
          <div className='settings-box'>
          <button onClick={() => handleButtonClickPhNum()} className="icon-button">
            <PhoneIcon className="icon" sx={{ fontSize: 80 }} />
          </button>
          <span>Change Phone Number</span>
          </div>
          <div className='settings-box'>
          <button onClick={() => handleButtonClickTC()} className="icon-button">
            <ArticleIcon className="icon" sx={{ fontSize: 80 }}/>
          </button>
          <span>Terms and Conditions</span>
          </div>
          <div className='settings-box'>
          <button onClick={() => handleButtonClickHelp()} className="icon-button">
            <HelpIcon className="icon" sx={{ fontSize: 80 }}/>
          </button>
          <span>App Help Manual</span>
          </div>
          <div className='settings-box'>
          <button onClick={() => handleButtonClickLogout()} className="icon-button">
            <LogoutIcon className="icon" sx={{ fontSize: 80 }} /> 
          </button>
          <span>Logout</span>
          </div>
        </div>
      </div>
   
  );
}


export default Settings




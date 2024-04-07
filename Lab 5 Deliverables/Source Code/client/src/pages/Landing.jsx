//Landing.jsx
import React  from 'react'
import "../styles/Landing.css";
import logoImage from '../assets/crbologo.png';
import { Link } from 'react-router-dom';
import globeImage from '../assets/crboglobe.png'; 

/**
 * The Landing component serves as the initial page users see when they visit the application.
 * It provides a visual introduction to the app with its logo and a globe image, emphasizing its global use case.
 * It also features a "Get Started" button that directs users to the login page, facilitating quick access to the app's features.
 */
const Landing = () => {
  return (
    <div className='landing-main'>
    
    <img src={logoImage} alt="Logo" className="landing-logo-image"/>
    <img src={globeImage} alt="Globe" className="landing-globe-image"/>
    
    <Link to="/login" className="landing-button-common landing-login-button">

      Get Started</Link>
    
  </div>
  )
}

export default Landing
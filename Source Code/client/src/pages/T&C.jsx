//T&C.jsx
import React from 'react';
import '../styles/T&C.css'; 
import logoImage from '../assets/landscapelogo.png'; 
import backImage from '../assets/back.png'; 

const handleBackClick = () => {
  window.history.back();
};

/**
 * TandC component renders the Privacy Policy page for the CROSS BORDER application.
 * It details the terms regarding the collection, use, and disclosure of user information.
 */
const TandC = () => {
  return (
    <div className="TandC-container">
      <div className="header-container">
        <img src={backImage} alt="back" className="back-image" onClick={handleBackClick}/>
        <img src={logoImage} alt="Logo" className="logo-image"/>
        <div></div>
      </div> 
      <div className="TandC-content">
        <h1>Privacy Policy for CROSS BORDER</h1>
        <p className="TandC-last-updated">Last Updated: March 03, 2024</p>
        <section>
          <h2>Introduction</h2>
          <p>This Privacy Policy outlines the collection, use, and disclosure of personal information by CROSS BORDER when you use our services. By accessing or using our service, you consent to the processing of your information as described in this policy.</p>
        </section>
        <section>
          <h2>Definitions</h2>
          <p><strong>Personal Data</strong> includes identifiable information like your name, phone number, and address.</p>
          <p><strong>Usage Data</strong> is automatically collected data, such as your device's IP address and browser type.</p>
          <p><strong>Cookies</strong> are small files stored on your device to enhance service functionality.</p>
        </section>
        <section>
          <h2>Data Collection</h2>
          <p>We collect Personal Data and Usage Data to provide and improve our services.</p>
          <p>With your permission, we may also collect location and camera/photos from your device.</p>
        </section>
        <section>
          <h2>Use of Data</h2>
          <p>Data is used for service provision, account management, communication, marketing, and service improvement.</p>
          <p>We may share your data with service providers, affiliates, business partners, and for legal reasons.</p>
        </section>
        <section>
          <h2>Data Retention and Transfer</h2>
          <p>Your Personal Data is kept as long as necessary for the purposes outlined in this policy.</p>
          <p>Data may be transferred internationally, subject to data protection safeguards.</p>
        </section>
        <section>
          <h2>Your Rights</h2>
          <p>You have the right to update, amend, or delete your personal information.</p>
          <p>You can manage your information through your account settings or by contacting us.</p>
        </section>
        <section>
          <h2>Security and Children’s Privacy</h2>
          <p>We strive to protect your Personal Data but cannot guarantee its absolute security.</p>
          <p>Our service does not target children under 13, and we do not knowingly collect data from them.</p>
        </section>
        <section>
          <h2>Changes to Policy</h2>
          <p>We may update this policy and will notify you of changes.</p>
        </section>
        <footer className="TandC-footer">
          <p>Contact Information:</p>
          <p>For questions or concerns, contact us via our website.</p>
        </footer>
      </div>
      </div>
  );
};

export default TandC;


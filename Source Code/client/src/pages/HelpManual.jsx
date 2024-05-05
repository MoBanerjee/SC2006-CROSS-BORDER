//HelpManual.jsx
import React from 'react';
import '../styles/HelpManual.css'; 
import logoImage from '../assets/landscapelogo.png'; 
import backImage from '../assets/back.png'; 

const handleBackClick = () => {
  window.history.back();
};

/**
 * The Help component provides a comprehensive guide and support information for the users of the application.
 * It covers various aspects of the application, including login, registration, authentication,
 * password reset flow, navigation through the main interface, account settings management,
 * utilizing app features, accessing real-time news, and ensuring a seamless user experience.
 */
const Help = () => {
  return (
    <div className="help-container">
      <div className="header-container">
        <img src={backImage} alt="back" className="back-image" onClick={handleBackClick}/>
        <img src={logoImage} alt="Logo" className="logo-image"/>
        <div></div>
      </div>
      <div className='help-content'>
      <h1>Explore Singapore with ease</h1>
        <section className="help-login">
          <h2>Login and Registration</h2>
          <div className="Login">
            <p>If you are a returning user, enter your <strong>Username</strong> and <strong>Password</strong>. If you forgot your password, click on <em>Forgot Password?</em> to reset.</p>
          </div>
          <div className="Help-Registration">
            <p>New user? Enter your <strong>Phone Number</strong> and click <em>Next</em> to receive an OTP.</p>
          </div>
        </section>
        <section className="Help-authentication">
          <h2>Authentication</h2>
          <p>An OTP will be sent to your phone. Enter the OTP and select <em>Confirm</em>. If you didn't receive the code, select <em>Didn't Receive Code?</em> to resend it.</p>
        </section>
        <section className="Help-passwordReset">
          <h2>Password Reset Flow</h2>
          <p>Forgot your password? After entering your phone number, answer your security questions. Then, enter a new password and confirm it to regain access to your account.</p>
        </section>
        <section className="Help-mainInterface">
          <h2>Main Interface Exploration</h2>
          <p>Upon successful login, the 'Dashboard Page' provides access to Settings, Profile, Amenities, Navigation, Bot, and News features.</p>
        </section>
        <section className="Help-accountSettings">
          <h2>Account and Settings</h2>
          <p>Under 'Settings', you can configure your account, manage privacy, security, notifications, review Terms & Conditions, or logout. In 'Profile', update your username, password, and phone number.</p>
        </section>
        <section className="Help-utilizingFeatures">
          <h2>Utilizing Features</h2>
          <p>Explore amenities on the map, navigate efficiently, interact with the AI chatbot for assistance, and perform currency exchanges within the app.</p>
        </section>
        <section className="Help-realTimeNews">
          <h2>Real-Time News</h2>
          <p>Stay updated with the latest news and events directly through the app.</p>
        </section>
        <section className="Help-userExperience">
          <h2>Seamless User Experience</h2>
          <p>Follow the flow diagram within the app for a step-by-step guide on using each feature effectively.</p>
        </section>
        <section className="Help-supportQueries">
          <h2>Support and Queries</h2>
          <p>Refer to this section as a manual for navigating and utilizing the comprehensive features of CROSS BORDER.</p>
        </section>
        <footer className="help-footer">
          <p>Contact us for further assistance or queries regarding the use of CROSS BORDER.</p>
        </footer>
      </div>
    </div>

  );
};

export default Help; 

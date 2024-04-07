//ChangePhNum.jsx
import React, { useState, useEffect } from 'react';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useUser } from '../contexts/UserContext'; 
import logoImage from '../assets/landscapelogo.png';
import backImage from '../assets/back.png'; 
import '../styles/ChangePhNum.css'

/**
 * ChangePhoneNumber component allows users to update their registered phone number.
 * It validates the new phone number against specific regional formats before submitting
 * the update request to the backend. It also checks for the uniqueness of the new phone number.
 */
const ChangePhoneNumber = () => { 
  const [ph, setPh] = useState('');
  const [originalPh, setOriginalPh] = useState("");
  const token = localStorage.getItem('auth'); 
  const { updateToken, userProfile } = useUser(); 

  // useEffect to set the phone number from the user profile when the component mounts or userProfile changes

  useEffect(() => {
    
    if (userProfile && userProfile.ph) {
      setPh(userProfile.ph);
      setOriginalPh(userProfile.ph);
    }
  }, [userProfile]); 

      /**
   * Handles the form submission for phone number change.
   * Validates the new phone number and updates it through a backend call.
   * @param {React.FormEvent<HTMLFormElement>} e - The event object.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

  
    if (ph === originalPh) {
      toast.error("Please enter a new phone number.");
      return;
    }
    const regexChina = /^(\+86)?1[3-9]\d{9}$/; 
    const regexIndia = /^(\+91)?[6789]\d{9}$/; 
    const regexMalaysia = /^(\+60)?1\d{8,9}$/; 
    const regexSingapore = /^(\+65)?[689]\d{7}$/; 
  
  
    if (regexChina.test(ph)) {
      
    } else if (regexIndia.test(ph)) {
      
    } else if (regexMalaysia.test(ph)) {

    } else if (regexSingapore.test(ph)) {
      
    } else {
      toast.error("Please enter a valid phone number!");
      return;
    }

    try {
      if(ph==""){
        toast.error("Please enter a valid phone number!");
        return;
      }
      const response = await axios.post("http://localhost:3000/api/v1/phoneauth", { ph: ph });
     
      if(response.data.msg=="This phone number is already linked to an existing account. Please sign in."){
        toast.info("This phone number is already linked to an existing account.")
        return;
      }
      axios.post("http://localhost:3000/api/v1/changeph", { ph: ph },{
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(response => {
        
      }).catch(error => {
   
      })
      axios.post('http://localhost:3000/api/v1/clear-cache', null, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(response => {
    
      }).catch(error => {
     
      });
      updateToken(token);
      toast.success("Phone number updated successfully");
      setOriginalPh(ph); 
    } catch (err) {
      console.error("Failed to update phone number:", err);
      toast.error("This phone number is already linked to an existing account.");
    }
  };

  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <div className="page-container">
      <div className="header-container">
        <img src={backImage} alt="back" className="back-image" onClick={handleBackClick}/>
        <img src={logoImage} alt="Logo" className="logo-image"/>
        <div></div>
      </div>
      <div className="form-container">
        <h2 className="form-heading bigger">Change Your Phone Number</h2>
        <div className="form-heading smaller">Enter a New Phone Number that is different from the current one.</div>
        <form onSubmit={handleSubmit} className="phone-change-form">
          <label htmlFor="phone" className="registered-number-label">Registered Phone Number</label>
          <PhoneInput
            country={"sg"}
            value={ph}
            onChange={setPh}
            id="phone"
            className="phone-input"
          />
          <button type="submit" className="save-button">Save</button>
        </form>
      </div>
    </div>
  );
};
export default ChangePhoneNumber; 

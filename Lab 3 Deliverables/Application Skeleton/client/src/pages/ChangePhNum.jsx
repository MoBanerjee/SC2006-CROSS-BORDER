//ChangePhNum.jsx
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useUser } from '../contexts/UserContext'; 

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
      toast.error(err.response.data.error || "Failed to update phone number.");
    }
  };

  return (
    <div className="change-phone-main">
      <div className="change-phone-container">
        <h2>Change Your Phone Number</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="" className="font-bold text-xl text-white text-center">
            Registered Phone Number
          </label><br></br>
          <PhoneInput country={"sg"} value={ph} onChange={setPh} />
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default ChangePhoneNumber;

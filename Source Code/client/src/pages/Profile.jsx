//Profile.jsx
import "../styles/Profile.css";
import React, { useContext } from "react";
import Logo from "../assets/landscapelogo.png";
import { Link, useNavigate } from "react-router-dom";
import { isValidSingaporePostalCode } from '../utils/inputValidation';
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation } from 'react-router-dom';
import {UserContext}  from '../contexts/UserContext';

/**
 * Profile component for user registration and profile setup.
 * Collects detailed user information including security questions for account recovery.
 */
const Profile = () => {
  const { updateToken } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation(); 

        /**
   * Handles form submission for the profile setup.
   * Validates the form fields and submits the data to the backend for registration.
   */
    const handleProfileSubmit = async (e) => {
      e.preventDefault();
      let fullname = e.target.fullname.value;
      let gender = e.target.gender.value;
      let profession=e.target.job.value;
      let nationality=e.target.nationality.value;
      let homeaddress=e.target.haddress.value;
      let homepostal=e.target.homepostalCode.value;
      let securityq=e.target.securityQuestion.value;
      let securityans=e.target.securityAnswer.value;
  if(!fullname || !gender || !profession || !nationality || !homeaddress || !homepostal || !securityq || !securityans){
    toast.error("Please fill in all inputs");
    return;
  }
  if(!isValidSingaporePostalCode(homepostal)){
    toast.info("Please enter a valid 6-digit postal code!");
    return;
  }
        const { username, password, ph} = location.state || {};
        const formData = {
          username,
          password,
          ph,
          fullname,
          gender,
          nationality,
          profession,
          homeaddress,
          homepostal,
          securityq,
          securityans
        };
        try {
          const response = await axios.post(
            "http://localhost:3000/api/v1/register",
            formData
          );
          updateToken(JSON.stringify(response.data.token));
          
          navigate("/profilepic");
        } catch (err) {
          console.log(err);
          toast.error("Invalid login credentials. Please try again.");
        }
      
    };
  
    return (
      <div className="profile-main">
        <div className="profile-right">
          <div className="profile-right-container">
            <div className="profile-logo">
              <img src={Logo} alt="" />
            </div>
            <div className="profile-center">
              <h2>Please enter your details</h2>
              <form onSubmit={handleProfileSubmit} >
                <input type="text" placeholder="Fullname" name="fullname" />
                <select name="gender" defaultValue=''>
                  <option value="" disabled>Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                <select name="nationality" defaultValue="">
                  <option value="" disabled>Nationality</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Indian">Indian</option>
                  <option value="Malaysian">Malaysian</option>
                </select>
                <input type="text" placeholder="Profession" name="job" />
                <input type="text" placeholder="Home Address" name="haddress" />
                <input type="text" placeholder="Home Postal Code" name="homepostalCode" maxLength="6" />
                <select name="securityQuestion" defaultValue="" >
                  <option value="" disabled>Choose a security question</option>
                  <option value="firstPet">What was the first item you bought with your own money in Singapore?</option>
                  <option value="birthCity">In what city/town/village were you born?</option>
                  <option value="childhoodNickname">What was your childhood nickname?</option>
                  <option value="favoriteTeacher">What is the name of your favorite teacher?</option>
                  <option value="memorableDate">What is the first name of your best friend from childhood?</option>
                </select>
                <input type="text" placeholder="Your Answer" name="securityAnswer" />
                <div className="profile-center-buttons">
                  <button type="submit">Create Account</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Profile;
  
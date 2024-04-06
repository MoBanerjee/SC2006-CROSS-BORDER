// ChangePassword.jsx
import React, { useState } from "react";
import Logo from "../assets/crbologo.png"; 
import backImage from '../assets/back.png'; 
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import "../styles/ChangePassword.css"; 
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from '../contexts/UserContext';
import PasswordStrengthMeterComponent from '../utils/PasswordStrengthMeter'; 
import {evaluatePasswordStrength} from "../utils/passwordUtils.js"

/**
 * ChangePassword component allows users to change their password.
 * It leverages local component state to manage input visibility and form data,
 * communicates with a backend server to verify and update passwords,
 * and provides feedback to the user through notifications.
 */
const ChangePassword = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCurrentPasswordVerified, setIsCurrentPasswordVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const { updateToken, userProfile } = useUser();
  const token = localStorage.getItem('auth');
  const navigate = useNavigate();

    /**
   * Attempts to verify the current password with the backend.
   * Displays a toast notification based on the outcome.
   * @param {string} currentPassword - The current password input by the user.
   */
  const verifyCurrentPassword = async (currentPassword) => {
    if(currentPassword === ""){
        toast.info("Please enter your current password!");
        return;
    }
    if(!userProfile) return;
    try {
      await axios.post(
        "http://localhost:3000/api/v1/verifypassword",
        { userId: userProfile._id, password: currentPassword }
      );
      setIsCurrentPasswordVerified(true);
      toast.success("Current password verified. Please enter a new password.");
    } catch (err) {
      console.error(err);
      toast.error("Current password verification failed. Please try again.");
    }
  };

    /**
   * Handles the submission of the password change form.
   * Validates form data, communicates with the backend to update the password,
   * and navigates the user on success.
   * @param {React.FormEvent<HTMLFormElement>} e - The event object.
   */
  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    const confirmPassword = e.target.confirmPassword.value;

    if(newPassword === "" || confirmPassword === ""){
        toast.info("Please input all fields!");
        return;
    }
    if(newPassword !== confirmPassword){
        toast.error("Passwords don't match!");
        return;
    }
    const { level } = evaluatePasswordStrength(newPassword);
    if (level !== 'Strong') {
      toast.warn("Please use a stronger password for better security.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/update-password",
        { userId: userProfile._id, newPassword: newPassword },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if(response.data.message === "New Password should not be same as old password!"){
        toast.info("New Password should not be same as old password!");
        return;
      }
      axios.post('http://localhost:3000/api/v1/clear-cache', null, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(() => {
       
      }).catch(error => {
        console.error("Cache clearing error:", error);
      });
      updateToken(token);
      toast.success("Password changed successfully");
      navigate("/settings");
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    }
  };


  /**
   * Handles the form event to verify the current password.
   * @param {React.FormEvent<HTMLFormElement>} e - The event object.
   */
  const handleVerifyCurrentPassword = (e) => {
    e.preventDefault();
    const currentPassword = e.target.currentPassword.value;
    verifyCurrentPassword(currentPassword);
  };

    /**
   * Updates the `newPassword` state based on the user's input in the New Password field.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object for the input change.
   */
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };


  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <div className="change-password-main">
      <div className="change-password-right change-password-right-container-bg">
        <div className="change-password-right-container">
        <div className="header-container">
          <img src={backImage} alt="back" className="back-image" onClick={handleBackClick}/>
          <img src={Logo} alt="Logo" className="logo-image"/>
          <div></div>
        </div>
          <div className="change-password-center">
            <h2>Change Password</h2>
            {!isCurrentPasswordVerified ? (
              <form onSubmit={handleVerifyCurrentPassword}>
                <p>Please verify your current password</p>
                <div className="pass-input-div">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Current Password"
                    name="currentPassword"
                  />
                  {showCurrentPassword ? (
                    <FaEyeSlash onClick={() => setShowCurrentPassword(!showCurrentPassword)} />
                  ) : (
                    <FaEye onClick={() => setShowCurrentPassword(!showCurrentPassword)} />
                  )}
                </div>
                <button type="submit">Verify Current Password</button>
              </form>
            ) : (
              <form onSubmit={handlePasswordChangeSubmit}>
                <p>Please enter your new password</p>
                <div className="pass-input-div">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New Password"
                    name="newPassword"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                  />
                  
                  {showNewPassword ? (
                    <FaEyeSlash onClick={() => setShowNewPassword(!showNewPassword)} />
                  ) : (
                    <FaEye onClick={() => setShowNewPassword(!showNewPassword)} />
                  )}
                  <PasswordStrengthMeterComponent password={newPassword} />
                </div>
                <div className="pass-input-div">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm New Password"
                    name="confirmPassword"
                  />
                  {showConfirmPassword ? (
                    <FaEyeSlash onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                  ) : (
                    <FaEye onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                  )}
                </div>
                <button type="submit">Change Password</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;

//ResetPassword.jsx
import React, { useState } from "react";
import Logo from "../assets/crbologo.png"; 
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import "../styles/ResetPassword.css"; 
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from '../contexts/UserContext';
import PasswordStrengthMeterComponent from '../utils/PasswordStrengthMeter'; 
import {evaluatePasswordStrength} from "../utils/passwordUtils.js"

/**
 * ResetPassword component allows users to securely change their password.
 * It ensures passwords meet certain strength criteria and confirms that the user inputs match before submission.
 */
const ResetPassword = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const { updateToken, userProfile } = useUser();
  const token = localStorage.getItem('auth');
  const navigate = useNavigate();

      /**
   * Handles the submission of the password change form.
   * Verifies the password and confirmPassword fields match and meet strength requirements
   * before submitting the request to the server.
   */
  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    const newPassword = password;
    const confirmPassword = e.target.confirmPassword.value;
    if (newPassword === "" || confirmPassword === "") {
      toast.info("Please input all fields!");
      return;
    }
    if (newPassword !== confirmPassword) {
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
      if (response.data.message === "New Password should not be same as old password!") {
        toast.info("New Password should not be same as old password!");
        return;
      }
      updateToken(token);
      toast.success("Password changed successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    }
  };

  // Updates the password state as the user types in the newPassword input field
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className="change-password-main">
      <div className="change-password-right change-password-right-container-bg">
        <div className="change-password-right-container">
          <div className="change-password-logo">
            <img src={Logo} alt="Logo" />
          </div>
          <div className="change-password-center">
            <h2>Reset Password</h2>
            <form onSubmit={handlePasswordChangeSubmit}>
              <p>Please enter your new password</p>
              <div className="pass-input-div">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password"
                  name="newPassword"
                  value={password}
                  onChange={handlePasswordChange}
                />
                {showNewPassword ? (
                  <FaEyeSlash onClick={() => setShowNewPassword(!showNewPassword)} />
                ) : (
                  <FaEye onClick={() => setShowNewPassword(!showNewPassword)} />
                )}
                <PasswordStrengthMeterComponent password={password} />
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
              <button type="submit">Reset Password</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

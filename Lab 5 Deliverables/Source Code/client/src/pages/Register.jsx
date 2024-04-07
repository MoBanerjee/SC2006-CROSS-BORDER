//Register.jsx
import React, { useState } from "react";
import PasswordStrengthMeterComponent from '../utils/PasswordStrengthMeter'; 
import {evaluatePasswordStrength} from "../utils/passwordUtils.js"
import Logo from "../assets/landscapelogo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import "../styles/Register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

/**
 * Register component for the user registration form.
 * Allows users to create a new account by providing a username and password.
 * Validates the password strength and ensures password confirmation matches.
 */
const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [password, setPassword] = useState(""); 
  const navigate = useNavigate();

      /**
   * Handles form submission for user registration.
   * Validates the form data, checks password strength, and attempts to register the user.
   * On success, navigates to phone number verification step.
   */
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    let username = e.target.username.value;
    let confirmPassword = e.target.confirmPassword.value;

    if(username.length > 0 && password.length > 0 && confirmPassword.length > 0) {
      if(password !== confirmPassword) {
        toast.error("Passwords don't match!");
        return; 
      }

      const { level } = evaluatePasswordStrength(password);
      if (level !== 'Strong') {
        toast.warn("Please use a stronger password for better security.");
        return; 
      }

      const formData = {
        username: username,
        password: password,
        confirmPassword: confirmPassword
      };

      try {
        await axios.post("http://localhost:3000/api/v1/regauth", formData);
        navigate('/phonenumotp', { state: { username, password, comingFrom: "register" } });
      } catch(err) {
        toast.error(err.response.data.msg);
      }
    } else {
      toast.error("Please fill all inputs");
    }
  };

      /**
   * Updates the password state as the user types in the password input field.
   * This function is triggered on every keystroke in the password field.
   */
  const handlePasswordChange = (e) => {
    setPassword(e.target.value); 
  };

  return (
    <div className="register-main">
      <div className="register-right">
        <div className="register-right-container">
          <div className="register-logo">
            <img src={Logo} alt="" />
          </div>
          <div className="register-center">
            <h2>Welcome to our website!</h2>
            <p>Please enter your details</p>
            <form onSubmit={handleRegisterSubmit}>
              <input type="text" placeholder="Username" name="username" />
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                  
                />
                <PasswordStrengthMeterComponent password={password} />
                {showPassword ? (
                  <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <FaEye onClick={() => setShowPassword(!showPassword)} />
                )}
              </div>
              <div className="pass-input-div">
                <input
                  type={showCPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  
                />
                {showCPassword ? (
                  <FaEyeSlash onClick={() => setShowCPassword(!showCPassword)} />
                ) : (
                  <FaEye onClick={() => setShowCPassword(!showCPassword)} />
                )}
              </div>
              <div className="register-center-buttons">
                <button type="submit">Sign Up</button>
              </div>
            </form>
          </div>

          <p className="login-bottom-p">
            Already have an account?
            <Link to="/login"> Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

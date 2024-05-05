//Login.jsx
import React, {useState,useEffect,useContext } from "react";
import Logo from "../assets/crbologo.png";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {UserContext}  from '../contexts/UserContext';
import { toast } from "react-toastify";

/**
 * Login component handles user authentication and navigation to other parts of the application.
 * It provides inputs for username and password, along with the ability to toggle password visibility.
 */
const Login = () => {
  const { updateToken } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

      /**
   * Handles form submission for logging in. It sends the user credentials to the server and navigates
   * the user based on the response.
   */
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    let username = e.target.username.value;
    let password = e.target.password.value;

    if (username.length > 0 && password.length > 0) {
      const formData = {
        username,
        password,
      };
      try {
        const response = await axios.post(
          "http://localhost:3000/api/v1/login",
          formData
        );
        
        toast.success("Login successful. Please verify your phone number to complete the sign-in process");
        navigate("/phonenumotp", { state: { username:username,comingFrom: "login" } });
      } catch (err) {
        console.log(err);
        toast.error("Invalid login credentials. Please try again.");
      }
    } else {
      toast.error("Please fill all inputs");
    }
  };
 
  return (
    <div className="login-main">
      <div className="login-left">
      </div>
      <div className="login-right login-right-container-bg">
        <div className="login-right-container">
          <div className="login-logo">
            <img src={Logo} alt="" />
          </div>
          <div className="login-center">
            <h2>Welcome back!</h2>
            <p>Please enter your details</p>
            <form onSubmit={handleLoginSubmit}> 
              <input type="username" placeholder="Username" name="username" />
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                />
                          
                {showPassword ? (
                  <FaEyeSlash
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  />
                ) : (
                  <FaEye
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  />
                )}
              </div>

              <div className="login-center-options">
              <p><Link to={{
                pathname: "/phonenumotp",
                state: { username:"" ,comingFrom: "forgot"  }
              }}>Forgot Password?</Link></p>
              </div>
              <div className="login-center-buttons">
                <button type="submit">Log In</button>
              </div>
            </form>
          </div>

          <p className="login-bottom-p">
            <br></br>
            Don't have an account? 
            <p><Link to="/register">Sign Up</Link></p>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
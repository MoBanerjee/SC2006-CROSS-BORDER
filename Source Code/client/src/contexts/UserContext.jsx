// UserContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

/**
 * Creates a context for user information and authentication status.
 * @type {React.Context}
 */
export const UserContext = createContext();

/**
 * Provides the user context to child components and manages the user's authentication state.
 * @function UserProvider
 * @param {object} props - The props object.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {React.ReactElement} - The provider component for the UserContext.
 */
export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [token,setToken]=useState( localStorage.getItem('auth'));

      /**
   * useEffect hook to check authentication status and fetch user profile if token is present.
   */
  useEffect(() => {
    if(token!="null")
    setIsLoggedIn(true);
  
    if (token === "null") {
      
      console.log("Token is null, not fetching user profile.");
      setUserProfile(null);
      return; 
    }
    console.log(typeof(token));
    console.log(token===null);
    console.log(token);
    fetchUserProfile();
  }, [token]);

      /**
   * Fetches the user's profile from the server using the stored authentication token.
   * Sets the user profile on successful fetch or sets an error on failure.
   */
  const fetchUserProfile = () => {
    console.log("I am gna fetch profile");
    
    if (token === "null") {
      console.log("i did not find anyth");
      setError('No token found. User is probably not logged in.');
      return;
    }

    axios.get('http://localhost:3000/api/v1/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => {
      setUserProfile(response.data);
    })
    .catch(error => {
      setError(`Error fetching user profile: ${error}`);
    });
  };

      /**
   * Updates the authentication token stored in local storage and state.
   * @param {string} newToken - The new token to update.
   */
  const updateToken = (newToken) => {
    console.log("mason"+typeof(newToken));
    localStorage.setItem('auth', newToken);
    console.log("wtr"+typeof(localStorage.getItem('auth')));
    setToken(localStorage.getItem('auth')); 
  };

  return (
    <UserContext.Provider value={{ userProfile, isLoggedIn, error, fetchUserProfile,updateToken }}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * Custom hook to use the user context.
 * @returns {object} The user context with user profile, authentication status, and associated actions.
 */
export const useUser = () => useContext(UserContext);

//Logout.jsx
import React, { useEffect,useContext} from 'react'
import "../styles/Logout.css";
import { useNavigate } from 'react-router-dom';
import {UserContext}  from '../contexts/UserContext';

/**
 * The Logout component handles the logout process of the user. It clears the authentication token from local storage,
 * updates the application state to reflect the user's logged-out status, and redirects the user to the landing page.
 */
const Logout = () => {
  const { updateToken } = useContext(UserContext);
    const navigate = useNavigate();
    useEffect(() => {
        localStorage.removeItem("auth");
        updateToken(null);
        console.log(typeof(localStorage.getItem('auth')));
        console.log(typeof(null))
        setTimeout(() => {
            navigate("/");
        }, 3000);
    }, []);

  return (
    <div className='logout-main'>
      <div className="logout-right-container">
        <h1>Logout Successful!</h1>
        <p>You will be redirected to the landing page in 3 seconds...</p>
      </div>
    </div>
  )
}

export default Logout
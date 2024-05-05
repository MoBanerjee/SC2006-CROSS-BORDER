//SecurityQ.jsx
import React, { useState ,useContext} from 'react';
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {UserContext}  from '../contexts/UserContext';
import { toast } from 'react-toastify';
import axios from "axios";
import logoImage from '../assets/landscapelogo.png'; 
import backImage from '../assets/back.png'; 
import "../styles/securityQ.css"; 


/**
 * Component for handling the security question verification process.
 * It is part of the password reset flow, where a user verifies their identity
 * by answering a security question associated with their account.
 */
function SecurityQuestion() {
  const { updateToken } = useContext(UserContext);
    const navigate = useNavigate();
const location = useLocation();
  const [answer, setAnswer] = useState('');
  const [securityqueskeyword,setKeyword]=useState('');
  const [question, setQ] = useState('');
  const { ph} = location.state || {};

  // Effect hook to fetch the security question based on the user's phone number
  useEffect(() => {
    const fetchques=async()=>{
        try{
    const response = await axios.post("http://localhost:3000/api/v1/getq", { ph:ph });
setKeyword(response.data.msg);
      switch (securityqueskeyword) {
        case 'firstPet':
          setQ("What was the first item you bought with your own money in Singapore?");
          break;
        case 'birthCity':
          setQ("In what city/town/village were you born?");
          break;
        case 'childhoodNickname':
          setQ("What was your childhood nickname?");
          break;
        case 'favoriteTeacher':
            setQ("What is the name of your favorite teacher?");
            break;
        case 'memorableDate':
            setQ("What is the first name of your best friend from childhood?");
            break;
        default:
          setQ("");
          break;
      }}catch(err){
        console.error("Failed to fetch security question:", err);
      }};
      fetchques();
    }
  , [securityqueskeyword]);
 
  // Handles the submission of the security question's answer
  const handleSubmit = async(e) => {
    try{
    e.preventDefault(); 
    if(answer==""){
      toast.info("Please fill in the answer!");
      return;
    }
    const response = await axios.post("http://localhost:3000/api/v1/verifyanswer", { ph:ph,answer:answer })
    if(response.data.correct){
      try {
        const response = await axios.post("http://localhost:3000/api/v1/giveTokenUsingPh", { ph:ph });
          updateToken((response.data.token));
      } catch (error) {
        console.error(error);
        
      }
        navigate("/reset");
        toast.success("Login successful! Please reset your password");
    }
    else{
toast.error("The answer is incorrect, please try again");
    }}catch (err) {
        toast.error(err.response?.data?.msg);
        return;
      }
  };

  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <div className='settings-main'>
      <div className="header-container">
        <img src={backImage} alt="back" className="back-image" onClick={handleBackClick}/>
        <img src={logoImage} alt="Logo" className="logo-image"/>
        <div></div>
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="securityAnswer">{question}</label>
        <input
          type="text"
          id="securityAnswer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <button type="submit">Submit Answer</button>
      </form>
    </div>
  );
}

export default SecurityQuestion;

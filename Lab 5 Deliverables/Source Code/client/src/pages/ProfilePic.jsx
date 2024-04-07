//ProfilePic.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useUser } from '../contexts/UserContext';
import defaultAvatarUrl from "../assets/defaultpfp.png";
import { useNavigate } from "react-router-dom";
import logoImage from '../assets/landscapelogo.png'; 

/**
 * ProfilePic component for uploading and displaying a user's profile picture.
 * Users can upload a new image by selecting a file or dragging and dropping.
 */
function ProfilePic() {
    const navigate = useNavigate();
  const { userProfile } = useUser();
  const [avatar, setAvatar] = useState(null); 
  const [isDragOver, setDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

// Fetch user's avatar on component mount or userProfile update
  useEffect(() => {
    const fetchAvatar = async () => {
      setIsLoading(true); 
      if (userProfile && userProfile._id) {
        try {
          const response = await axios.post(`http://localhost:3000/api/v1/avatar`, {
            userId: userProfile._id,
          });
          setAvatar({ url: response.data.url, name: 'User Avatar' });
        } catch (error) {
          console.error("Error fetching avatar:", error);
          setAvatar({ url: defaultAvatarUrl, name: 'Default Avatar' });
        }
      }
      setIsLoading(false); 
    };
  
    fetchAvatar();
  }, [userProfile]);
  
// Handles file upload submission
  const handleSubmit = (file) => {
    const encodeImage = (mimetype, arrayBuffer) => {
      let u8 = new Uint8Array(arrayBuffer);
      const b64encoded = btoa([].reduce.call(u8, function (p, c) { return p + String.fromCharCode(c); }, ''));
      return "data:" + mimetype + ";base64," + b64encoded;
    };

    const uploadImage = async () => {
        if (!(userProfile && userProfile._id)) return;
        console.log(userProfile._id + "ty");
        const data = new FormData();
        data.append('file', file);
        data.append('filename', file.name);
        data.append('userId', userProfile._id);
        
        try {
          const result = await axios.post("http://localhost:3000/api/v1/upload", data, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          
          
          if (result.data && result.data.url) {
            setAvatar({ name: result.data.name, url: result.data.url });
          } else {
            console.error("URL not returned from backend:", result);
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          
        }
      };
    uploadImage()}
      
 // Drag over effect
  const handleDragOver = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    setDragOver(true);
  };

// Handle dropping files
  const handleDrop = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    setDragOver(false);
    const file = evt.dataTransfer.files[0];
    handleSubmit(file);
  };

  // Finish button click handler
  const handleFinish = () => {
    toast.success("Registration successful");
    navigate('/dashboard');
  };

 
  const styles = {

    profilepicmain: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '89vh',
      width: '450px',
      padding: '50px',
      boxSizing: 'border-box',
      background: '#F3F2E9',
      borderRadius: '20px',
      boxShadow: '0 16px 16px rgba(0, 0, 0, 0.1)', 
      transformStyle: 'preserve-3d',
      transition: 'transform 0.5s ease-in-out',
      ':hover': { 
        transform: 'scale(1.05)',
      },
    },
  
    profilepicRightContainer: { 
      height: '80vh',
      width: '400px',
      paddingLeft: '25px', 
      paddingTop: '25px', 
      paddingBottom: '25px', 
      paddingRight: '25px', 
      textAlign: 'center',
      borderRadius: '15px',
      boxShadow: '1px 0px 9px 0px rgba(0,0,0,0.15)',
      transform: 'rotateY(0deg) rotateX(0deg)',
      transition: 'background 0.5s ease, transform 0.5s ease-in-out',
    },

    logoImage:{
      width: '250px',
      marginBottom: '30px',
    },

    container: {
      maxWidth: '100%',
      alignItems: 'centre',
      justifyContent: 'centre',
    },

    containerUpload: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',   
      marginTop: '75px', 
      backgroundColor: '#E24845', 
      borderRadius: '3px',
      padding: '50px 0',
      color: 'white',
      ...(isDragOver && {
        backgroundColor: '#E24845', 
      }),
    },

    containerGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      
    },

    img: {
        width: '150px', 
        height: '150px',
        borderRadius: '50%', 
      },
    input: {
      overflow: 'hidden',
      width: '0',
    },
  };

  return (
    <div style={styles.profilepicmain}>
      <div style={styles.profilepicRightContainer}>
      <img src={logoImage} alt="Logo" style={styles.logoImage}/>


        <section style={styles.container}>
          <div style={styles.containerGrid}>
            {/* Render the avatar if it exists, or the default avatar */}
            <img src={avatar ? avatar.url : defaultAvatarUrl} style={styles.img} alt={avatar ? avatar.name : 'Default Avatar'} />
          </div>

          <section
          style={styles.containerUpload}
          onDragOver={handleDragOver}
          onDrop={handleDrop}>
          <i className="fas fa-cloud-upload-alt fa-5x"></i>
          <label>
            <input style={styles.input} type="file" name="avatar" onChange={e => handleSubmit(e.target.files[0])}/>
            Choose file to upload
          </label>
          <h3>or drag and drop them here</h3>
        </section>

          <button onClick={handleFinish} style={{ marginTop: '50px', width: '100%'}}>Finish</button> 
        </section>

        
      </div>
    </div>
  );
}

export default ProfilePic;

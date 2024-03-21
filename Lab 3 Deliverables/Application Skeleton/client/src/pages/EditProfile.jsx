//EditProfile.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import { isValidSingaporePostalCode } from '../utils/inputValidation';
import { toast } from 'react-toastify';
import Logo from "../assets/landscapelogo.png";
import { UserContext } from '../contexts/UserContext'; 
import "../styles/Profile.css";
import defaultAvatarUrl from "../assets/defaultpfp.png";

/**
 * EditProfile component allows users to edit and update their profile information.
 * It supports updating fields like fullname, gender, nationality, profession,
 * home address, postal code, and security question/answer.
 * It also allows for avatar upload and deletion.
 *
 * @param {object} props - Component props.
 * @param {string} props.userId - User ID for fetching and updating profile information.
 */
const EditProfile = ({ userId }) => {
    const [token]=useState( localStorage.getItem('auth'));
    const {userProfile} = useUser();
    const [avatar, setAvatar] = useState(null); 
    const [isDragOver, setDragOver] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    fullname: '',
    gender: '',
    nationality: '',
    profession: '',
    homeaddress: '',
    homepostal: '',
    securityq: '',
    securityans: '',
  });

  const { updateToken } = useContext(UserContext);
  

  /**
   * Fetches the user's avatar from the server when the component mounts or the userProfile state changes.
   */
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
  
    /**
   * Handles deletion of the user's avatar.
   * Sends a request to the server to delete the current avatar and updates the UI accordingly.
   */
  const handleDeleteAvatar = async () => {
    if (!userProfile || !userProfile._id) return;
  
    try {
      await axios.delete(`http://localhost:3000/api/v1/delpic`, {
        data: { userId: userProfile._id }, 
        headers: { 'Authorization': `Bearer ${token}` }
      });
  
     
      setAvatar({ url: defaultAvatarUrl, name: 'Default Avatar' });
      toast.success("Profile picture removed successfully");
    } catch (error) {
      console.error("Error deleting avatar:", error);
      toast.error("Failed to remove avatar.");
    }
  };

    /**
   * Handles the submission of a new avatar.
   * Encodes the selected image and sends it to the server for upload, then updates the user's avatar.
   *
   * @param {File} file - The file object representing the new avatar image.
   */
  const handleSubmitPic = (file) => {
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
      

      /**
   * Event handler for drag over event on the avatar upload area.
   */
  const handleDragOver = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    setDragOver(true);
  };

    /**
   * Event handler for drop event on the avatar upload area.
   * Handles the file drop, processes the file and uploads the avatar.
   */
  const handleDrop = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    setDragOver(false);
    const file = evt.dataTransfer.files[0];
    handleSubmit(file);
  };

    /**
   * useEffect to populate form data with userProfile information upon loading the component
   * or when userProfile state changes.
   */
  useEffect(() => {
    if (!userProfile) return;
    let q = "";
    switch (userProfile.securityq) {
      case 'firstPet':
        q = "What was the first item you bought with your own money in Singapore?";
        break;
      case 'birthCity':
        q = "In what city/town/village were you born?";
        break;
      case 'childhoodNickname':
        q = "What was your childhood nickname?";
        break;
      case 'favoriteTeacher':
        q = "What is the name of your favorite teacher?";
        break;
      case 'memorableDate':
        q = "What is the first name of your best friend from childhood?";
        break;
      default:
        q = "";
        break;
    }
  

    setFormData({
      fullname: userProfile.fullname,
      gender: userProfile.gender,
      nationality: userProfile.nationality,
      profession: userProfile.profession,
      homeaddress: userProfile.homeaddress,
      homepostal: userProfile.homepostal,
      securityq: userProfile.securityq, 
      securityans: userProfile.securityans,
    });
    
    console.log(formData.securityq);
  }, [userProfile]); 
  
  
   /**
   * Handles changes in form inputs and updates the formData state accordingly.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object from the form input.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    /**
   * Handles the submission of the profile update form. It performs validation
   * on the inputs and sends an update request to the server. Upon successful
   * update, it displays a success message and optionally clears the cache.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    let fullname = e.target.fullname.value;
    let gender = e.target.gender.value;
    let profession=e.target.profession.value;
    let nationality=e.target.nationality.value;
    let homeaddress=e.target.homeaddress.value;
    let homepostal=e.target.homepostal.value;
    let securityq=e.target.securityq.value;
    let securityans=e.target.securityans.value;
    if(!fullname || !profession || !homeaddress || !homepostal || !securityans){
      toast.info("Please fill in all inputs!");
      return;
    }
    if(!isValidSingaporePostalCode(e.target.homepostal.value)){
      toast.info("Please enter a valid 6-digit postal code!");
      return;
    }
      const { username, password, ph} = location.state || {};
      const form = {
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
        const response = await axios.patch(
            "http://localhost:3000/api/v1/update",
            form, {
                headers: { 'Authorization': `Bearer ${token}` }
              }
          );
      toast.success("Profile updated successfully");
      axios.post('http://localhost:3000/api/v1/clear-cache', null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
       
      })
      .catch(error => {
        
      });
      updateToken(token);

    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error("Failed to update profile.");
    }
  };
  const styles = {
    container: {
      maxWidth: '70%',
      margin: 'auto',
    },
    containerUpload: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',   
      height: '300px', 
      backgroundColor: '#19857b', 
      borderRadius: '3px',
      padding: '50px 0',
      ...(isDragOver && {
        backgroundColor: '#abcdef', 
      }),
    },
    containerGrid: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    img: {
        width: '150px', 
        height: '150px',
        margin: '15px 20px 15px 0',
        borderRadius: '50%', 
      },
    input: {
      overflow: 'hidden',
      width: '0',
    },
  };
  return (
    <div className="profile-main">
      <div className="profile-right">
        <div className="profile-right-container">
          <div className="profile-logo">
            <img src={Logo} alt="" />
          </div>
          <div className="profile-center">
            <h2>Update Your Profile</h2>
            <>
      <section
        style={styles.containerUpload}
        onDragOver={handleDragOver}
        onDrop={handleDrop}>
        <i className="fas fa-cloud-upload-alt fa-5x"></i>
        <label>
          <input style={styles.input} type="file" name="avatar" onChange={e => handleSubmitPic(e.target.files[0])}/>
          Choose file to upload
        </label>
        <h3>or drag and drop them here</h3>
      </section>

      <section style={styles.container}>
        <div style={styles.containerGrid}>
          
          <img src={avatar ? avatar.url : defaultAvatarUrl} style={styles.img} alt={avatar ? avatar.name : 'Default Avatar'} />
          {avatar && avatar.url !== defaultAvatarUrl && (
        <button onClick={handleDeleteAvatar}>Remove Picture</button>
      )}
        </div>
      </section>
    </>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Full Name"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                
              />

              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="" disabled>Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>

              <select name="nationality" value={formData.nationality} onChange={handleChange} required>
                <option value="" disabled>Nationality</option>
                <option value="Chinese">Chinese</option>
                <option value="Indian">Indian</option>
                <option value="Malaysian">Malaysian</option>
              </select>

              <input
                type="text"
                placeholder="Profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                
              />

              <input
                type="text"
                placeholder="Home Address"
                name="homeaddress"
                value={formData.homeaddress}
                onChange={handleChange}
               
              />

              <input
                type="text"
                placeholder="Home Postal Code"
                name="homepostal"
                value={formData.homepostal}
                onChange={handleChange}
                maxLength="6"
                
              />

              <select name="securityq" value={formData.securityq} onChange={handleChange} required>
                <option value="" disabled>Choose a security question</option>
                <option value="firstPet">What was the first item you bought with your own money in Singapore?</option>
                    <option value="birthCity">In what city/town/village were you born?</option>
                    <option value="childhoodNickname">What was your childhood nickname?</option>
                    <option value="favoriteTeacher">What is the name of your favorite teacher?</option>
                    <option value="memorableDate">What is the first name of your best friend from childhood?</option>
              </select>

              <input
                type="text"
                placeholder="Security Answer"
                name="securityans"
                value={formData.securityans}
                onChange={handleChange}
                
              />

              <div className="profile-center-buttons">
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;

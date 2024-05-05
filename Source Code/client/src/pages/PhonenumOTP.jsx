//PhonenumOTP.jsx
import { CgSpinner } from "react-icons/cg";
import "../styles/PhonenumOTP.css";
import Logo from "../assets/landscapelogo.png";
import OtpInput from "otp-input-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "./firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { Toaster } from "react-hot-toast";
import { toast } from 'react-toastify';
import {UserContext}  from '../contexts/UserContext';
import {useState, useContext,useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

/**
 * Component for phone number verification and OTP input.
 * Users are directed here for OTP verification during login, registration, or password reset.
 */
const PhonenumOTP = () => {
  const { updateToken } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation(); 
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");

  const [otpTimer, setOtpTimer] = useState(0); 
  const [canResend, setCanResend] = useState(false);
  const [recaptchaContainerId, setRecaptchaContainerId] = useState("recaptcha-container");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);
  const { comingFrom } = location.state || {};
  const { username, password } = location.state || {};

  // Effect hook to navigate user based on authentication status and the source of navigation
  useEffect(() => {
    if (user) {
      if (comingFrom === "register") {
        navigate("/profile", { state: { username, password, ph } });
      } else if (comingFrom === "login") {
        navigate("/dashboard"); 
        
      }
      else if(location.state===null){
        navigate("/securityq",{ state: { ph }});
      }
    }

  }, [user]);

  
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setCanResend(true); 
      clearInterval(interval); 
    }
    return () => clearInterval(interval); 
  }, [otpTimer]);
  

  useEffect(() => {
    
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(otpTimer - 1);
      }, 1000);
    } else {
      setCanResend(true); 
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  useEffect(() => {
    
    const uniqueId = "recaptcha-container-" + new Date().getTime();
    setRecaptchaContainerId(uniqueId);

    const container = document.createElement("div");
    container.id = uniqueId;
    document.body.appendChild(container);

    window.recaptchaVerifier = new RecaptchaVerifier(
      uniqueId,
      {
        size: "invisible",
        callback: (response) => {
          
        },
        "expired-callback": () => {
          
        },
      },
      auth
    );

    window.recaptchaVerifier.render();

    return () => {
      
      const element = document.getElementById(uniqueId);
      if (element) {
        element.remove();
      }
    };
  }, []);

   /**
 * Initiates the OTP sending process. This function is called when the user submits their phone number. It validates
 * the phone number, sets up the reCAPTCHA verifier, and uses Firebase's signInWithPhoneNumber to send an OTP. Upon
 * success, it displays the OTP input field and starts the OTP timer.
 */
  async function onSignup(e) {
    
    if (e) e.preventDefault();
    let phonenum=ph;

    setLoading(true);
    if(comingFrom==="register"){
      if(phonenum==""){
        toast.error("Please enter a valid phone number!");
        return;
      }
    try {
      
      const response = await axios.post("http://localhost:3000/api/v1/phoneauth", { ph: phonenum });
      
    } catch (err) {
      setLoading(false);
      toast.error(err.response?.data?.msg);
      return;
    }}
    if(comingFrom==="login"){
        try {
            const { username } = location.state || {};
            const response = await axios.post("http://localhost:3000/api/v1/loginphauth", { username: username });
            phonenum = response.data.ph; 
            
          } catch (err) {
            setLoading(false);
            toast.error(err.response?.data?.msg);
            return;
          }
      
    }
    if(location.state===null){
      if(phonenum==""){
        toast.error("Please enter a valid phone number!");
        return;
      }
      try {
        const response = await axios.post("http://localhost:3000/api/v1/forgotpasswordphauth", { ph: phonenum });
        } catch (err) {
          setLoading(false);
          toast.error(err.response?.data?.msg);
          return;
        }
    
  }
    
    const appVerifier = window.recaptchaVerifier;
    const formatPh = "+" + phonenum; 
    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setShowOTP(true);
        toast.success("OTP sent successfully!");
        startOtpTimer(60); 
      })
      .catch((error) => {
        toast.warn("Failed to send OTP. Please ensure that you have entered a valid phone number!")
        console.error(error);
        setOtpTimer(0); 
        setCanResend(true);
      })
      .finally(() => {
        setLoading(false); 
      });
  }

  const startOtpTimer = (duration) => {
    setOtpTimer(duration);
    setCanResend(false); 
  };

   /**
 * Handles the OTP resend request. This function is invoked when the user clicks the "Resend OTP" button after the
 * initial OTP timer has elapsed. It essentially calls the onSignup function to resend the OTP.
 */
  const resendOtp = async () => {
    onSignup(); 
  };

    /**
 * Verifies the entered OTP against Firebase Authentication. Upon successful verification, it navigates the user
 * to the appropriate route based on the originating action and updates the authentication token if necessary.
 */
  async function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => { 
        toast.success("OTP verified!");
        if (comingFrom === "login") {
          try {
            const response = await axios.post("http://localhost:3000/api/v1/giveToken", { username: username });
            
            updateToken((response.data.token));

          } catch (error) {
            console.error(error);
            
          }
        }
        setUser(res.user);
      

      })
      .catch((err) => {
        console.error(err);
        toast.error("OTP verification failed.");
        setOtpTimer(0); 
        setCanResend(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }


  return (
    <section className="bg-emerald-500 flex items-center justify-center h-screen">
    <div id={recaptchaContainerId}></div>
    <Toaster toastOptions={{ duration: 4000 }} />
    <div id="recaptcha-container"></div>
    <div className="OTP-main">
      <div className="OTP-right-container">
          <img className="OTP-logo" src={Logo} alt="" />
          <div className="w-80 flex flex-col gap-4 rounded-lg p-4">
            {showOTP ? (
              <>

                <label
                  htmlFor="otp"
                  className="otp"
                >
                  <p className="title">Enter your OTP</p>
                </label>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  OTPLength={6}
                  otpType="number"
                  disabled={false}
                  autoFocus
                  className="opt-container "
                ></OtpInput>
                

                {otpTimer > 0 ? (<>
                                  <button
                                  onClick={onOTPVerify}
                                  className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                                  id="OTP-button"
                                >
                                  {loading && (
                                    <CgSpinner size={20} className="mt-1 animate-spin" />
                                  )}
                                  <span>Verify OTP</span>
                                </button>
              <div className="text-center mt-4 text-white">
                Resend code in {otpTimer} seconds
              </div>
              </>
            ) : (
              <button
                onClick={resendOtp}
                disabled={!canResend}
                className={`mt-4 ${canResend ? 'bg-emerald-600' : 'bg-emerald-300'} OTP-button w-full flex items-center justify-center py-2.5 text-white rounded`}
                id="OTP-button"
              >
                                                  {loading && (
                                    <CgSpinner size={20} className="mt-1 animate-spin" />
                                  )}
                <span>Resend OTP</span>
              </button>
            )}
              </>
            ) : (
              <>
                <>
                {comingFrom === "register" && (
                    <>
                    <label htmlFor="" className="register-block">
                      <p className="title">Verify your phone number</p>
                    </label><br></br>
                    <PhoneInput country={"sg"} value={ph} onChange={setPh} />

                    </>
                )}
                {location.state===null && (
                    <>
                    <label htmlFor="" className="forgotpassword-block">
                        <p className="title">Verify your phone number</p> The number must be already registered with an existing account
                    </label><br></br>
                    <PhoneInput country={"sg"} value={ph} onChange={setPh} />

                    </>
                )}
                {comingFrom === "login" && (
                    <>
                    <label htmlFor="" className="login-block">
                    <p className="title">Verify your registered phone number</p>
                    </label><br></br>
                    </>
                )}
                </>
                <button id="OTP-button" onClick={onSignup} className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded">
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Send code via SMS</span>
                </button>
              </>
            )}
          </div>
        </div>
      {/* )} */}
    </div>
    </section>
  );

};

export default PhonenumOTP;

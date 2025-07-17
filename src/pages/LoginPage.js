// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Alert } from "react-bootstrap";
// import { FcGoogle } from "react-icons/fc";
// import { useUserAuth } from "../context/UserAuthContext";
// import "../styles/Login.css";

// const Login = () => {
//   const navigate = useNavigate();
//   const { setUser, googleSignIn } = useUserAuth();

//   const [countryCode, setCountryCode] = useState("+91");
//   const [mobile, setMobile] = useState("");
//   const [otp, setOtp] = useState("");
//   const [email, setEmail] = useState("");
//   const [emailOtp, setEmailOtp] = useState("");
//   const [error, setError] = useState("");
//   const [isMobileOtpSent, setIsMobileOtpSent] = useState(false);
//   const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);
//   const [showOtp, setShowOtp] = useState(false);
//   const [showEmailOtp, setShowEmailOtp] = useState(false);

//   const mockOtp = "111111"; // Simulated OTP for testing
//   const realToken = process.env.REACT_APP_LOGIN_TOKEN; // 

//   const handleSendMobileOtp = () => {
//     if (!mobile) return setError("Enter mobile number");
//     setError("");
//     setIsMobileOtpSent(true);
//   };

//   const handleVerifyMobileOtp = () => {
//     console.log('handled mobile otp')
//     if (otp === mockOtp) {
//       const userObj = { mobile: `${countryCode}${mobile}` };
//       localStorage.setItem("user", JSON.stringify(userObj));
//       localStorage.setItem("token", realToken);
//       setUser(userObj);
//       navigate("/");
//     } else {
//       setError("Invalid OTP for mobile login.");
//     }
//   };

//   const handleSendEmailOtp = () => {
//     if (!email) return setError("Enter email");
//     setError("");
//     setIsEmailOtpSent(true);
//   };

//   const handleVerifyEmailOtp = () => {
//     if (emailOtp === mockOtp) {
//       const userObj = { email };
//       localStorage.setItem("user", JSON.stringify(userObj));
//       localStorage.setItem("token", realToken);
//       setUser(userObj);
//       navigate("/");
//     } else {
//       setError("Invalid OTP for email login.");
//     }
//   };

//   const handleGoogleLogin = async () => {
//     try {
//       const result = await googleSignIn();
//       const user = result.user;
//       const userObj = {
//         email: user.email,
//         name: user.displayName,
//         photo: user.photoURL,
//       };
//       localStorage.setItem("user", JSON.stringify(userObj));
//       localStorage.setItem("token", realToken);
//       setUser(userObj);
//       navigate("/");
//     } catch (err) {
//       console.error("Google login failed:", err);
//       setError("Google login failed. Make sure Firebase is configured and domain is allowed.");
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <h3 className="login-title">Login</h3>
//         {error && <Alert variant="danger">{error}</Alert>}

//         {/* 📱 Phone Login */}
//         <div className="phone-input-group">
//           <select
//             className="country-code"
//             value={countryCode}
//             onChange={(e) => setCountryCode(e.target.value)}
//           >
//             <option value="+91">🇮🇳 +91</option>
//             <option value="+1">🇺🇸 +1</option>
//             <option value="+44">🇬🇧 +44</option>
//             <option value="+61">🇦🇺 +61</option>
//             <option value="+81">🇯🇵 +81</option>
//             <option value="+971">🇦🇪 +971</option>
//             <option value="+65">🇸🇬 +65</option>
//             <option value="+60">🇲🇾 +60</option>
//             <option value="+880">🇧🇩 +880</option>
//             <option value="+92">🇵🇰 +92</option>
//             <option value="+94">🇱🇰 +94</option>
//             <option value="+86">🇨🇳 +86</option>
//             <option value="+49">🇩🇪 +49</option>
//             <option value="+33">🇫🇷 +33</option>
//             <option value="+39">🇮🇹 +39</option>
//             <option value="+34">🇪🇸 +34</option>
//             <option value="+7">🇷🇺 +7</option>
//             <option value="+55">🇧🇷 +55</option>
//             <option value="+27">🇿🇦 +27</option>
//             <option value="+62">🇮🇩 +62</option>
//             <option value="+82">🇰🇷 +82</option>
//           </select>
//           <input
//             className="input-field"
//             placeholder="Enter phone number"
//             value={mobile}
//             onChange={(e) => setMobile(e.target.value)}
//           />
//         </div>

//         {!isMobileOtpSent ? (
//           <button className="btn-primary" onClick={handleSendMobileOtp}>
//             SEND OTP
//           </button>
//         ) : (
//           <>
//             <div className="input-field-group">
//               <input
//                 type={showOtp ? "text" : "password"}
//                 className="input-field with-icon"
//                 placeholder="Enter OTP"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//               />
//               <span className="input-icon" onClick={() => setShowOtp(!showOtp)}>
//                 {showOtp ? "🙈" : "👁️"}
//               </span>
//             </div>
//             <button className="btn-primary" onClick={handleVerifyMobileOtp}>
//               SUBMIT OTP
//             </button>
//           </>
//         )}

//         <div className="divider">OR</div>

//         {/* 📧 Email Login */}
//         <div className="input-field-group full-width">
//           <input
//             type="email"
//             className="input-field"
//             placeholder="Enter Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>

//         {!isEmailOtpSent ? (
//           <button className="btn-secondary" onClick={handleSendEmailOtp}>
//             SEND OTP
//           </button>
//         ) : (
//           <>
//             <div className="input-field-group">
//               <input
//                 type={showEmailOtp ? "text" : "password"}
//                 className="input-field with-icon"
//                 placeholder="Enter Email OTP"
//                 value={emailOtp}
//                 onChange={(e) => setEmailOtp(e.target.value)}
//               />
//               <span className="input-icon" onClick={() => setShowEmailOtp(!showEmailOtp)}>
//                 {showEmailOtp ? "🙈" : "👁️"}
//               </span>
//             </div>
//             <button className="btn-secondary" onClick={handleVerifyEmailOtp}>
//               SUBMIT OTP
//             </button>
//           </>
//         )}

//         <div className="divider">OR</div>

//         {/* ✅ Google Login */}
//         <button className="btn-google" onClick={handleGoogleLogin}>
//           <FcGoogle className="icon google-icon" />
//           <span>Login with Google</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Login;



















// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Alert } from "react-bootstrap";
// import { FcGoogle } from "react-icons/fc";
// import {
//   getAuth,
//   RecaptchaVerifier,
//   signInWithPhoneNumber,
// } from "firebase/auth";
// import { useUserAuth } from "../context/UserAuthContext";
// import "../styles/Login.css";

// const Login = () => {
//   const navigate = useNavigate();
//   const { setUser, googleSignIn } = useUserAuth();
//   const [countryCode, setCountryCode] = useState("+91");
//   const [mobile, setMobile] = useState("");
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [showOtp, setShowOtp] = useState(false);

//   const auth = getAuth();

//   // ✅ Setup Recaptcha with modular SDK
//   const setupRecaptcha = () => {
//     if (!window.recaptchaVerifier) {
//       window.recaptchaVerifier = new RecaptchaVerifier(
//         auth, // ✅ must be first in Firebase v9+
//         "recaptcha-container",
//         {
//           size: "invisible",
//           callback: () => {
//             // reCAPTCHA solved
//           },
//           "expired-callback": () => {
//             console.warn("Recaptcha expired");
//           },
//         }
//       );
//     }
//   };

//   // ✅ Send OTP
//   const handleSendOtp = () => {
//     setError("");
//     if (!mobile) return setError("Enter mobile number");

//     const phoneNumber = `${countryCode}${mobile}`;
//     setupRecaptcha();

//     const appVerifier = window.recaptchaVerifier;

//     signInWithPhoneNumber(auth, phoneNumber, appVerifier)
//       .then((confirmationResult) => {
//         window.confirmationResult = confirmationResult;
//         setOtpSent(true);
//       })
//       .catch((err) => {
//         console.error("OTP send error:", err);
//         setError("OTP send failed. Please check Firebase setup.");
//       });
//   };

//   // ✅ Verify OTP
//   const handleVerifyOtp = () => {
//     if (!otp) return setError("Enter OTP");

//     window.confirmationResult
//       .confirm(otp)
//       .then((result) => {
//         const user = result.user;
//         const userObj = {
//           mobile: user.phoneNumber,
//         };
//         localStorage.setItem("user", JSON.stringify(userObj));
//         setUser(userObj);
//         navigate("/");
//       })
//       .catch(() => {
//         setError("Invalid OTP. Try again.");
//       });
//   };

//   // ✅ Google Login
//   const handleGoogleLogin = async () => {
//     try {
//       const result = await googleSignIn();
//       const user = result.user;
//       const userObj = {
//         email: user.email,
//         name: user.displayName,
//         photo: user.photoURL,
//       };
//       localStorage.setItem("user", JSON.stringify(userObj));
//       setUser(userObj);
//       navigate("/");
//     } catch (err) {
//       console.error("Google login failed:", err);
//       setError("Google login failed. Please check Firebase config.");
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <h3 className="login-title">Login</h3>
//         {error && <Alert variant="danger">{error}</Alert>}

//         {/* 🌐 Country Code + Mobile Input */}
//         <div className="phone-input-group">
//           <select
//             className="country-code"
//             value={countryCode}
//             onChange={(e) => setCountryCode(e.target.value)}
//           >
//             <option value="+91">🇮🇳 +91</option>
//             <option value="+1">🇺🇸 +1</option>
//             <option value="+44">🇬🇧 +44</option>
//             <option value="+971">🇦🇪 +971</option>
//             <option value="+61">🇦🇺 +61</option>
//             <option value="+81">🇯🇵 +81</option>
//             <option value="+65">🇸🇬 +65</option>
//             <option value="+60">🇲🇾 +60</option>
//             <option value="+880">🇧🇩 +880</option>
//             <option value="+92">🇵🇰 +92</option>
//             <option value="+94">🇱🇰 +94</option>
//             <option value="+86">🇨🇳 +86</option>
//             <option value="+49">🇩🇪 +49</option>
//             <option value="+33">🇫🇷 +33</option>
//             <option value="+39">🇮🇹 +39</option>
//             <option value="+34">🇪🇸 +34</option>
//             <option value="+7">🇷🇺 +7</option>
//             <option value="+55">🇧🇷 +55</option>
//             <option value="+27">🇿🇦 +27</option>
//             <option value="+62">🇮🇩 +62</option>
//             <option value="+82">🇰🇷 +82</option>
//           </select>

//           <input
//             className="input-field"
//             placeholder="Enter mobile number"
//             value={mobile}
//             onChange={(e) => setMobile(e.target.value)}
//           />
//         </div>

//         {/* 🔘 OTP Send / Submit Flow */}
//         {!otpSent ? (
//           <button className="btn-primary" onClick={handleSendOtp}>
//             SEND OTP
//           </button>
//         ) : (
//           <>
//             <div className="input-field-group">
//               <input
//                 type={showOtp ? "text" : "password"}
//                 className="input-field with-icon"
//                 placeholder="Enter OTP"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//               />
//               <span className="input-icon" onClick={() => setShowOtp(!showOtp)}>
//                 {showOtp ? "🙈" : "👁️"}
//               </span>
//             </div>
//             <button className="btn-primary" onClick={handleVerifyOtp}>
//               SUBMIT OTP
//             </button>
//           </>
//         )}

//         <div className="divider">OR</div>

//         {/* ✅ Google Login */}
//         <button className="btn-google" onClick={handleGoogleLogin}>
//           <FcGoogle className="icon google-icon" />
//           <span>Login with Google</span>
//         </button>

//         {/* 🔒 Required for reCAPTCHA */}
//         <div id="recaptcha-container" />
//       </div>
//     </div>
//   );
// };

// export default Login;








// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Alert } from "react-bootstrap";
// import { FcGoogle } from "react-icons/fc";
// import {
//   getAuth,
//   RecaptchaVerifier,
//   signInWithPhoneNumber,
// } from "firebase/auth";
// import { useUserAuth } from "../context/UserAuthContext";
// import { sendMobileOtp } from "../api/api"; // ✅ import your backend API
// import "../styles/Login.css";

// const Login = () => {
//   const navigate = useNavigate();
//   const { setUser, googleSignIn } = useUserAuth();
//   const [countryCode, setCountryCode] = useState("+91");
//   const [mobile, setMobile] = useState("");
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [showOtp, setShowOtp] = useState(false);

//   const auth = getAuth();

//   // ✅ Setup Recaptcha
//   const setupRecaptcha = () => {
//     if (!window.recaptchaVerifier) {
//       window.recaptchaVerifier = new RecaptchaVerifier(
//         auth,
//         "recaptcha-container",
//         {
//           size: "invisible",
//           callback: () => {},
//         }
//       );
//     }
//   };

//   // ✅ Firebase OTP send + backend trigger
//   const handleSendOtp = () => {
//     setError("");
//     if (!mobile) return setError("Enter mobile number");

//     const phoneNumber = `${countryCode}${mobile}`;
//     setupRecaptcha();
//     const appVerifier = window.recaptchaVerifier;

//     signInWithPhoneNumber(auth, phoneNumber, appVerifier)
//       .then(async (confirmationResult) => {
//         window.confirmationResult = confirmationResult;
//         setOtpSent(true);

//         // ✅ Optional: Send to backend too (to trigger their flow)
//         try {
//           await sendMobileOtp(phoneNumber);
//         } catch (err) {
//           console.warn("Backend OTP sync failed:", err.response?.data || err.message);
//         }
//       })
//       .catch((err) => {
//         console.error("OTP send error:", err);
//         setError("OTP send failed. Please check Firebase setup.");
//       });
//   };

//   // ✅ OTP verify via Firebase + backend auth sync
//   const handleVerifyOtp = () => {
//     if (!otp) return setError("Enter OTP");

//     window.confirmationResult
//       .confirm(otp)
//       .then(async (result) => {
//         const firebaseUser = result.user;
//         const mobile_number = firebaseUser.phoneNumber;

//         // ✅ Backend store
//         try {
//           const backendResponse = await sendMobileOtp(mobile_number);

//           const userObj = {
//             mobile: mobile_number,
//             backendUser: backendResponse,
//           };

//           localStorage.setItem("user", JSON.stringify(userObj));
//           if (backendResponse.token) {
//             localStorage.setItem("token", backendResponse.token);
//           }

//           setUser(userObj);
//           navigate("/");
//         } catch (err) {
//           console.error("Backend login sync failed:", err);
//           setError("OTP verified but backend login failed.");
//           // Still allow forward navigation
//           const fallbackUser = { mobile: mobile_number };
//           setUser(fallbackUser);
//           localStorage.setItem("user", JSON.stringify(fallbackUser));
//           navigate("/");
//         }
//       })
//       .catch((err) => {
//         console.error("OTP verification failed:", err);
//         setError("Invalid OTP. Try again.");
//       });
//   };

//   // ✅ Google Login
//   const handleGoogleLogin = async () => {
//     try {
//       const result = await googleSignIn();
//       const user = result.user;
//       const userObj = {
//         email: user.email,
//         name: user.displayName,
//         photo: user.photoURL,
//       };
//       localStorage.setItem("user", JSON.stringify(userObj));
//       setUser(userObj);
//       navigate("/");
//     } catch (err) {
//       console.error("Google login failed:", err);
//       setError("Google login failed. Please check Firebase config.");
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <h3 className="login-title">Login</h3>
//         {error && <Alert variant="danger">{error}</Alert>}

//         {/* 🌐 Country Code + Phone Input */}
//         <div className="phone-input-group">
//           <select
//             className="country-code"
//             value={countryCode}
//             onChange={(e) => setCountryCode(e.target.value)}
//           >
//             <option value="+91">🇮🇳 +91</option>
//             <option value="+1">🇺🇸 +1</option>
//             <option value="+44">🇬🇧 +44</option>
//             <option value="+971">🇦🇪 +971</option>
//             <option value="+61">🇦🇺 +61</option>
//             <option value="+81">🇯🇵 +81</option>
//             <option value="+65">🇸🇬 +65</option>
//             <option value="+60">🇲🇾 +60</option>
//             <option value="+880">🇧🇩 +880</option>
//             <option value="+92">🇵🇰 +92</option>
//             <option value="+94">🇱🇰 +94</option>
//             <option value="+86">🇨🇳 +86</option>
//             <option value="+49">🇩🇪 +49</option>
//             <option value="+33">🇫🇷 +33</option>
//             <option value="+39">🇮🇹 +39</option>
//             <option value="+34">🇪🇸 +34</option>
//             <option value="+7">🇷🇺 +7</option>
//             <option value="+55">🇧🇷 +55</option>
//             <option value="+27">🇿🇦 +27</option>
//             <option value="+62">🇮🇩 +62</option>
//             <option value="+82">🇰🇷 +82</option>
//           </select>

//           <input
//             className="input-field"
//             placeholder="Enter mobile number"
//             value={mobile}
//             onChange={(e) => setMobile(e.target.value)}
//           />
//         </div>

//         {!otpSent ? (
//           <button className="btn-primary" onClick={handleSendOtp}>
//             SEND OTP
//           </button>
//         ) : (
//           <>
//             <div className="input-field-group">
//               <input
//                 type={showOtp ? "text" : "password"}
//                 className="input-field with-icon"
//                 placeholder="Enter OTP"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//               />
//               <span className="input-icon" onClick={() => setShowOtp(!showOtp)}>
//                 {showOtp ? "🙈" : "👁️"}
//               </span>
//             </div>
//             <button className="btn-primary" onClick={handleVerifyOtp}>
//               SUBMIT OTP
//             </button>
//           </>
//         )}

//         <div className="divider">OR</div>

//         {/* ✅ Google Login */}
//         <button className="btn-google" onClick={handleGoogleLogin}>
//           <FcGoogle className="icon google-icon" />
//           <span>Login with Google</span>
//         </button>

//         {/* 🔒 reCAPTCHA placeholder */}
//         <div id="recaptcha-container" />
//       </div>
//     </div>
//   );
// };

// export default Login;








// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Alert } from "react-bootstrap";
// import { FcGoogle } from "react-icons/fc";
// import {
//   getAuth,
//   RecaptchaVerifier,
//   signInWithPhoneNumber,
// } from "firebase/auth";
// import { useUserAuth } from "../context/UserAuthContext";
// import { sendMobileOtp } from "../api/api"; // ✅ API for /api/v1/auth/
// import "../styles/Login.css";

// const Login = () => {
//   const navigate = useNavigate();
//   const { setUser, googleSignIn } = useUserAuth();

//   const [countryCode, setCountryCode] = useState("+91");
//   const [mobile, setMobile] = useState("");
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [showOtp, setShowOtp] = useState(false);

//   const auth = getAuth();

//   // ✅ Setup Recaptcha
//   const setupRecaptcha = () => {
//     if (!window.recaptchaVerifier) {
//       window.recaptchaVerifier = new RecaptchaVerifier(
//         auth,
//         "recaptcha-container",
//         {
//           size: "invisible",
//           callback: () => {},
//         }
//       );
//     }
//   };

//   // ✅ Send OTP via Firebase + optional pre-auth call
//   const handleSendOtp = () => {
//     setError("");
//     if (!mobile) return setError("Enter mobile number");

//     const phoneNumber = `${countryCode}${mobile}`;
//     setupRecaptcha();
//     const appVerifier = window.recaptchaVerifier;

//     signInWithPhoneNumber(auth, phoneNumber, appVerifier)
//       .then(async (confirmationResult) => {
//         window.confirmationResult = confirmationResult;
//         setOtpSent(true);
//         alert("OTP sent!");

//         // Optional: Pre-auth API trigger (can skip if not required)
//         try {
//           await sendMobileOtp(phoneNumber);
//         } catch (err) {
//           console.warn("Backend pre-auth failed (optional):", err.response?.data || err.message);
//         }
//       })
//       .catch((err) => {
//         console.error("OTP send error:", err);
//         setError("Failed to send OTP. Check Firebase setup.");
//       });
//   };

//   // ✅ Verify OTP with Firebase + then trigger /api/v1/auth/
//   const handleVerifyOtp = () => {
//     if (!otp) return setError("Enter OTP");

//     window.confirmationResult
//       .confirm(otp)
//       .then(async (result) => {
//         const firebaseUser = result.user;
//         const mobile_number = firebaseUser.phoneNumber;

//         console.log("✅ Firebase OTP verified:", mobile_number);
//         try {
//           const backendResponse = await sendMobileOtp(mobile_number);
//           console.log("✅ /api/v1/auth/ response:", backendResponse);

//           const userObj = {
//             mobile: mobile_number,
//             backendUser: backendResponse,
//           };

//           localStorage.setItem("user", JSON.stringify(userObj));
//           if (backendResponse.token) {
//             localStorage.setItem("token", backendResponse.token);
//           }

//           setUser(userObj);
//           navigate("/");
//         } catch (err) {
//           console.error("❌ Backend auth failed:", err?.response?.data || err.message);
//           setError("OTP verified, but backend login failed.");
//           const fallbackUser = { mobile: mobile_number };
//           setUser(fallbackUser);
//           localStorage.setItem("user", JSON.stringify(fallbackUser));
//           navigate("/");
//         }
//       })
//       .catch((err) => {
//         console.error("❌ Firebase OTP verification failed:", err);
//         setError("Invalid OTP. Try again.");
//       });
//   };

//   // ✅ Google Login
//   const handleGoogleLogin = async () => {
//     try {
//       const result = await googleSignIn();
//       const user = result.user;
//       const userObj = {
//         email: user.email,
//         name: user.displayName,
//         photo: user.photoURL,
//       };
//       localStorage.setItem("user", JSON.stringify(userObj));
//       setUser(userObj);
//       navigate("/");
//     } catch (err) {
//       console.error("Google login failed:", err);
//       setError("Google login failed. Check Firebase config.");
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <h3 className="login-title">Login</h3>
//         {error && <Alert variant="danger">{error}</Alert>}

//         {/* 🌐 Phone Input */}
//         <div className="phone-input-group">
//           <select
//             className="country-code"
//             value={countryCode}
//             onChange={(e) => setCountryCode(e.target.value)}
//           >
//             <option value="+91">🇮🇳 +91</option>
//             <option value="+1">🇺🇸 +1</option>
//             <option value="+44">🇬🇧 +44</option>
//             <option value="+971">🇦🇪 +971</option>
//             <option value="+61">🇦🇺 +61</option>
//             <option value="+81">🇯🇵 +81</option>
//             <option value="+65">🇸🇬 +65</option>
//             <option value="+60">🇲🇾 +60</option>
//             <option value="+880">🇧🇩 +880</option>
//             <option value="+92">🇵🇰 +92</option>
//             <option value="+94">🇱🇰 +94</option>
//             <option value="+86">🇨🇳 +86</option>
//             <option value="+49">🇩🇪 +49</option>
//             <option value="+33">🇫🇷 +33</option>
//             <option value="+39">🇮🇹 +39</option>
//             <option value="+34">🇪🇸 +34</option>
//             <option value="+7">🇷🇺 +7</option>
//             <option value="+55">🇧🇷 +55</option>
//             <option value="+27">🇿🇦 +27</option>
//             <option value="+62">🇮🇩 +62</option>
//             <option value="+82">🇰🇷 +82</option>
//           </select>
//           <input
//             className="input-field"
//             placeholder="Enter mobile number"
//             value={mobile}
//             onChange={(e) => setMobile(e.target.value)}
//           />
//         </div>

//         {!otpSent ? (
//           <button className="btn-primary" onClick={handleSendOtp}>
//             SEND OTP
//           </button>
//         ) : (
//           <>
//             <div className="input-field-group">
//               <input
//                 type={showOtp ? "text" : "password"}
//                 className="input-field with-icon"
//                 placeholder="Enter OTP"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//               />
//               <span className="input-icon" onClick={() => setShowOtp(!showOtp)}>
//                 {showOtp ? "🙈" : "👁️"}
//               </span>
//             </div>
//             <button className="btn-primary" onClick={handleVerifyOtp}>
//               SUBMIT OTP
//             </button>
//           </>
//         )}

//         <div className="divider">OR</div>

//         {/* ✅ Google Login */}
//         <button className="btn-google" onClick={handleGoogleLogin}>
//           <FcGoogle className="icon google-icon" />
//           <span>Login with Google</span>
//         </button>

//         <div id="recaptcha-container" />
//       </div>
//     </div>
//   );
// };

// export default Login;




























import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";
import { FcGoogle } from "react-icons/fc";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { useUserAuth } from "../context/UserAuthContext";
import { sendMobileOtp } from "../api/api"; // ✅ /api/v1/auth/ API
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { setUser, googleSignIn } = useUserAuth();

  const [countryCode, setCountryCode] = useState("+91");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

  const auth = getAuth();

  // ✅ Setup invisible reCAPTCHA
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {},
      });
    }
  };

  // ✅ Send OTP via Firebase only
  const handleSendOtp = () => {
    setError("");
    if (!mobile) return setError("Enter mobile number");

    const phoneNumber = `${countryCode}${mobile}`;
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setOtpSent(true);
        alert("OTP sent!");
        // ✅ Do NOT call sendMobileOtp() here
      })
      .catch((err) => {
        console.error("OTP send error:", err);
        setError("Failed to send OTP. Please check Firebase setup.");
      });
  };

  // ✅ Verify OTP and call backend /api/v1/auth/
  const handleVerifyOtp = () => {
    if (!otp) return setError("Enter OTP");

    window.confirmationResult
      .confirm(otp)
      .then(async (result) => {
        const firebaseUser = result.user;
        const mobile_number = firebaseUser.phoneNumber;

        console.log("✅ Firebase OTP verified:", mobile_number);

        try {
          const backendResponse = await sendMobileOtp(mobile_number);
          console.log("✅ /api/v1/auth/ response:", backendResponse);

          const userObj = {
            mobile: mobile_number,
            backendUser: backendResponse,
          };

          localStorage.setItem("user", JSON.stringify(userObj));
          if (backendResponse.token) {
            localStorage.setItem("token", backendResponse.token);
          }

          setUser(userObj);
          navigate("/");
        } catch (err) {
          console.error("❌ Backend auth failed:", err?.response?.data || err.message);
          setError("OTP verified, but backend login failed.");
          const fallbackUser = { mobile: mobile_number };
          setUser(fallbackUser);
          localStorage.setItem("user", JSON.stringify(fallbackUser));
          navigate("/");
        }
      })
      .catch((err) => {
        console.error("❌ Firebase OTP verification failed:", err);
        setError("Invalid OTP. Please try again.");
      });
  };

  // ✅ Google login
  const handleGoogleLogin = async () => {
    try {
      const result = await googleSignIn();
      const user = result.user;
      const userObj = {
        email: user.email,
        name: user.displayName,
        photo: user.photoURL,
      };
      localStorage.setItem("user", JSON.stringify(userObj));
      setUser(userObj);
      navigate("/");
    } catch (err) {
      console.error("Google login failed:", err);
      setError("Google login failed. Please check Firebase config.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h3 className="login-title">Login</h3>
        {error && <Alert variant="danger">{error}</Alert>}

        {/* 📱 Country Code + Phone */}
        <div className="phone-input-group">
          <select
            className="country-code"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
          >
            <option value="+91">🇮🇳 +91</option>
            <option value="+1">🇺🇸 +1</option>
            <option value="+44">🇬🇧 +44</option>
            <option value="+971">🇦🇪 +971</option>
            <option value="+61">🇦🇺 +61</option>
            <option value="+81">🇯🇵 +81</option>
            <option value="+65">🇸🇬 +65</option>
            <option value="+60">🇲🇾 +60</option>
            <option value="+880">🇧🇩 +880</option>
            <option value="+92">🇵🇰 +92</option>
            <option value="+94">🇱🇰 +94</option>
            <option value="+86">🇨🇳 +86</option>
            <option value="+49">🇩🇪 +49</option>
            <option value="+33">🇫🇷 +33</option>
            <option value="+39">🇮🇹 +39</option>
            <option value="+34">🇪🇸 +34</option>
            <option value="+7">🇷🇺 +7</option>
            <option value="+55">🇧🇷 +55</option>
            <option value="+27">🇿🇦 +27</option>
            <option value="+62">🇮🇩 +62</option>
            <option value="+82">🇰🇷 +82</option>
          </select>
          <input
            className="input-field"
            placeholder="Enter mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>

        {!otpSent ? (
          <button className="btn-primary" onClick={handleSendOtp}>
            SEND OTP
          </button>
        ) : (
          <>
            <div className="input-field-group">
              <input
                type={showOtp ? "text" : "password"}
                className="input-field with-icon"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <span className="input-icon" onClick={() => setShowOtp(!showOtp)}>
                {showOtp ? "🙈" : "👁️"}
              </span>
            </div>
            <button className="btn-primary" onClick={handleVerifyOtp}>
              SUBMIT OTP
            </button>
          </>
        )}

        <div className="divider">OR</div>

        {/* ✅ Google Sign-In */}
        <button className="btn-google" onClick={handleGoogleLogin}>
          <FcGoogle className="icon google-icon" />
          <span>Login with Google</span>
        </button>

        <div id="recaptcha-container" />
      </div>
    </div>
  );
};

export default Login;

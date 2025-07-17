// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// // Replace these with your Firebase config values
// const firebaseConfig = {
//   apiKey: "AIzaSyDhNOVISD9DH7HjQkPiM5sMKKWka7F7XvY",
//   authDomain: "devalayas-project.firebaseapp.com",
//   projectId: "devalayas-project",
//   storageBucket: "devalayas-project.firebasestorage.app",
//   messagingSenderId: "713471432921",
//   appId: "1:713471432921:web:ab790ba93d6c55708986c8",
//   measurementId: "G-LPVTXV1718"
// };

// // Initialize Firebase
// const firebase = initializeApp(firebaseConfig);

// // Auth setup
// const auth = getAuth(firebase);
// const provider = new GoogleAuthProvider();

// // ✅ Fix: export properly
// export { auth, provider, signInWithPopup, firebase };










// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


  const firebaseConfig = {
  apiKey: "AIzaSyDtv0fNj2JuvVppvCmyOvZGaqSn8-QPPsk",
  authDomain: "devotee-7c463.firebaseapp.com",
  projectId: "devotee-7c463",
  storageBucket: "devotee-7c463.appspot.com",
  messagingSenderId: "196593785407",
  appId: "1:196593785407:web:2ee5c24de0b8668a46368a",
  measurementId: "G-1NHD2B13X0"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };

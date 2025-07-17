// // src/context/UserAuthContext.js
// import React, { createContext, useContext, useState, useEffect } from "react";
// import {
//   getAuth,
//   onAuthStateChanged,
//   signOut,
//   signInWithPopup,
//   GoogleAuthProvider,
// } from "firebase/auth";

// const UserAuthContext = createContext();

// export const UserAuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     const storedUser = localStorage.getItem("user");
//     return storedUser ? JSON.parse(storedUser) : null;
//   });

//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       if (currentUser) {
//         const googleUser = {
//           name: currentUser.displayName,
//           email: currentUser.email,
//           photo: currentUser.photoURL,
//         };
//         localStorage.setItem("user", JSON.stringify(googleUser));

//         const apiToken = process.env.REACT_APP_API_TOKEN;
//         if (apiToken) {
//           localStorage.setItem("token", apiToken);
//         }

//         setUser(googleUser);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const googleSignIn = () => {
//     const auth = getAuth();
//     const provider = new GoogleAuthProvider();
//     return signInWithPopup(auth, provider);
//   };

//   // ✅ Renamed to match usage in ProfilePage
//   const logOut = () => {
//     const auth = getAuth();
//     return signOut(auth).then(() => {
//       setUser(null);
//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//     });
//   };

//   return (
//     <UserAuthContext.Provider value={{ user, setUser, googleSignIn, logOut }}>
//       {children}
//     </UserAuthContext.Provider>
//   );
// };

// export const useUserAuth = () => useContext(UserAuthContext);




















// // src/context/UserAuthContext.js

// import React, { createContext, useContext, useState, useEffect } from "react";
// import {
//   getAuth,
//   onAuthStateChanged,
//   signOut,
//   signInWithPopup,
//   GoogleAuthProvider,
// } from "firebase/auth";

// // Create context
// const UserAuthContext = createContext();

// // Provider
// export const UserAuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     const storedUser = localStorage.getItem("user");
//     return storedUser ? JSON.parse(storedUser) : null;
//   });

//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       if (currentUser) {
//         const googleUser = {
//           name: currentUser.displayName,
//           email: currentUser.email,
//           photo: currentUser.photoURL,
//         };
//         localStorage.setItem("user", JSON.stringify(googleUser));

//         const apiToken = process.env.REACT_APP_API_TOKEN;
//         if (apiToken) {
//           localStorage.setItem("token", apiToken);
//         }

//         setUser(googleUser);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   // Google Sign-In
//   const googleSignIn = () => {
//     const auth = getAuth();
//     const provider = new GoogleAuthProvider();
//     return signInWithPopup(auth, provider);
//   };

//   // ✅ Consistent logout naming
//   const logout = async () => {
//     const auth = getAuth();
//     try {
//       await signOut(auth);
//     } catch (error) {
//       console.error("Error during Firebase sign out:", error);
//     }
//     setUser(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//   };

//   return (
//     <UserAuthContext.Provider
//       value={{
//         user,
//         setUser,
//         googleSignIn,
//         logout, // ✅ consistent export
//       }}
//     >
//       {children}
//     </UserAuthContext.Provider>
//   );
// };

// // Hook
// export const useUserAuth = () => useContext(UserAuthContext);









// src/context/UserAuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const googleUser = {
          name: currentUser.displayName,
          email: currentUser.email,
          photo: currentUser.photoURL,
        };
        localStorage.setItem("user", JSON.stringify(googleUser));
        localStorage.setItem("token", currentUser.accessToken || "");
        setUser(googleUser);
      }
    });
    return () => unsubscribe();
  }, []);

  const googleSignIn = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const logout = async () => {
    const auth = getAuth();
    await signOut(auth);
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <UserAuthContext.Provider value={{ user, setUser, googleSignIn, logout }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => useContext(UserAuthContext);

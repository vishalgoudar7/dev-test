
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { UserAuthProvider } from "./context/UserAuthContext"; // ✅ Corrected name

import Navbar from "./components/Navbar";
import AllRouters from "./Routes/AllRouters";
import AppInfoSection from "./components/AppInfoSection";
// import SpecialPujaSection from "./components/SpecialPujaSection";
import Footer from "./components/Footer";
import SpecialPooja from "./components/SpecialPooja";

function AppWrapper() {
  const location = useLocation();

  const showFooterOnPages = [
    "/",
    "/about",
    "/contact",
    "/events",
    "/puja",
    "/prasadam",
    "/chadhava",
    "/TermsAndConditions",
    "/CancellationPolicy",
    "/RefundPolicy",
    "/PrivacyPolicy",
  ];

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/*" element={<AllRouters />} />
      </Routes>

      {location.pathname === "/" && (
        <>
          <AppInfoSection />
          <SpecialPooja />
        </>
      )}

      {showFooterOnPages.includes(location.pathname) && <Footer />}
    </>
  );
}

function App() {
  return (
    <UserAuthProvider> {/* ✅ Correct name */}
      <Router>
        <AppWrapper />
      </Router>
    </UserAuthProvider>
  );
}

export default App;

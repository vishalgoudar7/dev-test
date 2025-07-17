import React, { useEffect } from "react";
import "../styles/PrivacyPolicy.css";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    const storedMobileNumber = localStorage.getItem("mobileNumber");
    if (
      storedMobileNumber !== null &&
      storedMobileNumber !== "null" &&
      storedMobileNumber !== "+919080706050"
    ) {
      // Replace this with Redux action if needed
      console.log("User logged in with mobile.");
    }
  }, []);

  return (
    <main className="privacy-wrapper">
      <div className="privacy-container">
        <br />
        <br />
        <img
          className="privacy-banner"
          src="https://www.devalayas.in/assets/images/pp.png"
          alt="Privacy Policy Banner"
        />
        <div className="privacy-content">
          <h5>Privacy Policy :</h5>
          <p>
            This document is published in accordance with the provisions of Rule 3 (1) of the Information Technology...
            {/* All your original paragraphs start here */}
          </p>

          <h5>1. What information do we collect?</h5>
          <p>
            We collect information from You when You register on the Website/App, our social media assets...
          </p>

          <h5>2. How do we use and share your information?</h5>
          <p>We share Your information with third parties when we believe the sharing is permitted by You...</p>

          <h5>3. How do we protect visitor information?</h5>
          <p>We implement a variety of security measures to maintain the safety of Your Personal Information...</p>

          <h5>4. Public Information about Your Activity on the Website/App</h5>
          <p>If You choose to provide any personally identifiable information using certain public features...</p>

          <h5>5. Do we disclose the information we collect to outside parties?</h5>
          <p>We do not sell, trade, or otherwise transfer to third-parties Your personally identifiable information...</p>

          <h5>6. Third party links</h5>
          <p>In an attempt to provide You with increased value, we may include third party links on our Website/App...</p>

          <h5>7. Changes to our policy</h5>
          <p>If we decide to change our Privacy Policy, we will post those changes on this page...</p>

          <h5>8. Online Policy only</h5>
          <p>This online Privacy Policy Applies to all the information collected through our Website/App/Team...</p>

          <h5>9. Terms and Conditions</h5>
          <p>Please also review our Terms of Service section establishing the use, disclaimers...</p>

          <h5>10. Your consent</h5>
          <p>By registering on our Website/App, You consent to our Privacy Policy.</p>

          <h5>Privacy Policy for User Data:</h5>
          <p>Last updated: October 11, 2022</p>

          <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure...</p>

          <h5>Interpretation and Definitions</h5>
          <h6>Interpretation</h6>
          <p>The words of which the initial letter is capitalized have meanings defined under the following conditions...</p>

          <h6>Definitions</h6>
          <ul>
            <li><strong>Account:</strong> A unique account created for You to access our Service...</li>
            <li><strong>Affiliate:</strong> An entity that controls, is controlled by or is under common control with a party...</li>
            <li><strong>Application:</strong> The software program named DEVALAYA...</li>
            <li><strong>Company:</strong> Refers to ANEK TECHNOLOGIES PVT LTD...</li>
            <li><strong>Country:</strong> Karnataka, India</li>
            <li><strong>Device:</strong> Any device that can access the Service...</li>
            <li><strong>Personal Data:</strong> Any information that relates to an identified or identifiable individual...</li>
            <li><strong>Service:</strong> Refers to the Application...</li>
            <li><strong>Service Provider:</strong> Third-party companies or individuals employed by the Company...</li>
            <li><strong>Usage Data:</strong> Data collected automatically...</li>
            <li><strong>You:</strong> The individual using the Service...</li>
          </ul>

          <h5>Collecting and Using Your Personal Data</h5>
          <h6>Types of Data Collected</h6>
          <h6>Personal Data</h6>
          <p>While using Our Service, We may ask You to provide Us with certain personally identifiable information...</p>

          <h6>Usage Data</h6>
          <p>Usage Data is collected automatically when using the Service...</p>

          <h6>Information Collected while Using the Application</h6>
          <ul>
            <li>Location</li>
            <li>Phone book (contacts list)</li>
            <li>Camera and photo library access</li>
          </ul>

          <h6>Use of Your Personal Data</h6>
          <ul>
            <li><strong>To provide and maintain our Service</strong></li>
            <li><strong>To manage Your Account</strong></li>
            <li><strong>For the performance of a contract</strong></li>
            <li><strong>To contact You</strong></li>
            <li><strong>To provide You with offers</strong></li>
            <li><strong>To manage Your requests</strong></li>
            <li><strong>For business transfers</strong></li>
            <li><strong>For other purposes</strong></li>
          </ul>

          <h6>Sharing Your Personal Data</h6>
          <ul>
            <li><strong>With Service Providers</strong></li>
            <li><strong>For business transfers</strong></li>
            <li><strong>With Affiliates</strong></li>
            <li><strong>With business partners</strong></li>
            <li><strong>With other users</strong></li>
            <li><strong>With Your consent</strong></li>
          </ul>

          <h6>Retention of Your Personal Data</h6>
          <p>We will retain Your Personal Data only for as long as is necessary for the purposes...</p>

          <h6>Transfer of Your Personal Data</h6>
          <p>Your information, including Personal Data, is processed at the Company's operating offices...</p>

          <h6>Delete Your Personal Data</h6>
          <p>You have the right to delete or request that We assist in deleting the Personal Data...</p>

          <h6>Disclosure of Your Personal Data</h6>
          <p><strong>Business Transactions:</strong> If the Company is involved in a merger or acquisition...</p>
          <p><strong>Law enforcement:</strong> Required disclosures by law...</p>
          <p><strong>Other legal requirements:</strong> To comply with legal obligations, defend rights...</p>

          <h6>Security of Your Personal Data</h6>
          <p>We use commercially acceptable means to protect Your Personal Data but cannot guarantee absolute security...</p>

          <h6>Children's Privacy</h6>
          <p>We do not knowingly collect data from children under 13...</p>

          <h6>Links to Other Websites</h6>
          <p>Our Service may contain links to other websites not operated by us...</p>

          <h6>Changes to this Privacy Policy</h6>
          <p>We may update our Privacy Policy and will notify You via email and on this page...</p>

          <h5>Contact Us</h5>
          <p>If you have any questions about this Privacy Policy, You can contact us:</p>
          <ul>
            <li>Email: info@devalayas.com</li>
            <li>
              Website:{" "}
              <a href="http://www.devalayas.in" target="_blank" rel="noopener noreferrer">
                http://www.devalayas.in
              </a>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;

import React, { useEffect } from "react";
import "../styles/CancellationPolicy.css"; // Updated CSS file

const CancellationPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    const storedMobileNumber = localStorage.getItem("mobileNumber");
    if (
      storedMobileNumber &&
      storedMobileNumber !== "null" &&
      storedMobileNumber !== "+919080706050"
    ) {
      // Dispatch login status if needed
      // Example: dispatch(setsignInMbl(true));
    }
  }, []);

  return (
    <main className="refund-policy-wrapper">
      <div className="refund-policy-container">
        <img
          className="refund-policy-image"
          src="https://www.devalayas.in/assets/images/can_pol.png"
          alt="Cancellation Policy"
        />

        <div className="refund-policy-content">
          <h5>Cancellation Policy:</h5>
          <p>
            We understand that circumstances may arise where you need to cancel puja services or
            other services scheduled by you. Below is our policy:
          </p>
          <ul>
            <li>Cancel before 1 day – 100% refund minus 5% transaction fee.</li>
            <li>Cancel on puja day – 50% refund minus 5% transaction fee.</li>
            <li>No refund once pandit accepts the puja.</li>
            <li>No refund if special puja is missed due to your unavailability.</li>
            <li>Consultation charges are non-refundable.</li>
            <li>Puja kit refund only if damaged by Devalaya and cancelled within 1 day.</li>
          </ul>

          <h5>Automatic Cancellation:</h5>
          <p>
            In some cases, your puja may get automatically cancelled. You will be notified within 2
            working days and refunded as per policy.
          </p>
          <p>
            If refund not received:
            <ul>
              <li>Check your bank account.</li>
              <li>Contact your credit card provider.</li>
              <li>Contact your bank for delays.</li>
            </ul>
            Still need help? Email <a href="mailto:info@devalayas.com">info@devalayas.com</a> or{" "}
            <a href="mailto:devalayas.in@gmail.com">devalayas.in@gmail.com</a>.
          </p>

          <h5>Full Refund Situations:</h5>
          <ul>
            <li>Pandit does not show up.</li>
            <li>
              Software glitch causes failure in booking despite payment — share screenshot for
              investigation.
            </li>
          </ul>

          <h5>Support and Complaints:</h5>
          <ul>
            <li>If pandit or astrologer doesn’t show up – contact support immediately.</li>
            <li>If temple is closed – refund or reschedule based on confirmation.</li>
            <li>
              If payment deducted but booking not created – share screenshot and allow 2–6 hours for
              resolution.
            </li>
            <li>
              Wrong video received – report and refund will be processed within 2 working days.
            </li>
            <li>
              Unable to book puja – use YouTube guide or contact our support for help.
            </li>
            <li>
              No prasadam received – will be couriered from temple or Devalaya team directly.
            </li>
            <li>
              Pandit not on live call for special puja – alternate arrangement or replacement will
              be provided.
            </li>
            <li>
              After booking process – follow puja history section or video guide for updates.
            </li>
            <li>
              Temple not listed – use app’s “Add Your Temple” feature.
            </li>
            <li>Dakshina goes directly to the pandit.</li>
            <li>Up to two family member names can be added to the puja.</li>
            <li>Only special pujas are exclusive; others may be combined.</li>
            <li>Only dry prasadam is shipped after puja.</li>
            <li>
              For more help, call <strong>8951269111</strong> or email{" "}
              <a href="mailto:info@devalayas.com">info@devalayas.com</a>.
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default CancellationPolicy;

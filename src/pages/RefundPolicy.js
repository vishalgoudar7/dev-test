import React, { useEffect } from "react";
import "../styles/RefundPolicy.css";

const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);

    const storedMobileNumber = localStorage.getItem("mobileNumber");
    if (
      storedMobileNumber &&
      storedMobileNumber !== "null" &&
      storedMobileNumber !== "+919080706050"
    ) {
      // If using context or redux, you can dispatch login state update here
      // Example: dispatch(setSignInMobile(true));
    }
  }, []);

  return (
    <main className="refund-policy-container">
      <div className="refund-policy-content">
        <img
          className="refund-policy-banner"
          src="https://www.devalayas.in/assets/images/Ret.png"
          alt="Refund Policy"
        />
        <div className="refund-policy-text">
          <h5>Refunds &amp; Return Policy:</h5>
          <p>
            You agree to pay all amounts due on your billing account against
            devotional, Puja &amp; Homa services availed by you on Devalaya App
            and Website Platform. Any service order placed through the website/app
            for availing any of the Devotional Services such as online puja, Homa,
            prasad, religious services, or digital donations, cannot be cancelled
            and any payment once made will not be refunded.
          </p>
          <p>
            After the date for Puja/Homa or religious services has been chosen /
            selected, the date cannot be changed after making the payment.
            However, if the temple decides to cancel the Puja or event, an
            alternative date will be provided.
          </p>
          <p>
            Processing fees or transaction costs, if any, are to be borne by the
            cardholder and may be charged extra with the pujas and offerings rate.
            If you want to transfer the Puja service to another person, send an
            email to <strong>info@devalayas.in</strong> at least 24 hours prior to
            the Puja.
          </p>
          <p>
            Prasadam delivered from the temple or Devalaya, being a perishable food
            item offered during Puja, cannot be returned once ordered.
          </p>

          <p>
            For non-perishable items like merchandise, returns are allowed within
            15 days of purchase. Items must be unused, in the original condition and
            packaging, along with proof of purchase. Perishable goods like food,
            flowers, and digital services cannot be returned.
          </p>

          <p>
            Once your return is received and inspected, you will receive an email
            notification of approval or rejection. If approved, the refund will be
            processed and credited back to the original method of payment within a
            few working days.
          </p>

          <h5>Late or Missing Refunds (if applicable):</h5>
          <p>
            If you haven’t received a refund yet, check your bank account. Then
            contact your card company as posting may take some time. If issues
            persist, contact <strong>info@devalayas.in</strong>.
          </p>

          <h5>Exchanges (if applicable):</h5>
          <p>
            Items are replaced only if defective or damaged. Email us at{" "}
            <strong>info@devalayas.in</strong> and send your item to the registered
            office address.
          </p>

          <h5>Gifts:</h5>
          <p>
            If the item was marked as a gift and shipped directly to you, you’ll
            receive a gift credit for the return value. Otherwise, the refund will
            go to the original purchaser.
          </p>

          <h5>Shipping:</h5>
          <p>
            To return your product, send it to the registered address mentioned on
            our website. You’ll bear the return shipping cost. If a refund is
            approved, return shipping cost will be deducted.
          </p>

          <p>
            Depending on your location, the time it takes for an exchanged product
            to reach you may vary.
          </p>
        </div>
      </div>
    </main>
  );
};

export default RefundPolicy;

import React from "react";

const InformationWeCollect = () => {
  return (
    <div style={styles.container} className="w-full p-4 md:p-8">
      <div style={styles.card} className="p-3 md:p-7 lg:p-9">
        <h2
          style={styles.heading}
          className="text-sm XS1:text-base md:text-lg lg:text-xl font-gotham"
        >
          Information We Collect
        </h2>
        <p
          style={styles.paragraph}
          className="text-justify text-sm md:text-base font-gotham font-light"
        >
          When you interact with our website and services, we collect certain
          personal information to process your bookings and enhance your
          experience. This includes your full name, email address, phone number,
          billing address, and identification details when necessary for travel
          purposes. We also collect payment information such as your cardholder
          name, credit or debit card number, and billing details, though we do
          not store full card details on our servers. Card payments are securely
          processed through third-party payment gateways that are PCI-DSS
          compliant. Additionally, we collect technical data like your IP
          address, browser type, device information, and pages you visit to help
          us understand usage patterns and improve our platform. Cookies and
          similar technologies are also used to remember your preferences and
          deliver personalized content.
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#f8f9fa",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    maxWidth: "800px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    borderRadius: "4px",
    fontFamily: "Arial, sans-serif",
    fontSize: "16px",
    lineHeight: "1.6",
  },
  heading: {
    fontWeight: "bold",
    marginBottom: "1rem",
    borderBottom: "3px solid #f28323",
    display: "inline-block",
    paddingBottom: "4px",
    color: "rgb(30, 58, 138)",
  },
  paragraph: {
    marginBottom: "1rem",
    justifyContent: "center",
  },
};

export default InformationWeCollect;

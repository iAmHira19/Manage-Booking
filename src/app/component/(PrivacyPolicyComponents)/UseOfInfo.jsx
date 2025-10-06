import React from "react";

const UseOfInfo = () => {
  return (
    <div style={styles.container} className="w-full p-4 md:p-8">
      <div style={styles.card} className="p-3 md:p-7 lg:p-9">
        <h2
          style={styles.heading}
          className="text-sm XS1:text-base md:text-lg lg:text-xl font-gotham"
        >
          How We Use Your Information
        </h2>
        <p
          style={styles.paragraph}
          className="text-justify text-sm md:text-base font-gotham font-light"
        >
          We use the personal data we collect to facilitate and manage your
          bookings for flights, cruises, cars, and other travel-related
          services. This includes confirming your reservations, sending booking
          confirmations, updates, and offering customer support. Your data also
          helps us detect fraud, secure your transactions, comply with legal
          obligations, and analyze website usage to improve our services. If you
          provide us with your preferences or travel requests, we may use them
          to tailor our offers and enhance your experience with CherryFlight.
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

export default UseOfInfo;

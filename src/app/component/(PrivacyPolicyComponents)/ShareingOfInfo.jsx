import React from "react";

const ShareingOfInfo = () => {
  return (
    <div style={styles.container} className="w-full p-4 md:p-8">
      <div style={styles.card} className="p-3 md:p-7 lg:p-9">
        <h2
          style={styles.heading}
          className="text-sm XS1:text-base md:text-lg lg:text-xl font-gotham"
        >
          Sharing Your Information
        </h2>
        <p
          style={styles.paragraph}
          className="text-justify text-sm md:text-base font-gotham font-light"
        >
          We may share your information with third parties only when necessary
          to fulfill your bookings and provide services. This includes sharing
          your data with airlines, cruise companies, car rental agencies, and
          activity providers. Additionally, we may share information with secure
          payment processors and service providers who help operate our
          business, such as email platforms or CRM systems. We do not sell or
          rent your personal data to any third parties for their marketing
          purposes. In certain cases, we may be required to disclose your
          information to legal or regulatory authorities to comply with
          applicable laws.
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

export default ShareingOfInfo;

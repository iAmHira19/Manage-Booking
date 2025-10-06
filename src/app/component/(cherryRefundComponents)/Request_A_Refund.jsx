import React from "react";

const Request_A_Refund = () => {
  return (
    <div style={styles.container} className="p-4 md:p-8">
      <div style={styles.card} className="p-3 md:p-7 lg:p-9">
        <h2
          style={styles.heading}
          className="text-sm XS1:text-base md:text-lg lg:text-xl font-gotham"
        >
          How to Request a Refund
        </h2>
        <p
          style={styles.paragraph}
          className="text-justify text-sm md:text-base font-gotham font-light"
        >
          To initiate the refund process, you must email your request to
          refund@cherryflight.com. This request must be submitted within the
          validity period of your ticket or booked service. Submissions beyond
          the validity date will not be considered eligible for refund
          processing.
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

export default Request_A_Refund;

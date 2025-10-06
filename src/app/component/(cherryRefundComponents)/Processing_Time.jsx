import React from "react";

const Processing_Time = () => {
  return (
    <div style={styles.container} className="p-4 md:p-8">
      <div style={styles.card} className="p-3 md:p-7 lg:p-9">
        <h2
          style={styles.heading}
          className="text-sm XS1:text-base md:text-lg lg:text-xl font-gotham"
        >
          Processing Time
        </h2>
        <p
          style={styles.paragraph}
          className="text-justify text-sm md:text-base font-gotham font-light"
        >
          Once we receive your complete refund request along with all supporting
          documents, the standard processing time is up to 30 business days.
          This timeframe allows us to coordinate with the relevant service
          providers and ensure that all necessary validations are completed. In
          certain cases—particularly those involving airlines or third-party
          suppliers—processing may take longer due to internal billing
          procedures and extended verification processes. We appreciate your
          patience in such cases.
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

export default Processing_Time;

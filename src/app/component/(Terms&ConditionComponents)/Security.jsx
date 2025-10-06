import React from "react";

function Security() {
  return (
    <div style={styles.container} className="p-4 md:p-8">
      <div style={styles.card} className="p-3 md:p-7 lg:p-9">
        <h2
          style={styles.heading}
          className="text-sm XS1:text-base md:text-lg lg:text-xl font-gotham"
        >
          Security
        </h2>
        <p
          style={styles.paragraph}
          className="text-justify text-sm md:text-base font-gotham font-light"
        >
          CherryFlight takes all reasonable steps to ensure that any information
          you transmit through our Website remains confidential and protected
          from unauthorized access. However, while we implement
          industry-standard security measures, we cannot guarantee that such
          access will never occur.
        </p>

        <p
          style={styles.paragraph}
          className="text-justify text-sm md:text-base font-gotham font-light"
        >
          We are not liable for any unauthorized access to your data unless it
          is the direct result of our gross negligence. In such rare cases,
          compensation will be limited to a maximum amount equal to the total
          value of the services you purchased through CherryFlight.
        </p>
      </div>
    </div>
  );
}

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

export default Security;

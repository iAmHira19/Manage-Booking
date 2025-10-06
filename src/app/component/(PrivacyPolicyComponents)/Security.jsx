import React from "react";

function Security() {
  return (
    <div style={styles.container} className="w-full p-4 md:p-8">
      <div style={styles.card} className="p-3 md:p-7 lg:p-9">
        <h2
          style={styles.heading}
          className="text-sm XS1:text-base md:text-lg lg:text-xl font-gotham"
        >
          Data Security
        </h2>
        <p
          style={styles.paragraph}
          className="text-justify text-sm md:text-base font-gotham font-light"
        >
          We are committed to keeping your data secure. To protect your personal
          information, we use industry-standard security measures such as SSL
          encryption, secure server environments, and access controls. All
          payment transactions are handled securely through PCI-compliant
          processors. While we take all reasonable precautions to protect your
          data, no online service can guarantee absolute security. We encourage
          you to keep your account credentials confidential and to use strong
          passwords.
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

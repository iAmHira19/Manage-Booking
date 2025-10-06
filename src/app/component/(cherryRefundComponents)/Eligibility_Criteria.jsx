import React from "react";

const Eligibility_Criteria = () => {
  return (
    <div style={styles.container} className="p-4 md:p-8">
      <div style={styles.card} className="p-3 md:p-7 lg:p-9">
        <h2
          style={styles.heading}
          className="text-base md:text-lg lg:text-xl font-gotham"
        >
          Eligibility Criteria
        </h2>
        <p
          style={styles.paragraph}
          className="text-justify text-sm md:text-base font-gotham font-light"
        >
          Refund eligibility is determined by the specific terms and conditions
          of the airline, hotel, or other service provider. Some tickets or
          bookings may be completely non-refundable regardless of the
          circumstances. Cherryflight acts as an intermediary and can only
          process refunds that adhere to the policies set by these providers.
          Therefore, each request is reviewed against the rules associated with
          the original purchase.
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

export default Eligibility_Criteria;

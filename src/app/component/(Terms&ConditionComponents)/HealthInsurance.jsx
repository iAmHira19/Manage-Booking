import React from "react";

export const HealthInsurance = () => {
  return (
    <div style={styles.container} className="p-4 md:p-8">
      <div style={styles.card} className="p-3 md:p-7 lg:p-9">
        <h2
          style={styles.heading}
          className="text-sm XS1:text-base md:text-lg lg:text-xl font-gotham"
        >
          Health Insurance / Requirements
        </h2>
        <p
          style={styles.paragraph}
          className="text-justify text-sm md:text-base font-gotham font-light"
        >
          Immunizations may be recommended or required for certain destinations
          or stopover points. We strongly advise that you consult with your
          doctor or a healthcare professional well in advance of your trip to
          ensure that you meet any health requirements for your journey.
        </p>

        <p
          style={styles.paragraph}
          className="text-justify text-sm md:text-base font-gotham font-light"
        >
          We also recommend purchasing comprehensive travel insurance to cover
          unexpected events, especially for international travel, including
          medical emergencies, cancellations, or other unforeseen situations.
        </p>

        <p
          style={styles.paragraph}
          className="text-justify text-sm md:text-base font-gotham font-light"
        >
          Please note that any health-related information provided on the
          CherryFlight website, including in our Health & Travel section, is
          intended as a general guide only. It is not tailored to your personal
          medical situation, and should not be considered a substitute for
          professional medical advice. We do not accept any liability for
          self-diagnoses or actions taken based on this general content, and we
          disclaim all liability to the fullest extent permitted by law.
        </p>

        <p
          style={styles.paragraph}
          className="text-justify text-sm md:text-base font-gotham font-light"
        >
          If you have any personal health concerns or questions about your
          fitness to fly, please consult a qualified medical professional. For
          details regarding health or vaccination requirements for your
          destination or stopovers, please contact CherryFlight customer
          support.
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
    fontSize: "20px",
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

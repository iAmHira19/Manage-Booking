import React from "react";

const Agreement = () => {
  return (
    <div style={styles.container} className="p-4 md:p-8">
      <div style={styles.card} className="p-3 md:p-7 lg:p-9">
        <h2
          style={styles.heading}
          className="text-sm XS1:text-base md:text-lg lg:text-xl font-gotham"
        >
          Agreement between you and{" "}
          <span
            style={styles.span}
            className="text-sm XS1:text-base md:text-lg lg:text-xl font-gotham"
          >
            CherryFlight
          </span>
        </h2>
        <p
          style={styles.paragraph}
          className="text-justify text-sm md:text-base font-gotham font-light"
        >
          Thank you for visiting cherryflight.com (the &#34;Website&#34;).
          Please read these terms and conditions carefully before using the
          Website. By accessing and using this Website, you indicate that you
          accept (unconditionally and irrevocably) these terms and conditions
          (the &#34;Agreement&#34;). If you do not agree to these terms and
          conditions, please do not use our Website and exit immediately.
        </p>
        <p
          style={styles.paragraph}
          className="text-justify text-sm md:text-base font-gotham font-light"
        >
          The Website is owned and operated by CherryFlight, an online travel
          booking platform that facilitates reservations for flights, hotels,
          rental cars, and cruise experiences.
        </p>
        <p
          style={styles.paragraph}
          className="text-justify text-sm md:text-base font-gotham font-light"
        >
          You represent and warrant that you possess the legal right and ability
          to enter into this Agreement and to use this Website in accordance
          with all applicable terms and conditions.
        </p>
        <p
          style={styles.paragraph}
          className="text-justify text-sm md:text-base font-gotham font-light"
        >
          You confirm that you are of legal age to enter into binding agreements
          through this Website and accept responsibility for all bookings and
          payments made by you or any individual using your account credentials.
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
  span: {
    color: "#f97316 ",
  },
  heading: {
    fontWeight: "semibold",
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
  link: {
    color: "#000",
    textDecoration: "underline",
  },
};

export default Agreement;

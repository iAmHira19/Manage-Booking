import React from "react";

export default function Passport() {
  return (
    <div style={styles.container} className="p-4 md:p-8">
      <div style={styles.card} className="p-3 md:p-7 lg:p-9">
        <h2
          style={styles.heading}
          className="text-sm XS1:text-base md:text-lg lg:text-xl font-gotham"
        >
          Passport
        </h2>
        <p
          style={styles.paragraph}
          className="text-justify text-sm md:text-base font-gotham font-light"
        >
          Please ensure that you have a valid passport for the full duration of
          your trip. Some countries may require your passport to be valid for a
          specific period—generally at least six months beyond your date of
          return. You are also responsible for obtaining any visas or travel
          authorizations required for your destination(s), including transit
          points, where applicable.
        </p>
        <p
          style={styles.paragraph}
          className="text-justify text-sm md:text-base font-gotham font-light"
        >
          When making a booking through CherryFlight, you must ensure that the
          name you provide—whether for yourself or for any person(s) you are
          booking on behalf of—matches exactly as it appears on the
          corresponding passport.
        </p>
        <p
          style={styles.paragraph}
          className="text-justify text-sm md:text-base font-gotham font-light"
        >
          If you are unsure about passport or visa requirements for your
          destination, we recommend contacting the embassy or consulate of the
          country you plan to visit, or referring to official government travel
          resources.
        </p>
        <p
          style={styles.paragraph}
          className="text-justify text-sm md:text-base font-gotham font-light"
        >
          Failure to travel with the appropriate documentation may result in
          denied boarding, refusal of entry, deportation, or other legal
          consequences. In such cases, you will be solely responsible for any
          related costs, losses, or damages incurred by you.
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

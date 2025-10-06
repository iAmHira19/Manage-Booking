import React from "react";

const WebsiteContent = () => {
  return (
    <div style={styles.container} className="p-4 md:p-8">
      <div style={styles.card} className="p-3 md:p-7 lg:p-9">
        <h2
          style={styles.heading}
          className="text-sm XS1:text-base md:text-lg lg:text-xl font-gotham"
        >
          Website Content
        </h2>
        <p
          style={styles.paragraph}
          className="text-justify text-sm md:text-base lg:text-lg font-gotham font-light"
        >
          <h2
            style={styles.sub_heading}
            className="text-sm md:text-base lg:text-xl font-gotham font-light"
          >
            Online Booking
          </h2>
          <p className="text-base py-2">
            If you have any questions regarding your online booking with
            CherryFlight—or if you encountered any issues while booking flights,
            hotels, cars, or cruises—please don’t hesitate to contact our
            customer support team. We’re here to help ensure a smooth and
            stress-free booking experience.
          </p>
        </p>

        <p
          style={styles.paragraph}
          className="text-justify text-sm md:text-base lg:text-lg font-gotham font-light"
        >
          <h2
            style={styles.sub_heading}
            className="text-sm md:text-base lg:text-xl font-gotham font-light"
          >
            Non-Booking Related Queries
          </h2>{" "}
          <p className="text-base py-2">
            If you experience any technical issues while browsing or interacting
            with the CherryFlight website, please reach out to our local support
            office or get in touch with our technical assistance team for prompt
            help.
          </p>
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
  sub_heading: {
    fontWeight: "400",
    color: "rgb(30, 58, 138)",
  },
  paragraph: {
    marginBottom: "1rem",
    justifyContent: "justify",
    textAlign: "justify",
  },
};

export default WebsiteContent;

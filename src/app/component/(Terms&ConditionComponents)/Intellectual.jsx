import React from "react";

const Intellectual = () => {
  return (
    <div style={styles.container} className="p-4 md:p-8">
      <div style={styles.card} className="p-3 md:p-7 lg:p-9">
        <h2
          style={styles.heading}
          className="text-sm XS1:text-base md:text-lg lg:text-xl font-gotham"
        >
          Intellectual Property Rights
        </h2>
        <p
          style={styles.paragraph}
          className="text-justify text-sm md:text-base font-gotham font-light"
        >
          All trademarks, copyrights, database rights, and other intellectual
          property rights in the content and materials available on the
          CherryFlight website—including but not limited to text, graphics,
          logos, button icons, images, audio clips, digital downloads, data
          compilations, the layout and organization of the Website, and
          software—are the property of CherryFlight, its affiliates, or its
          content providers. These materials are protected by international
          trademark, copyright, and database laws and treaties around the world.
          All such rights are strictly reserved.
        </p>
        <p
          style={styles.paragraph}
          className="text-justify text-sm md:text-base font-gotham font-light"
        >
          This Website is provided for your personal, non-commercial use. You
          may print or download extracts of any page(s) from the Website solely
          for this purpose. You agree not to modify, copy, distribute, transmit,
          display, perform, reproduce, publish, license, create derivative works
          from, transfer, or sell any information, software, products, or
          services obtained from this Website without prior written permission
          from CherryFlight. You also agree not to compile or publish a database
          that features any substantial portion of this Website without our
          explicit, written consent. Any third-party content, branding, or links
          must always be properly credited to the original source.
        </p>
        <p
          style={styles.paragraph}
          className="text-justify text-sm md:text-base font-gotham font-light"
        >
          If you print, copy, or download any part of our Website in violation
          of these terms, your right to use the Website will immediately and
          automatically terminate, and you must, at our discretion, return or
          destroy any copies of the materials.
        </p>
        <p
          style={styles.paragraph}
          className="text-justify text-sm md:text-base font-gotham font-light"
        >
          CherryFlight and any future products, services, or brands under the
          CherryFlight name are protected trademarks or registered service
          marks. Other product or company names referenced on this Website may
          be the trademarks of their respective owners.
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

export default Intellectual;

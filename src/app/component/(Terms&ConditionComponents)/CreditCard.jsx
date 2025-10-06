import React from "react";

export const CreditCard = () => {
  return (
    <div style={styles.container} className="p-4 md:p-8">
      <div style={styles.card} className="p-3 md:p-7 lg:p-9">
        <h2
          style={styles.heading}
          className="text-sm XS1:text-base md:text-lg lg:text-xl font-gotham"
        >
          Use of Credit Card
        </h2>
        <p
          style={styles.paragraph}
          className="text-justify text-sm md:text-base font-gotham font-light"
        >
          We accept major credit cards issued in the countries specified during
          the booking process. Your credit card will be charged when you click
          the “Purchase Now” button to confirm your booking. If you do not have
          a credit card, you may choose from alternative payment methods that
          may be available to you on the payment page during the online booking
          process. The available payment options may vary depending on your
          departure location or the service being booked (e.g., flights, hotels,
          cars, or cruises).
        </p>
        <p
          style={styles.paragraph}
          className="text-justify text-sm md:text-base font-gotham font-light"
        >
          By using a credit/debit card or any other payment method, you confirm
          that you are authorized to make the transaction and that the card or
          account holder information provided during the booking process is
          accurate.
        </p>
        <p
          style={styles.paragraph}
          className="text-justify text-sm md:text-base font-gotham font-light"
        >
          In certain situations, including those related to fraud prevention,
          CherryFlight reserves the right to verify the card used for the
          booking by requesting that the card be presented at check-in or during
          the service validation process.
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

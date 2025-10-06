import React from "react";
import Header from "../component/(FirstPageComponents)/Header/Header";
import Footer from "../component/(FirstPageComponents)/Footer/Footer";

const layout = ({ children }) => {
  return (
    <>
      <Header></Header>
      {children}
      <Footer></Footer>
    </>
  );
};

export default layout;

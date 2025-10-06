import React from "react";
import Header from "../component/(FirstPageComponents)/Header/Header";
import Footer from "../component/(FirstPageComponents)/Footer/Footer";

const layout = ({ children }) => {
  return (
    <>
      <Header></Header>
      {children}
      {/* <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full"> */}
      <Footer></Footer>
      {/* </div> */}
    </>
  );
};

export default layout;

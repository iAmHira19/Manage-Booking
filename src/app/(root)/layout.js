import Header from "../component/(FirstPageComponents)/Header/Header";
import Footer from "../component/(FirstPageComponents)/Footer/Footer";
export default function layout({ children }) {
  return (
    <>
      <Header></Header>
      {children}
      <Footer showPaymentImages={true}></Footer>
    </>
  );
}

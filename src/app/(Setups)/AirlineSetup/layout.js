import Header from "@/app/component/(FirstPageComponents)/Header/Header";
import Footer from "@/app/component/(FirstPageComponents)/Footer/Footer";
export default function layout({ children }) {
  return (
    <>
      <Header></Header>
      {children}
      <Footer showPaymentImages={false}></Footer>
    </>
  );
}

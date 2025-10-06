import Header from "@/app/component/(FirstPageComponents)/Header/Header";
import Footer from "@/app/component/(FirstPageComponents)/Footer/Footer";
export default function layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header></Header>
      <div className="flex-1">{children}</div>
      <Footer showPaymentImages={false} />
    </div>
  );
}

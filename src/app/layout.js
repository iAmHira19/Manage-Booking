import "@ant-design/v5-patch-for-react-19";
import "./globals.css";
import Providers from "./Providers";

export const metadata = {
  title: "CHERRYFLIGHT",
  description: "Welcome to Cherryflight, your travel companion",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`overflow-x-hidden antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

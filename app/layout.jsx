import "@/src/index.css";
import { Providers } from "./Providers";
import Header from "@/components/Header";
import Cart from "@/components/Cart";
import Checkout from "@/components/Checkout";
import ScrollToTopButton from "@/components/UI/ScrollToTopButton";

export const metadata = {
  title: "Foodie - Order Food Online",
  description: "Delicious food delivered to your door.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ScrollToTopButton />
          <Header />
          <Cart />
          <Checkout />
          {children}
        </Providers>
        <div id="modal"></div>
        <div id="toast"></div>
      </body>
    </html>
  );
}


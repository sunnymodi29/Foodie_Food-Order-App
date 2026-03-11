import "index.css";
import { Providers } from "./Providers";
import ClientLayoutWrapper from "./ClientLayoutWrapper";

export const metadata = {
  title: "Foodie - Food Order App",
  description:
    "Order your favorite food online and get it delivered to your doorstep.",
  icons: {
    icon: "/images/logo-transparent.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </Providers>
        <div id="modal"></div>
        <div id="toast"></div>
      </body>
    </html>
  );
}

import "./globals.css";

import { inter } from "./fonts.js";

export const metadata = {
  title: "Classual",
  description: "UCSD LikeLion 2024 Spring Project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

import "./globals.css";

import { inter } from "./fonts.js";
import Image from "next/image";
import Link from "next/link";
import mainLogo from "../../public/Logo.png";

import styles from "./page.module.css";

export const metadata = {
  title: "Classual",
  description: "UCSD LikeLion 2024 Spring Project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className={styles.header}>
          <Link className={styles.logo} href={"/"}>
            <Image src={mainLogo} alt="Classual Logo" width={400} height={100} />
          </Link>
        </header>
        {children}
      </body>
    </html>
  );
}

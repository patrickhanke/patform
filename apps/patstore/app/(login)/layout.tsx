import React from "react";
import "@repo/styles/global";
import "./styles.scss";
import Framework from "./content/Framework";


export const metadata = {
  title: "Patstore Login",
  description: "PH",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={"login_layout"}>
        <Framework>{children}</Framework>
      </body>
    </html>
  );
}

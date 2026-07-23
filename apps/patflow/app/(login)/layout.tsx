import React, { Suspense } from "react";
import "@repo/styles/typography";
import "@repo/styles/global";
import Framework from "./content/Framework";
import "./styles.scss";

export const metadata = {
  title: "patflow",
  description: "Anwendung für die Verwaltung von Aufgaben und Arbeitszeiten",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={"patflow_login_layout"}>
          <Framework />
        <div className="patflow_login_content">{children}</div>
      </body>
    </html>
  );
}

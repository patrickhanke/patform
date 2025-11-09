"use client";

import React from "react";
import "@repo/styles/global";
import "./styles.scss";
import Framework from "./content/Framework";
import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import { chakraConfig } from "@repo/provider";

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
        <Framework />
        <ChakraProvider value={createSystem(defaultConfig, chakraConfig)}>
          <div className="login_content">{children}</div>
        </ChakraProvider>
      </body>
    </html>
  );
}

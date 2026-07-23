"use client";

import React, { useEffect, useState } from "react";
import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import { chakraConfig } from "@repo/provider";
import "@repo/styles/global";
import "@repo/styles/layout";

const Framework = ({ children }: { children: React.ReactNode }) => {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <>
      <div className="login_logo_container">
        <img
          src={"https://store.patwork.net/logo.png"}
          alt={"patstore"}
          height={60}
          width={60}
        />
      </div>
      <ChakraProvider value={createSystem(defaultConfig, chakraConfig)}>
        <div className="login_content">{children}</div>
      </ChakraProvider>
      <div className="login_footer_container">
        <a href="https://patwork.net/impressum">Impressum</a>
        <a href="https://patwork.net/datenschutz">Datenschutz</a>
        <p>patwork @{year}</p>
      </div>
    </>
  );
};

export default Framework;

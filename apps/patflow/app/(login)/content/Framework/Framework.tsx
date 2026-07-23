"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

const Framework = () => {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <>
      <div className="patflow_login_logo_container">
        <img
          src={"https://flow.patwork.net/patflow_logo_lettering.png"}
          alt={"patstore"}
          height={24}
        />
      </div>
      <div className="patflow_login_footer_container">
        <Link href="/login">Login</Link>
        <Link href="/impressum">Impressum</Link>
        <Link href="/datenschutz">Datenschutz</Link>
        <p>patwork @{year}</p>
      </div>
    </>
  );
};

export default Framework;

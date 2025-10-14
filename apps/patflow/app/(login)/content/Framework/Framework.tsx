import Link from "next/link";
import React from "react";

const Framework = () => {
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
        <p>patwork @{new Date().getFullYear()}</p>
      </div>
    </>
  );
};

export default Framework;

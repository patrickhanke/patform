import React from "react";

const Framework = () => {
  return (
    <>
      <div className="patflow_login_logo_container">
        <img
          src={"https://flow.patwork.net/logo.png"}
          alt={"patstore"}
          height={24}
          width={24}
        />
        <img
          src={"https://flow.patwork.net/logo_lettering.png"}
          alt={"patstore"}
          height={24}
        />
      </div>
      <div className="patflow_login_footer_container">
        <a href="https://flow.patwork.net/impressum">Impressum</a>
        <a href="https://flow.patwork.net/datenschutz">Datenschutz</a>
        <p>patwork @{new Date().getFullYear()}</p>
      </div>
    </>
  );
};

export default Framework;

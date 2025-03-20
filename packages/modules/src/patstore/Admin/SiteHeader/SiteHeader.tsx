"use client";

import { useContext } from "react";
import styles from "./SiteHeader.module.scss";
import { SiteHeaderComponent } from "./types";
import { PatstoreAppContext } from "@repo/provider";

const SiteHeader = ({ title }: SiteHeaderComponent) => {
  const { pageTitle } = useContext(PatstoreAppContext);

  return (
    <div className={styles.main_container}>
      <div className={styles.siteheader_container}>
        <h1>{pageTitle || title}</h1>
        <div className={styles.siteheader_right_container}>
          <div className="vertical_line" />
        </div>
      </div>
    </div>
  );
};

export default SiteHeader;

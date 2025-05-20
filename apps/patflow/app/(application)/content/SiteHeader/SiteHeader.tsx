"use client";

import React, { Suspense, useContext } from "react";
import styles from "./SiteHeader.module.scss";
import { SiteHeaderComponent } from "./types";
import { PatflowAppContext } from "@repo/provider";
import CalendarWeek from "./components/CalendarWeek";
import UserDisplay from "./components/UserDisplay";
import { CreateTask, CreateTicket } from "@repo/modules";

const SiteHeader = ({ title }: SiteHeaderComponent) => {
  const { setRefetchTask, setRefetchTicket, selectYear } =
    useContext(PatflowAppContext);

  return (
    <div className={styles.siteheader_container}>
      <h1>{title}</h1>
      <div className={styles.siteheader_right_container}>
        <CreateTask setRefetchTask={setRefetchTask} />
        <div className="vertical_line" />
        <CreateTicket setRefetchTicket={setRefetchTicket} />
        <div className="vertical_line" />
        {selectYear}
        <div className="vertical_line" />
        <CalendarWeek />
        <div className="vertical_line" />
        <Suspense>
          <UserDisplay userMessages />
        </Suspense>
      </div>
    </div>
  );
};

export default SiteHeader;

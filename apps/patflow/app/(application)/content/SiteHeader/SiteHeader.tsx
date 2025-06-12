"use client";

import React, { useContext } from "react";
import styles from "./SiteHeader.module.scss";
import { SiteHeaderComponent } from "./types";
import { PatflowAppContext } from "@repo/provider";
import CalendarWeek from "./components/CalendarWeek";
import { CreateTask, CreateTicket } from "@repo/modules";
import { UserDisplay } from "./content/UserDisplay";

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
        <UserDisplay userMessages />
      </div>
    </div>
  );
};

export default SiteHeader;

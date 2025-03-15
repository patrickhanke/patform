"use client";

import React, { Suspense, useContext, useEffect } from "react";
import styles from "./SiteHeader.module.scss";
import { SiteHeaderComponent } from "./types";
import { AppContext } from "@provider";
import CalendarWeek from "./components/CalendarWeek";
import UserDisplay from "./components/UserDisplay";

const SiteHeader = ({ title, refetch }: SiteHeaderComponent) => {
  const { createTask, createTicket, setRefetchFunction, selectYear } =
    useContext(AppContext);

  useEffect(() => {
    if (refetch) {
      setRefetchFunction(() => refetch);
    }
  }, [refetch]);

  return (
    <div className={styles.siteheader_container}>
      <h1>{title}</h1>
      <div className={styles.siteheader_right_container}>
        {createTask}
        <div className="vertical_line" />
        {createTicket}
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

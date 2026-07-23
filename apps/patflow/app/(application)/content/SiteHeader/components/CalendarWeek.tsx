"use client";

import { getWeek } from "date-fns";
import React from "react";
import styles from "../SiteHeader.module.scss";

const CalendarWeek = () => {
  const week = getWeek(new Date(), { weekStartsOn: 1 });

  return (
    <div className={styles.week_container}>
      <p>KW: {week}</p>
    </div>
  );
};

export default CalendarWeek;

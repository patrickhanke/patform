import { TallyTypes } from "@repo/types";
import React from "react";
import styles from "../TallyEntries.module.scss";
import { DateDisplay, DisplayWorker } from "@repo/ui";
import { PiClockCountdown } from "react-icons/pi";
import { useGetData } from "@repo/provider";
import { LiaCommentDots } from "react-icons/lia";

const Entry = ({ entry }: { entry: TallyTypes.Entry }) => {
  const { data: userData } = useGetData({
    objectName: "User",
    fields: ["objectId", "first_name", "last_name", "email", "portrait", "role {name}"],
    id: entry.user
  });

  return (
    <div className={styles.entry_container}>
      <div className={styles.entry_header}>
        {userData && <DisplayWorker worker={userData} />}
        <DateDisplay date={entry.date} displayType="date-and-time" />
      </div>
      <div className={styles.entry_content}>
        <div className={styles.entry_content_icon}>
          <PiClockCountdown />
        </div>
        <div className={styles.entry_content_text}>
          <p>{entry.value}</p>
        </div>
      </div>
      {entry.comment && (
        <div className={styles.entry_content}>
          <div className={styles.entry_content_icon}>
            <LiaCommentDots />
          </div>
          <div className={styles.entry_content_text}>
            <p>{entry.comment}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Entry;

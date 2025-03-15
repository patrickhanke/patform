"use client";

import styles from "./MessageIndicator.module.scss";
import { NotificationContext } from "@repo/provider";
import { useContext, useEffect } from "react";

const MessageIndicator = () => {
  const { unreadNotifications } = useContext(NotificationContext);
  // useEffect(() => {
  // 	console.log(unreadNotifications);

  // 	// This effect will run whenever unreadNotifications changes
  // }, [unreadNotifications]);

  if (unreadNotifications && unreadNotifications.length > 0)
    return (
      <div className={styles.message_indicator}>
        {unreadNotifications.length}
      </div>
    );

  return null;
};

export default MessageIndicator;

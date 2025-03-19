"use client";

import { Notification } from "@repo/types";
import "./styles.scss";

const MessageIndicator = ({
  notifications,
}: {
  notifications: Notification[];
}) => {
  if (notifications && notifications.length > 0)
    return <div className={"message_indicator"}>{notifications.length}</div>;

  return null;
};

export default MessageIndicator;

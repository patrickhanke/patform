"use client";

import { Page, UserMessages } from "@repo/ui";
import { deleteAllNotifications } from "../../../provider/src/functions";
import { useMemo } from "react";

const Dashboard = () => {
  const pageHeaderButtons = useMemo(
    () => [
      {
        text: "Neue Nachricht",
        onClick: () => deleteAllNotifications(),
        value: "new_message",
      },
    ],
    [],
  );

  return (
    <Page title="Dashboard" pageHeaderButtons={pageHeaderButtons}>
      <UserMessages />
    </Page>
  );
};

export default Dashboard;

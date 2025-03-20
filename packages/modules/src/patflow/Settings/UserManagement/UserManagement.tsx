"use client";

import React, { useState } from "react";
import UserOverview from "./content/UserOverview";
import { Page } from "@repo/ui";

const UserManagement = () => {
  // const siteStates = useUserManagementNavigation();
  const [isOpen, setIsOpen] = useState(false);

  const siteHeaderButtons = [
    {
      text: "Neuen Nutzer anlegen",
      onClick: () => setIsOpen(true),
      is_add_button: true,
    },
  ];

  return (
    <Page title="Nutzerverwaltung" pageHeaderButtons={siteHeaderButtons}>
      <UserOverview isOpen={isOpen} setIsOpen={setIsOpen} />
    </Page>
  );
};

export default UserManagement;

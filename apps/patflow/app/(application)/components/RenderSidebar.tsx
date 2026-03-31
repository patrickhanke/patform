"use client";

import React from "react";
import Logo from "./Logo";
import { Sidebar } from "@repo/ui";
import { PatflowUser } from "@repo/types";
import { useAppContext } from "@repo/provider";

const menu_items = [
  {
    label: "Dashboard",
    value: "/",
    icon: "dashboard",
    sub_menu: [],
  },
  {
    label: "Objekte",
    value: "/properties",
    icon: "objects",
    sub_menu: [],
  },
  {
    label: "Aufgaben",
    value: "/tasks",
    icon: "tasks",
    sub_menu: [
      {
        label: "Aktiv",
        value: "/active",
        icon: "active",
      },
      {
        label: "Erledigt",
        value: "/executed",
        icon: "executed",
      },
      {
        label: "Geschlossen",
        value: "/completed",
        icon: "completed",
      },
    ],
  },
  {
    label: "Tickets",
    value: "/tickets",
    icon: "tickets",
    sub_menu: [
      {
        label: "Offen",
        value: "/open",
        icon: "active",
      },
      {
        label: "In Bearbeitung",
        value: "/in_progress",
        icon: "executed",
      },
      {
        label: "Geschlossen",
        value: "/closed",
        icon: "closed",
      },
    ],
  },
  {
    label: "Leistungen",
    value: "/services",
    icon: "services",
    sub_menu: [
      {
        label: "Leistungen",
        value: "/services",
        icon: "services",
      },
      {
        label: "Objekte",
        value: "/objects",
        icon: "objects",
      },
      {
        label: "Touren",
        value: "/tours",
        icon: "tours",
      }
    ],
  },
  {
    label: "Zeiterfassung",
    value: "/records",
    icon: "time",
    sub_menu: [],
  },
  {
    label: "Mitarbeiter",
    value: "/staff",
    icon: "staff",
    sub_menu: [],
  },
  {
    label: "Nutzerverwaltung",
    value: "/settings/user_management",
    icon: "users",
    divider: "Einstellungen",
    sub_menu: [],
  },
  {
    label: "Zeiten und Zuschläge",
    value: "/settings/times",
    icon: "calendar",
    sub_menu: [],
  },
  {
    label: "Projekt",
    value: "/settings/project",
    icon: "project",
    sub_menu: [],
  },
  // {
  //   label: "Logs",
  //   value: "/settings/logs",
  //   icon: "calendar",
  //   sub_menu: [],
  // },
];

const RenderSidebar = ({ user }: { user: PatflowUser }) => {
  const { project } = useAppContext();

  if (!project) {
    return null;
  }

  return (
    <div className="layout_sidebar_container" id="sidebar">
      <div className="layout_sidebar_header">
        <Logo logo={project.logo} alt={project.name} />
        <h1>{project.name ? project.name : "patflow"}</h1>
      </div>
      <Sidebar menuItems={menu_items} user={user} />
    </div>
  );
};

export default RenderSidebar;

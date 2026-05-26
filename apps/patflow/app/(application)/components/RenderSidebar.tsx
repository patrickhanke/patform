"use client";

import React, { useContext, useMemo } from "react";
import Logo from "./Logo";
import { Sidebar } from "@repo/ui";
import { PatflowUser } from "@repo/types";
import { PatflowAppContext, useAppContext, useDataStore } from "@repo/provider";
import { filterAbsences } from "@repo/modules";

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
  {
    label: "Logs",
    value: "/settings/logs",
    icon: "logs",
    sub_menu: [],
  },
];

const RenderSidebar = ({ user }: { user: PatflowUser }) => {
  const { year } = useContext(PatflowAppContext);
  const { project } = useAppContext();
  const { absences } = useDataStore();

  const menuItems = useMemo(() => {
    const absencesCount = filterAbsences(absences, year).length;

    console.log({ absencesCount });

    return menu_items.map((item) => {
      if (item.value === "/records") {
        return {
          ...item,
          badge: absencesCount > 0 ? {
                label: absencesCount.toString(),
                color: "red",
              }
            : undefined,
        };
      }
      return item;
    });
  }, [absences]);

  console.log({ menuItems });

  if (!project) {
    return null;
  }

  return (
    <div className="layout_sidebar_container" id="sidebar">
      <div className="layout_sidebar_header">
        <Logo logo={project.logo} alt={project.name} />
        <h1>{project.name ? project.name : "patflow"}</h1>
      </div>
      <Sidebar menuItems={menuItems} user={user} />
    </div>
  );
};

export default RenderSidebar;

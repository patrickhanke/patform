"use client";

import React, { useMemo } from "react";
import Logo from "./Logo";
import { MenuItem, Sidebar } from "@repo/ui";
import { Module, PatstoreRoleClass, PatstoreUser } from "@repo/types";
import packageJson from "../../../package.json";
import { useAppContext, useRoleForUser, canEnterModule } from "@repo/provider";
import { cloneDeep, truncate } from 'lodash-es';

const RenderSidebar = ({ user }: { user: PatstoreUser }) => {
  const { project, roles } = useAppContext<"patstore">();
  const { role: membership } = useRoleForUser(user.objectId, project?.objectId);
  const userRole =
    roles?.find((role) => role.objectId === membership?.objectId) ||
    ({} as PatstoreRoleClass);
  const menuItems = useMemo(() => {
    const menuItemsArray: MenuItem[] = [{
      label: "Dashboard",
      icon: "dashboard",
      value: "/",
      sub_menu: [],
    }];

    if (project) {
      const modules = cloneDeep(project.modules.sort( (a: Module, b: Module) => a.position - b.position));
      modules.forEach((module: Module) => {
        const subMenu =
          module.path === "/championships" ? [] : module.sub_menu || [];
        if (user.is_superuser) {
          menuItemsArray.push({
            label: module.name,
            icon: module.icon,
            value: module.path,
            sub_menu: subMenu,
          });
        } else if (userRole?.objectId && canEnterModule([userRole], module)) {
          menuItemsArray.push({
            label: module.name,
            icon: module.icon,
            value: module.path,
            sub_menu: subMenu,
          });
        }
      });
    }
    if (userRole && user.is_superuser) {
      menuItemsArray.push({
        divider: "Einstellungen",
        label: "Projekt",
        value: "/settings/project",
        icon: "project",
        sub_menu: [],
      })
      menuItemsArray.push({
        label: "Logs",
        value: "/settings/logs",
        icon: "logs",
        sub_menu: [],
      })
    }

    return menuItemsArray;
  }, [project, userRole]);

  if (!project) {
    return null;
  }

  return (
    <div className={"layout_sidebar_container"} id="sidebar">
      <div className={"layout_sidebar_header"}>
        <Logo logo={project.logo} alt={project.name} />
        <h1>{project.name ? truncate(project.name, {length: 12}) : "patstore"}</h1>
      </div>
      <Sidebar
        menuItems={menuItems}
        user={user}
        appVersion={packageJson.version}
        appName={process.env.APP_NAME}
      />
    </div>
  );
};

export default RenderSidebar;

"use client";

import React, { useMemo } from "react";
import Logo from "./Logo";
import { MenuItem, Sidebar } from "@repo/ui";
import { Module, PatstoreUser } from "@repo/types";
import packageJson from "../../../package.json";
import { useAppContext } from "@repo/provider";
import { cloneDeep, truncate } from 'lodash-es';

const RenderSidebar = ({ user }: { user: PatstoreUser }) => {
  const { project, roles } = useAppContext();
  
  const userRole = roles.find((role) => user.roles.includes(role.objectId));

  const menuItems = useMemo(() => {
    const menuItemsArray: MenuItem[] = [];

    if (project) {
      const modules = cloneDeep(project.modules.results).sort( (a: Module, b: Module) => a.position - b.position);
      modules.forEach((module: Module) => {
        if (user.is_superuser) {
          menuItemsArray.push({
            label: module.name,
            icon: module.icon,
            value: module.path,
            sub_menu: module.sub_menu || [],
          });
        } else if (userRole && userRole.modules.includes(module.objectId)) {
          menuItemsArray.push({
            label: module.name,
            icon: module.icon,
            value: module.path,
            sub_menu: module.sub_menu || [],
          });
        }
      });
    }

    menuItemsArray.push({
      divider: "Einstellungen",
      label: "Projekt",
      value: "/settings/project",
      icon: "project",
      sub_menu: [],
    })

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

"use client";

import React, { useContext, useMemo } from "react";
import Logo from "./Logo";
import { Sidebar } from "@repo/ui";
import { ProjectContext } from "@repo/provider";
import { Module, PatstoreUser } from "@repo/types";
import packageJson from "../../../package.json";

const RenderSidebar = ({ user }: { user: PatstoreUser }) => {
  const { project } = useContext(ProjectContext);

  const menuItems = useMemo(() => {
    const menuItemsArray: { value: string; label: string; icon: string }[] = [];
    if (project) {
      project.modules.results.forEach((module: Module) => {
        menuItemsArray.push({
          label: module.name,
          icon: module.icon,
          value: module.path,
        });
      });
    }

    return menuItemsArray;
  }, [project]);

  if (!project) {
    return null;
  }

  return (
    <div className={"layout_sidebar_container"} id="sidebar">
      <div className={"layout_sidebar_header"}>
        <Logo logo={project.logo} alt={project.name} />
        <h1>{project.name ? project.name : "patstore"}</h1>
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

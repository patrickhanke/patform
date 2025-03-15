"use client";

import React, { useMemo, useState } from "react";
import AppContext from "./AppContext";
import { Module, Project } from "@repo/types";
import { usePathname } from "next/navigation";

const AppContextProvider = ({
  project,
  children,
}: {
  project: Project;
  children: React.ReactNode;
}) => {
  const [pageTitle, setPageTitle] = useState();
  const pathname = usePathname();

  const currentModule = useMemo(() => {
    return project.modules.results.find(
      (module) => module.path === pathname
    ) as Module;
  }, [pathname, project]);

  const appContextObject = useMemo(
    () => ({
      pageTitle,
      setPageTitle,
      currentModule,
      modules: project.modules.results,
    }),
    [pageTitle, project, currentModule]
  );

  return (
    <AppContext.Provider value={appContextObject}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;

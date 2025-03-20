"use client";

import React, { useMemo, useState } from "react";
import PatflowAppContext from "./PatflowAppContext";
import { useQuery } from "@apollo/client";
import { FIND_ALL_ROLES } from "@repo/provider";
import { RoleUsers } from "./types";
import { PatflowUserRole } from "@repo/types";
import { CreateTask, CreateTicket } from "@repo/modules";
import dynamic from "next/dynamic";

const SelectYear = dynamic(() => import("./components/SelectYear"), {
  ssr: false,
});

const PatflowAppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [refetchTicket, setRefetchTicket] = useState<Date | undefined>();
  const [refetchTask, setRefetchTask] = useState<Date | undefined>();
  const [year, setYear] = useState(new Date().getFullYear());
  const { data: roleData } = useQuery(FIND_ALL_ROLES, {
    fetchPolicy: "cache-first",
  });

  const roleUsers = useMemo(() => {
    const roleObject: RoleUsers = {
      worker: [],
      office: [],
      admin: [],
    };

    if (roleData) {
      roleData.objects.find_Role.results.forEach((role: PatflowUserRole) => {
        roleObject[role.type] = role.users.results.map((user) => user.objectId);
      });
    }

    return roleObject;
  }, [roleData]);

  const appContextObject = useMemo(
    () => ({
      refetchTask,
      refetchTicket,
      createTicket: <CreateTicket setRefetchTicket={setRefetchTicket} />,
      createTask: <CreateTask setRefetchTask={setRefetchTask} />,
      selectYear: <SelectYear year={year} setYear={setYear} />,
      year,
      roles: roleData
        ? roleData.objects.find_Role.results.map((role: PatflowUserRole) => ({
            value: role.objectId,
            type: role.type,
            label: role.name,
            color: role.color,
            users: role.users.results,
          }))
        : [],
      roleUsers,
    }),
    [refetchTask, refetchTicket, roleUsers, year, roleData]
  );

  return (
    <PatflowAppContext.Provider value={appContextObject}>
      {children}
    </PatflowAppContext.Provider>
  );
};

export default PatflowAppContextProvider;

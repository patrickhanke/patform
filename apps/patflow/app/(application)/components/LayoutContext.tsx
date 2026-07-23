"use client";

import { ApolloAppProvider, AppContextProvider, DataContextProvider } from "@repo/provider";
import {
  UserContextProvider,
  NotificationContextProvider,
  PatflowAppContextProvider,
} from "@repo/provider";
import { PatflowProject, PatflowUser, PatflowUserRole } from "@repo/types";
import React from "react";

const LayoutContext = ({
  user,
  project,
  roles,
  children,
}: {
  user: PatflowUser;
  project?: PatflowProject;
  roles?: PatflowUserRole[];
  children: React.ReactNode;
}) => {
  return (
    <ApolloAppProvider
      uri={process.env.SASHIDO_GQL_URL as string}
      appId={process.env.SASHIDO_APP_ID as string}
      restKey={process.env.SASHIDO_REST_KEY as string}
    >
      <AppContextProvider project={project} roles={roles}>
        <UserContextProvider>
          <PatflowAppContextProvider>
            <NotificationContextProvider>
              <DataContextProvider>
                {children}
                </DataContextProvider>
            </NotificationContextProvider>
          </PatflowAppContextProvider>
        </UserContextProvider>
      </AppContextProvider>
    </ApolloAppProvider>
  );
};

export default LayoutContext;

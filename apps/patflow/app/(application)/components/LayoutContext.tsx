"use client";

import { ApolloAppProvider, DataContextProvider } from "@repo/provider";
import {
  UserContextProvider,
  NotificationContextProvider,
  PatflowAppContextProvider,
} from "@repo/provider";
import React from "react";

const LayoutContext = ({ children }: { children: React.ReactNode }) => {
  return (
    <ApolloAppProvider
      uri={process.env.SASHIDO_GQL_URL as string}
      appId={process.env.SASHIDO_APP_ID as string}
      restKey={process.env.SASHIDO_REST_KEY as string}
    >
      <UserContextProvider>
        <PatflowAppContextProvider>
          <NotificationContextProvider>
          <DataContextProvider>{children}</DataContextProvider>
          </NotificationContextProvider>
        </PatflowAppContextProvider>
      </UserContextProvider>
    </ApolloAppProvider>
  );
};

export default LayoutContext;

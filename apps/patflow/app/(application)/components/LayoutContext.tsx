"use client";

import { ApolloAppProvider } from "@repo/provider";
import { UserContextProvider, NotificationContextProvider, AppContextProvider } from "@provider";
import React from "react";

const LayoutContext = ({ children }: { children: React.ReactNode }) => {
  return (
    <ApolloAppProvider
      uri={process.env.SASHIDO_GQL_URL as string}
      appId={process.env.SASHIDO_APP_ID as string}
      restKey={process.env.SASHIDO_REST_KEY as string}
    >
      <UserContextProvider>
        <AppContextProvider>
          <NotificationContextProvider>
            <React.StrictMode>{children}</React.StrictMode>
          </NotificationContextProvider>
        </AppContextProvider>
      </UserContextProvider>
    </ApolloAppProvider>
  );
};

export default LayoutContext;

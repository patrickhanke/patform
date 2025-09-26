"use client";

import { ApolloAppProvider, AppContext, AppContextProvider } from "@repo/provider";
import { PatstoreUser } from "@repo/types";
import {
  PatstoreAppContextProvider,
  DataContextProvider
} from "@repo/provider";

const LayoutContext = ({
  user,
  children,
}: {
  user: PatstoreUser;
  children: React.ReactNode;
}) => {
  return (
    <ApolloAppProvider
      uri={process.env.SASHIDO_GQL_URL as string}
      appId={process.env.SASHIDO_APP_ID as string}
      restKey={process.env.SASHIDO_REST_KEY as string}
    >
      <AppContextProvider projects={user.projects}>
        <AppContext.Consumer>
          {({ project }) => {
            if (!project || !project.objectId) {
              return null;
            }
            return (
              <PatstoreAppContextProvider project={project}>
                <DataContextProvider>
                    {children}
                </DataContextProvider>
              </PatstoreAppContextProvider>
            );
          }}
        </AppContext.Consumer>
      </AppContextProvider>
    </ApolloAppProvider>
  );
};

export default LayoutContext;

"use client";

import { ApolloAppProvider, AppContextProvider } from "@repo/provider";
import { PatstoreProject, PatstoreRoleClass, PatstoreUser } from "@repo/types";
import {
  PatstoreAppContextProvider,
  DataContextProvider,
} from "@repo/provider";

const LayoutContext = ({
  user,
  project,
  roles,
  children,
}: {
  user: PatstoreUser;
  project?: PatstoreProject;
  roles?: PatstoreRoleClass[];
  children: React.ReactNode;
}) => {
  return (
    <ApolloAppProvider
      uri={process.env.SASHIDO_GQL_URL as string}
      appId={process.env.SASHIDO_APP_ID as string}
      restKey={process.env.SASHIDO_REST_KEY as string}
    >
      <AppContextProvider project={project} roles={roles}>
        {project?.objectId ? (
          <PatstoreAppContextProvider project={project} roles={roles || []}>
            <DataContextProvider>{children}</DataContextProvider>
          </PatstoreAppContextProvider>
        ) : null}
      </AppContextProvider>
    </ApolloAppProvider>
  );
};

export default LayoutContext;

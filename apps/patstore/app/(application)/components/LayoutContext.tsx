"use client";

import {
  ApolloAppProvider,
} from "@repo/provider";
import { PatstoreUser } from "@repo/types";
import { PatstoreAppContextProvider, DataContextProvider, ProjectContext, ProjectContextProvider } from "@repo/provider";

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
      <ProjectContextProvider projects={user.projects}>
        <ProjectContext.Consumer>
          {({ project }) => {
            if (!project || !project.objectId) {
              return null;
            }
            return (
              <PatstoreAppContextProvider project={project}>
                <DataContextProvider>{children}</DataContextProvider>
              </PatstoreAppContextProvider>
            );
          }}
        </ProjectContext.Consumer>
      </ProjectContextProvider>
    </ApolloAppProvider>
  );
};

export default LayoutContext;

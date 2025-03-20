import { ApolloAppProvider } from "@repo/provider";
import { Project } from "@repo/types";
import { AppContextProvider } from "@repo/provider";

const LayoutContext = ({
  projects,
  children,
}: {
  projects: Project[];
  children: React.ReactNode;
}) => {
  return (
    <ApolloAppProvider
      appId={process.env.SASHIDO_APP_ID as string}
      masterKey={process.env.SASHIDO_MASTER_KEY as string}
    >
      <AppContextProvider project={projects[0] as Project}>
        {children}
      </AppContextProvider>
    </ApolloAppProvider>
  );
};

export default LayoutContext;

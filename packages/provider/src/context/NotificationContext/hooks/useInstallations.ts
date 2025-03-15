import { useCallback, useEffect } from "react";
import {
  axiosclient,
  generateGraphQLQuery,
  generateUuid,
} from "@repo/provider";
import { useQuery } from "@apollo/client";
import { User } from "@repo/types";

const useInstallations = ({
  user,
  firebaseToken,
  hasInstallation = false,
}: {
  user?: User;
  firebaseToken: string | null;
  hasInstallation: boolean;
}) => {
  const { data: installationData, refetch } = useQuery(
    generateGraphQLQuery({
      objectName: "_Installation",
      type: "find",
      fields: ["objectId"],
    }),
    {
      variables: {
        params: { user: { _eq: user?.objectId }, deviceType: { _eq: "web" } },
      },
      skip: !user || !hasInstallation,
    },
  );

  const installationHandler = useCallback(async () => {
    if (installationData && user && firebaseToken) {
      const installations = installationData.objects.find_Installation.results;

      if (installations.length === 0) {
        await axiosclient().post("functions/create-installation", {
          deviceType: "web",
          deviceToken: firebaseToken,
          channels: [],
          appIdentifier: process.env.FIREBASE_APP_ID,
          appName: "patflow",
          appVersion: "0.6.0",
          parseVersion: "3.6.0",
          localeIdentifier: "de-DE",
          timeZone: "GMT",
          user: user.objectId,
          installationId: generateUuid(),
          GCMSenderId: process.env.GCMS_SENDER_ID,
          pushType: "gcm",
        });
        await refetch();
      }
    }
  }, [installationData]);

  useEffect(() => {
    if (installationData || user) {
      installationHandler();
    }
  }, [installationData]);
};

export default useInstallations;

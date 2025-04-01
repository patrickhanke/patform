"use client";

import { GET_USER } from "@repo/provider";
import { useQuery } from "@apollo/client";
import React, { Suspense, useContext, useMemo, useState } from "react";
import useWorkerSiteStates from "./hooks/useWorkerSiteStates";
import UserSettings from "./content/UserSettings";
import StaffMemberOverview from "./content/StaffMemberOverview";
import { Params } from "@repo/types";
import StaffMemberTimes from "./content/StaffMemberTimes";
import { SiteState } from "@repo/types";
import { Page } from "@repo/ui";
import { UserContext } from "@repo/provider";

const StaffMember = ({ params }: { params: Params }) => {
  const { data, loading } = useQuery(GET_USER, {
    variables: { id: params.user_id },
    fetchPolicy: "no-cache",
  });
  const siteStates = useWorkerSiteStates();
  const [siteState, setSiteState] = useState<SiteState>(
    siteStates[0] as SiteState,
  );
  const [createRecord, setCreateRecord] = useState(false);
  const { projectId } = useContext(UserContext);

  const siteHeaderButtons = useMemo(
    () =>
      siteState.value === "times"
        ? [
            {
              text: "Neue Zeiterfassung anlegen",
              onClick: () => setCreateRecord(true),
            },
          ]
        : [],
    [siteState],
  );

  if (loading || !projectId) {
    return <p>Lädt...</p>;
  }
  const user = data.objects.get_User;

  return (
    <Suspense>
      <Page
        title={
          data &&
          `${data.objects.get_User.first_name} ${data.objects.get_User.family_name}`
        }
        pageStates={siteStates}
        pageState={siteState}
        setPageState={setSiteState}
        pageHeaderButtons={siteHeaderButtons}
        emptyContent
      >
        {siteState.value === "overview" && (
          <StaffMemberOverview userId={params.user_id} />
        )}
        {siteState.value === "settings" && (
          <UserSettings userId={params.user_id} />
        )}
        {siteState.value === "times" && (
          <StaffMemberTimes
            userId={params.user_id}
            timeSettings={user.time_settings}
            createRecord={createRecord}
            setCreateRecord={setCreateRecord}
            projectId={projectId}
          />
        )}
      </Page>
    </Suspense>
  );
};

export default StaffMember;

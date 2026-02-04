"use client";

import { useGetData } from "@repo/provider";
import { Suspense, useContext, useState } from "react";
import useWorkerSiteStates from "./hooks/useWorkerSiteStates";
import UserSettings from "./content/UserSettings";
import StaffMemberOverview from "./content/StaffMemberOverview";
import { Params } from "@repo/types";
import { SiteState } from "@repo/types";
import { Page } from "@repo/ui";
import { UserContext } from "@repo/provider";

const StaffMember = ({ params }: { params: Params }) => {
	const { data, loading } = useGetData({
		objectName: "User",
		fields: ["objectId", "first_name", "last_name", "email", "username"],
		id: params.user_id
	});
	const siteStates = useWorkerSiteStates();
	const [siteState, setSiteState] = useState<SiteState>(
		siteStates[0] as SiteState
	);
	const { projectId } = useContext(UserContext);

	if (loading || !projectId) {
		return <p>Lädt...</p>;
	}

	return (
		<Suspense>
			<Page
				title={
					data &&
					`${data.first_name} ${data.last_name}`
				}
				pageStates={siteStates}
				pageState={siteState}
				setPageState={setSiteState}
				emptyContent
			>
				{siteState.value === "overview" && (
					<StaffMemberOverview userId={params.user_id} />
				)}
				{siteState.value === "settings" && (
					<UserSettings userId={params.user_id} />
				)}
			</Page>
		</Suspense>
	);
};

export default StaffMember;

"use client";

import { useContext, useMemo, useState } from "react";
import { Divider, HtmlContent, Page, SwitchButtons } from "@repo/ui";
import { PatstoreAppContext, useAppContext } from "@repo/provider";
import { SiteState } from "@repo/types";
import UserAccess from "./components/UserAccess";
import UserAccessLink from "./components/UserAccessLink";
import { userModulePermissions } from "./functions/userModulePermissions";

const dashboardViews: SiteState[] = [
	{ label: "Übersicht", value: "overview" },
	{ label: "Berechtigungen", value: "permissions" }
];

const Dashboard = () => {
	const { project } = useAppContext<"patstore">();
	const { user, modules } = useContext(PatstoreAppContext);
	const dashboardContent = project?.data?.dashboard?.content;
	const [view, setView] = useState<SiteState>(dashboardViews[0]);

	const permissions = useMemo(
		() => userModulePermissions(modules, user?.objectId),
		[modules, user?.objectId]
	);
	const showPermissions = view.value === "permissions" && permissions.length > 0;

	return (
		<Page title="Dashboard">
			{permissions.length > 0 && (
				<SwitchButtons
					buttonStates={dashboardViews}
					currentStates={view}
					changeHandler={setView}
				/>
			)}
			{showPermissions ? (
				<div className="content_element flex col gap-sm">
					<h2>Berechtigungen</h2>
					<div className="flex col gap-xs">
						{permissions.map((item) => (
							<UserAccessLink key={item.href} {...item} />
						))}
					</div>
				</div>
			) : (
				<>
					<div className="flex col gap-md">
						<UserAccess />
					</div>
					<Divider />
					{dashboardContent && <HtmlContent content={dashboardContent} />}
				</>
			)}
		</Page>
	);
};

export default Dashboard;

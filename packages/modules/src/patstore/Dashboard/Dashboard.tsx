"use client";

import { useContext, useMemo } from "react";
import { Divider, HtmlContent, Page } from "@repo/ui";
import { PatstoreAppContext, useAppContext } from "@repo/provider";
import UserAccessLink from "./components/UserAccessLink";
import { userModulePermissions } from "./functions/userModulePermissions";

const Dashboard = () => {
	const { project } = useAppContext<"patstore">();
	const { user, modules } = useContext(PatstoreAppContext);
	const dashboardContent = project?.data?.dashboard?.content;

	const permissions = useMemo(
		() => userModulePermissions(modules, user?.objectId),
		[modules, user?.objectId]
	);
	const showPermissions = permissions.length > 0;

	return (
		<Page title="Dashboard">
			{dashboardContent && <HtmlContent content={dashboardContent} />}
			{showPermissions && (
				<>
					<h2>Berechtigungen</h2>
					<Divider showLine={false} />
					<div className="content_element flex col gap-sm">
						<div className="flex col gap-xs">
							{permissions.map((item) => (
								<UserAccessLink key={item.href} {...item} />
							))}
						</div>
					</div>
				</>
			)}
		</Page>
	);
};

export default Dashboard;

import React from "react";
import "@repo/styles/global";
import "@repo/styles/layout";
import { ApolloClient, OperationVariables } from "@apollo/client";
import { PatstoreProject } from "@repo/types";
import { serverClient } from "@repo/provider";
import SiteHeader from "./content/SiteHeader";
import { AdminLayoutContext, find_initial_projects } from "@repo/modules";
import RenderSidebar from "./components/RenderSidebar";

export const metadata = {
	title: "Patwork Admin",
	description: "PH"
};

interface GetProjectsResponse {
	objects: {
		findProject: {
			results: PatstoreProject[];
		};
	};
}

const getData = async () => {
	const projectId = process.env.PROJECT_ID;
	console.log({ "admin project_ud": projectId });

	const client: ApolloClient<any> = serverClient(
		process.env.SASHIDO_GQL_URL as string,
		process.env.SASHIDO_APP_ID as string,
		process.env.SASHIDO_MASTER_KEY as string
	);

	const { data } = await client.query<
		GetProjectsResponse,
		OperationVariables
	>({
		query: find_initial_projects,
		variables: { id: projectId || "H7eK6Fv3cn" }
	});

	return data;
};

export default async function AdminLayout({
	children
}: {
	children: React.ReactNode;
}) {
	const data = await getData();

	return (
		<html lang="de">
			<body>
				<div className={"layout"}>
					<AdminLayoutContext
						projects={data.objects.findProject.results}
					>
						<RenderSidebar
							menuItems={data.objects.findProject.results.map(
								(project: PatstoreProject) => ({
									label: project.name,
									icon: undefined,
									value: `/projects/${project.objectId}`
								})
							)}
						/>

						<div className={"main_content"} id="main_content">
							<div
								className={"content_container"}
								id="page_content"
							>
								<SiteHeader />
								<div className={"content"} id="content">
									{children}
								</div>
							</div>
						</div>
					</AdminLayoutContext>
				</div>
			</body>
		</html>
	);
}

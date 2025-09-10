import React from "react";
import "@repo/styles/global";
import "@repo/styles/layout";
import { ApolloClient, OperationVariables } from "@apollo/client";
// import { PatstoreProject } from "@repo/types";
import RenderSidebar from "./components/RenderSidebar";
import SiteHeader from "./content/SiteHeader";
import find_initial_projects from "./constants/find_initial_projects";
import AdminLayoutContext from "./components/AdminLayoutContext";
import serverClient from "./components/serverClient";

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
	const client: ApolloClient<any> = serverClient(
		process.env.SASHIDO_GQL_URL as string,
		process.env.SASHIDO_APP_ID as string,
		process.env.SASHIDO_MASTER_KEY as string
	);

	const { data } = await client.query<
		GetProjectsResponse,
		OperationVariables
	>({
		query: find_initial_projects
	});

	return data;
};

export default async function RootLayout({
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

import React from "react";
import "@repo/styles/global";
import "@repo/styles/layout";
import { PatstoreProject } from "@repo/types";
import { cookies } from "next/headers";
import {AdminRenderSidebar, AdminLayoutContext, AdminSiteHeader} from "@repo/modules";

const getData = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get(process.env.SESSION_TOKEN as string)?.value;

  const httpHeaders = {
    "X-Parse-Session-Token": token || "",
    "X-Parse-Application-Id": process.env.SASHIDO_APP_ID || "",
    "X-Parse-REST-API-Key": process.env.SASHIDO_REST_KEY || "",
  };

  const headers = new Headers(httpHeaders);

  const response = await fetch(`${process.env.SASHIDO_API_URL}classes/Project`, {
    method: "GET",
    headers,
  }).then((response) => response.json());

  return response.results;
};

export default async function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {

	const projects: PatstoreProject[] = await getData();

	console.log(projects)
	return (
		<html lang="de">
			<body>
				<div className={"layout"}>
					<AdminLayoutContext
						projects={[]}
					>
						<AdminRenderSidebar
							menuItems={projects.map(
								(project: PatstoreProject) => ({
									label: project.name,
									icon: undefined,
									value: `/admin/projects/${project.objectId}`,
									sub_menu: []
								})
							)}
						/>

						<div className={"main_content"} id="main_content">
							<div
								className={"content_container"}
								id="page_content"
							>
								<AdminSiteHeader />
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

import React from "react";
import "@repo/styles/global";
import "@repo/styles/layout";
// import { PatstoreProject } from "@repo/types";
import SiteHeader from "./content/SiteHeader";
import { AdminLayoutContext } from "@repo/modules";
import RenderSidebar from "./components/RenderSidebar";
import { PatstoreProject } from "@repo/types";
import { cookies } from "next/headers";


const getData = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get(process.env.SESSION_TOKEN as string)?.value;

  const httpHeaders = {
    "X-Parse-Session-Token": token || "",
    "X-Parse-Application-Id": process.env.SASHIDO_APP_ID || "",
    "X-Parse-REST-API-Key": process.env.SASHIDO_REST_KEY || "",
  };

  const headers = new Headers(httpHeaders);

  const projects = await fetch(`${process.env.SASHIDO_API_URL}classes/Project`, {
    method: "GET",
    headers,
  }).then((response) => response.json());

  return projects;
};

export default async function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {

	const projects: PatstoreProject[] = await getData();
	return (
		<html lang="de">
			<body>
				<div className={"layout"}>
					<AdminLayoutContext
						projects={[]}
					>
						<RenderSidebar
							menuItems={projects.map(
								(project: PatstoreProject) => ({
									label: project.name,
									icon: undefined,
									value: `/projects/${project.objectId}`,
									sub_menu: []
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

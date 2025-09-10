import React from "react";
import "@repo/styles/global";
import "@repo/styles/layout";
// import { PatstoreProject } from "@repo/types";
import SiteHeader from "./content/SiteHeader";



export default async function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="de">
			<body>
				<div className={"layout"}>
					{/* <AdminLayoutContext */}
						projects={[]}
					>
						{/* <RenderSidebar
							menuItems={data.objects.findProject.results.map(
								(project: PatstoreProject) => ({
									label: project.name,
									icon: undefined,
									value: `/projects/${project.objectId}`
								})
							)}
						/> */}

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
					{/* </AdminLayoutContext> */}
				</div>
			</body>
		</html>
	);
}

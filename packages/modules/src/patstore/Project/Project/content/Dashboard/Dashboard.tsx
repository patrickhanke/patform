"use client";

import { Editor, usePageData } from "@repo/ui";
import { FC } from "react";
import { DashboardProps } from "./types";

const Dashboard: FC<DashboardProps> = ({ project }) => {
	const { data, setData } = usePageData(
		{
			initialData: { data: project.data ?? {} },
			objectId: project.objectId
		},
		{
			className: "Project",
			updateObject: (values) => values,
			message: "Dashboard wurde erfolgreich aktualisiert."
		}
	);

	return (
		<Editor
			content={data?.data?.dashboard?.content || ""}
			onChange={(content) => setData("data.dashboard.content", content)}
		/>
	);
};

export default Dashboard;

"use client";

import { useAppContext } from "@repo/provider";
import { TvstgWebsite } from "./tvstg";
import { DefaultWebsite } from "./default";

const Website = () => {
	const { project } = useAppContext();

	console.log("project", project);
	if (project.path === "tvstg") {
		return <TvstgWebsite />;
	}
	return <DefaultWebsite />;
};

export default Website;

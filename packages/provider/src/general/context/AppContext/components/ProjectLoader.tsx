import { FC } from "react";
import Image from "next/image";

import patflow_lettering from "../images/patflow_lettering.png";
import patstore_lettering from "../images/patstore_lettering.png";
import patstore_logo from "../images/patstore_logo.png";
import patflow_logo from "../images/patflow_logo.png";
import { ProjectLoaderProps } from "../types";
import { LoadingIndicator } from "@repo/ui";
import "../styles.scss";

const ProjectLoader: FC<ProjectLoaderProps> = ({
	loading,
	error,
	project,
	appId
}) => {
	const logo = appId === "patstore" ? patstore_logo : patflow_logo;
	const lettering =
		appId === "patstore" ? patstore_lettering : patflow_lettering;

	if (!loading) {
		return null;
	}

	return (
		<div className="project_initializer_container">
			<Image
				src={logo}
				// width={135}
				style={{ borderRadius: "0px" }}
				width={120}
				alt="Hausmeister App"
			/>
			<Image
				src={lettering}
				// width={135}
				style={{ borderRadius: "0px" }}
				width={120}
				alt="Hausmeister App"
			/>
			<h3>
				{loading && <LoadingIndicator />}
				{error &&
					"Fehler beim Laden des Projekts, bitte wenden Sie sich an den Administrator"}
				{!loading &&
					!project &&
					"Fehler beim Laden des Projekts, bitte wenden Sie sich an den Administrator"}
			</h3>
		</div>
	);
};

export default ProjectLoader;

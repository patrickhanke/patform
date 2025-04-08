"use client";

import { useState } from "react";
import styles from "./SiteHeader.module.scss";
import { SiteHeaderComponent } from "./types";
import AddProject from "./components/AddProject";

const SiteHeader = ({ title }: SiteHeaderComponent) => {
	const [addProject, setAddProject] = useState(false);

	return (
		<>
			<div className={styles.main_container}>
				<div className={styles.siteheader_container}>
					<h1>{title}</h1>
					p<div className={styles.siteheader_right_container}>
						<button
							className="full_button sm primary"
							onClick={() => setAddProject(true)}
						>
							Neues Projekt erstellen
						</button>
						<div className="vertical_line" />
					</div>
				</div>
			</div>
			<AddProject addProject={addProject} setAddProject={setAddProject} />
		</>
	);
};

export default SiteHeader;

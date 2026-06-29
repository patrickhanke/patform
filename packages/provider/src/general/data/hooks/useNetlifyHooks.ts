import React, { useCallback } from "react";
import { PatstoreAppContext } from "../../../patstore";
import axios from "axios";

const useNetlifyHooks = () => {
	const { project } = React.useContext(PatstoreAppContext);

	const netlifyHookHandler = useCallback(
		(objectClass: string) => {
			if (!project) {
				return;
			}
			if (project.path === "bcd") {
				return axios.post(
					"https://api.netlify.com/build_hooks/696649490b1bbc713ef942c9"
				);
			}
			if (project.path === "tvstg") {
				if (
					objectClass === "Article" ||
					objectClass === "Webpage" ||
					objectClass === "Content" ||
					objectClass === "Entry" ||
					objectClass === "Event" ||
					objectClass === "Form" ||
					objectClass === "Image" ||
					objectClass === "Group" ||
					objectClass === "Download" ||
					objectClass === "Person" ||
					objectClass === "Category" ||
					objectClass === "Appointment"
				) {
					return axios.post(
						"https://api.netlify.com/build_hooks/608c71bcb42fb00f6e535a9c"
					);
				}
			}
			if (project.path === "patwork") {
				if (
					objectClass === "Article" ||
					objectClass === "Webpage" ||
					objectClass === "Content"
				) {
					axios.post(
						"https://api.netlify.com/build_hooks/684a8ce3f81b3b21f4aa34d8"
					);
					return axios.post(
						"https://api.vercel.com/v1/integrations/deploy/prj_OhGFYMtNJUrzaAoTTHMsBUVybA5G/zgrsBETrlk"
					);
				}
			}
			if (project.objectId === "JwPcBkuLDi") {
				axios.post(
					"https://api.netlify.com/build_hooks/6a425999f5c9e23580ef3d53"
				);
			}
			if (project.objectId === "JRxDkaxCoI") {
				axios.post(
					"https://api.netlify.com/build_hooks/68a58efad44d4e2b1c6cb0d7"
				);
			}
			if (project.path === "bei_lisa") {
				axios.post(
					"https://api.netlify.com/build_hooks/698058ffd5736a2e12b62c64"
				);
			}
		},

		[project]
	);

	return netlifyHookHandler;
};

export default useNetlifyHooks;

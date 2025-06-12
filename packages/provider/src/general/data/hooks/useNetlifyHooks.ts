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
			if (project.path === "tvstg") {
				if (
					objectClass === "Article" ||
					objectClass === "Webpage" ||
					objectClass === "Content"
				) {
					return axios.post(
						"https://api.netlify.com/build_hooks/682ae7fb29acb184f8de3d77"
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
					)	
					return axios.post(
						"https://api.vercel.com/v1/integrations/deploy/prj_OhGFYMtNJUrzaAoTTHMsBUVybA5G/zgrsBETrlk"
					);
				}
			}
		},

		[project]
	);

	return netlifyHookHandler;
};

export default useNetlifyHooks;

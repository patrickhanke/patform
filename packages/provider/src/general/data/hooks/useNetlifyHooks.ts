import React, { useCallback } from "react";
import { PatstoreAppContext } from "../../../patstore";
import axios from "axios";

const useNetlifyHooks = () => {
	const { project } = React.useContext(PatstoreAppContext);

	const netlifyHookHandler = useCallback(
		(objectClass: string) => {
			if (project.path === "tvstg") {
				if (objectClass === "Article" || objectClass === "Webpage") {
					return axios.post(
						"https://api.netlify.com/build_hooks/682ae7fb29acb184f8de3d77"
					);
				}
			}
		},
		[project]
	);

	return netlifyHookHandler;
};

export default useNetlifyHooks;

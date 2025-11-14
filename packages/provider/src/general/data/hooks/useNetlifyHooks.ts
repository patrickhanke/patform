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
					"https://api.netlify.com/build_hooks/6917327aaad5ac286e994e72"
				);
			}
			if (project.path === "tvstg") {
				if (
					objectClass === "Article" ||
					objectClass === "Webpage" ||
					objectClass === "Content" ||
					objectClass === "News" ||
					objectClass === "Event" ||
					objectClass === "Form" ||
					objectClass === "Image" ||
					objectClass === "Group" ||
					objectClass === "Download" ||
					objectClass === "Person" ||
					objectClass === "Category" ||
					objectClass === "Date"
				) {
					return axios.post(
						"https://api.netlify.com/build_hooks/690c760578610ba16cc20019"
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
			if (project.objectId === "JRxDkaxCoI") {
				axios.post(
					"https://api.netlify.com/build_hooks/68a58efad44d4e2b1c6cb0d7"
				);
				// return axios.post(
				// 	"https://api.vercel.com/v1/integrations/deploy/prj_OhGFYMtNJUrzaAoTTHMsBUVybA5G/zgrsBETrlk"
				// );
			}
		},

		[project]
	);

	return netlifyHookHandler;
};

export default useNetlifyHooks;

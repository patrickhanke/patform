"use client";

import { useContext, useMemo, useState } from "react";
import { PatstoreAppContext, generateGraphQLQuery } from "@repo/provider";
import { Page } from "@repo/ui";
import pages_states from "./constants/page_states";
import WebsiteSettings from "./content/WebsiteSettings";
import { PageState } from "@repo/types";
import WebsitePages from "./content/WebsitePages";
import { useQuery } from "@apollo/client";
import createPage from "./constants/createPage";

const Website = () => {
	const { currentModule } = useContext(PatstoreAppContext);
	console.log(currentModule);

	const { data: moduleData } = useQuery(
		generateGraphQLQuery({
			type: "get",
			objectName: "Module",
			fields: ["settings", "objectId"]
		}),
		{ variables: { id: currentModule.objectId } }
	);
	const [activeState, setActiveState] = useState<
		(typeof pages_states)[number]
	>(pages_states[0] as PageState);

	const createClass = useMemo(() => {
		if (activeState.value === "pages") {
			return createPage();
		}
		return null;
	}, [activeState]);

	if (moduleData) {
		const module = moduleData.objects.getModule;

		return (
			<Page
				title={currentModule.name}
				// pageHeaderContent={}
				emptyContent={true}
				pageStates={pages_states}
				pageState={activeState}
				setPageState={setActiveState}
				createClass={createClass}
			>
				{activeState.value === "settings" && (
					<WebsiteSettings
						settings={module.settings}
						moduleId={currentModule.objectId}
					/>
				)}
				{activeState.value === "pages" && (
					<WebsitePages moduleId={currentModule.objectId} />
				)}
			</Page>
		);
	}
	return null;
};

export default Website;

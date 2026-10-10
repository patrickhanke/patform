"use client";

import { useMemo, useState } from "react";
import useSiteStates from "./constants/siteStates";
import { useGetData } from "@repo/provider";
import { PropertyTasks, PropertyTickets } from "./content";
import { Page, PageHeaderButton } from "@repo/ui";
import { useParams } from "next/navigation";

const Property = () => {
	const { object_id: objectId } = useParams<{ object_id: string }>();
	const siteStates = useSiteStates();
	const [siteState, setSiteState] = useState<(typeof siteStates)[number]>(
		siteStates[0] as (typeof siteStates)[number]
	);

	const { data: property, refetch } = useGetData({
		objectName: "Property",
		fields: [
			"objectId",
			"name",
			"createdAt",
			"created_by {objectId username}",
			"archived",
			"services"
		],
		id: objectId
	});

	const siteContent = useMemo(() => {
		const content = {
			description: "Objektübersicht"
		};
		if (siteState.value === "tasks") {
			content.description = "Aufgabenübersicht";
		}
		if (siteState.value === "settings") {
			content.description = "Einstellungen";
		}

		return content;
	}, [siteState]);

	if (!property) return null;

	return (
		<Page
			title={`${property.name} ${property.archived ? "(Archiviert)" : ""}`}
			description={siteContent.description}
			refetch={refetch}
			pageStates={siteStates}
			pageState={siteState}
			setPageState={setSiteState}
		>
			{siteState.value === "tasks" && (
				<PropertyTasks objectId={objectId} />
			)}

			{siteState.value === "tickets" && <PropertyTickets id={objectId} />}
		</Page>
	);
};

export default Property;

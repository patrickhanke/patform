"use client";

import React, { use, useMemo, useState } from "react";
import useSiteStates from "./constants/siteStates";
import { useGetData } from "@repo/provider";
import PropertyTasks from "./content/PropertyTasks";
import PropertySettings from "./content/PropertySettings";
import PropertyServices from "./content/PropertyServices";
import PropertyTallies from "./content/PropertyTallies";
import PropertyDocuments from "./content/PropertyDocuments";
import PropertyTickets from "./content/PropertyTickets";
import { Params, Property as PropertyType } from "@repo/types";
import { Page, PageHeaderButton } from "@repo/ui";

const Property = ({ params }: { params: Params }) => {
	const siteStates = useSiteStates();
	const [siteState, setSiteState] = useState<(typeof siteStates)[number]>(
		siteStates[0] as (typeof siteStates)[number]
	);
	const [addService, setAddService] = useState(false);

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
		id: params.object_id
	});

	console.log(property);

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
		if (siteState.value === "services") {
			content.description = "Dienstleistungen";
		}
		if (siteState.value === "tallies") {
			content.description = "Zähler";
		}
		return content;
	}, [siteState]);

	const pageHeaderButtons: PageHeaderButton[] = useMemo(() => {
		if (siteState.value === "services") {
			return [
				{
					text: "Leistung hinzufügen",
					onClick: () => setAddService(true),
					is_add_button: true
				}
			] as PageHeaderButton[];
		}
		return [];
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
			pageHeaderButtons={pageHeaderButtons}
		>
			{siteState.value === "tasks" && (
				<PropertyTasks objectId={params.object_id} />
			)}
			{siteState.value === "settings" && (
				<PropertySettings
					propertyId={params.object_id}
					refetch={refetch}
				/>
			)}
			{siteState.value === "services" && (
				<PropertyServices
					objectId={params.object_id}
					propertyServices={property.services}
					addService={addService}
					setAddService={setAddService}
				/>
			)}
			{siteState.value === "tallies" && (
				<PropertyTallies objectId={params.object_id} />
			)}
			{siteState.value === "documents" && (
				<PropertyDocuments id={params.object_id} />
			)}
			{siteState.value === "tickets" && (
				<PropertyTickets id={params.object_id} />
			)}
		</Page>
	);
};

export default Property;

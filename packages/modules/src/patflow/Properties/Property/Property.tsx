"use client";

import { useMemo, useState } from "react";
import useSiteStates from "./constants/siteStates";
import { useGetData } from "@repo/provider";
import PropertyTasks from "./content/PropertyTasks";
import PropertySettings from "./content/PropertySettings";
import PropertyServices from "./content/PropertyServices";
import PropertyTallies from "./content/PropertyTallies";
import PropertyDocuments from "./content/PropertyDocuments";
import PropertyTickets from "./content/PropertyTickets";
import { Page, PageHeaderButton } from "@repo/ui";
import { CreateTask } from "@repo/modules";
import { useParams } from "next/navigation";

const Property = () => {
	const { object_id: objectId } = useParams<{ object_id: string }>();
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
				<PropertyTasks objectId={objectId} />
			)}
			{siteState.value === "settings" && (
				<PropertySettings
					propertyId={objectId}
					refetch={refetch}
				/>
			)}
			{siteState.value === "services" && (
				<PropertyServices objectId={objectId} />
			)}
			{siteState.value === "tallies" && (
				<PropertyTallies objectId={objectId} />
			)}
			{siteState.value === "documents" && (
				<PropertyDocuments id={objectId} />
			)}
			{siteState.value === "tickets" && (
				<PropertyTickets id={objectId} />
			)}
			{addService && (
				<CreateTask
					isService={true}
					openSlideIn={addService}
					setOpenSlideIn={setAddService}
					propertyId={objectId}
				/>
			)}
		</Page>
	);
};

export default Property;

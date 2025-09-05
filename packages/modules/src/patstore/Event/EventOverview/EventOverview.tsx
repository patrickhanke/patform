"use client";

import { useContext, useState } from "react";
import { Page, Table, useCreateColumns } from "@repo/ui";
import { EventClass } from "@repo/types";
import { PatstoreAppContext } from "@repo/provider";
import createEvent from "./constants/createEvent";
import useFindEvent from "./hooks/useFindEvent";

const EventOverview = () => {
	const { currentModule } = useContext(PatstoreAppContext);
	const [filters] = useState([]);
	const { events, refetch } = useFindEvent({
		moduleId: currentModule.objectId,
		filters
	});

	const columns = useCreateColumns<EventClass>({
		data: [
			{ id: "image", type: "edit_image", label: "Bild" },
			{ id: "title", type: "edit_string", label: "Titel" },
			{ id: "description", type: "edit_textfield", label: "Text" },
			{ id: "dates", type: "edit_dates", label: "Termine" }
		],
		fields: currentModule.fields,
		className: "Event",
		refetch,
		categories: currentModule?.categories
	});

	return (
		<Page
			title={currentModule.name}
			emptyContent={true}
			createClass={createEvent}
			refetch={refetch}
		>
			<Table columns={columns} data={events || []} />
		</Page>
	);
};

export default EventOverview;

"use client";

import { useContext, useState } from "react";
import { PatstoreAppContext } from "@repo/provider";
import useFindLocation from "./hooks/useFindLocation";
import { Page, Table, useCreateColumns } from "@repo/ui";
import { LocationClass } from "@repo/types";
import createLocation from "./constants/createLocation";

const LocationOverview = () => {
	const { currentModule } = useContext(PatstoreAppContext);
	const [filters] = useState([]);
	const { locations, refetch } = useFindLocation({
		moduleId: currentModule.objectId,
		filters
	});

	const columns = useCreateColumns<LocationClass>({
		data: [
			{ id: "image", type: "edit_image", label: "Bild" },
			{ id: "name", type: "edit_string", label: "Name" },
			{ id: "address", type: "edit_textfield", label: "Adresse" },
			{
				id: "description",
				type: "edit_textfield",
				label: "Beschreibung"
			},
			{ id: "geopoint", type: "edit_geopoint", label: "Koordinaten" }
		],
		fields: currentModule.fields,
		className: "Location",
		refetch,
		categories: currentModule?.categories
	});

	return (
		<Page
			title={currentModule.name}
			emptyContent={true}
			createClass={createLocation}
			refetch={refetch}
		>
			<Table columns={columns} data={locations || []} />
		</Page>
	);
};

export default LocationOverview;

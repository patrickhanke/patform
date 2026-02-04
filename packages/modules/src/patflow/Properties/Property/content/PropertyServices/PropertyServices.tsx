import React, { FC } from "react";
import useTableColumns from "./hooks/useTableColumns";
import { useFindData } from "@repo/provider";
import { Table } from "@repo/ui";
import { PropertyServicesProps } from "./types";
import AddService from "./content/AddService";

const PropertyServices: FC<PropertyServicesProps> = ({
	objectId,
	addService,
	setAddService
}) => {
	const { data } = useFindData({
		objectName: "Service",
		fields: [
			"objectId",
			"name",
			"property { objectId name }",
			"worker { results { objectId username } }",
			"time"
		],
		filters: [{ key: "property", value: objectId, operator: "_eq" }]
	});
	const columns = useTableColumns();

	return (
		<div className="site_content">
			<Table
				columns={columns}
				data={data || []}
			/>
			<AddService
				propertyId={objectId}
				addService={addService}
				setAddService={setAddService}
			/>
		</div>
	);
};

export default PropertyServices;

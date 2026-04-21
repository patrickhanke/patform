"use client";

import { useDataStore } from "@repo/provider";
import { useMemo, useState } from "react";
import { AddEditServiceState, ServiceData } from "./types";
import { Property } from "@repo/types";
import AddEditService from "./content/AddEditService";
import useServiceTableColumns from "./hooks/useServiceTableColumns";
import { Table } from "@repo/ui";

const Services = ({ projectId }: { projectId: string }) => {
	const [addEditService, setAddEditService] =
		useState<AddEditServiceState | null>(null);

	const { properties } = useDataStore();

	const columns = useServiceTableColumns({ setAddEditService });

	const tableData = useMemo(() => {
		if (properties) {
			console.log(properties);
			const services: ServiceData[] = [];

			properties.forEach((property: Property) => {
				const propertyObject: ServiceData = {
					objectId: property.objectId,
					name: property.name,
					...(property.services as Property["services"])
				};
				services.push(propertyObject);
			});

			return services;
		}

		return [];
	}, [properties]);

	return (
		<>
			<div className="content_element no_padding">
				<Table columns={columns} data={tableData} />
			</div>
			{!!addEditService && (
				<AddEditService
					title={`${addEditService.propertyName} - ${addEditService.serviceName}`}
					addEditService={addEditService}
					setAddEditService={setAddEditService}
					propertyId={addEditService.propertyId}
					serviceId={addEditService.serviceId}
					refetch={() => {}}
				/>
			)}
		</>
	);
};

export default Services;

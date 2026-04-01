import React, { FC, useCallback, useMemo, useState } from "react";
import useTableColumns from "./hooks/useTableColumns";
import { Divider, SwitchButton, SwitchButtons, Table } from "@repo/ui";
import { PropertyServiceChangeHandler, PropertyServicesProps } from "./types";
import AddService from "./content/AddService";
import { PropertyService } from "@repo/types";
import { cloneDeep, set } from "lodash-es";
import switch_buttons from "./constants/switch_buttons";

const PropertyServices: FC<PropertyServicesProps> = ({
	objectId,
	propertyServices = [],
	addService,
	setAddService
}) => {
	const [currentStates, setCurrentStates] = useState<SwitchButton>(
		switch_buttons[0]
	);
	const [newPropertyService, setNewPropertyService] =
		useState<PropertyService[]>(propertyServices);

	const serviceChangeHandler: PropertyServiceChangeHandler = useCallback(
		(id, key, value) => {
			const newPropertyServiceCopy = cloneDeep(newPropertyService);
			const serviceIndex = newPropertyService.findIndex(
				(s) => s.id === id
			);
			if (serviceIndex !== -1) {
				set(newPropertyServiceCopy, `[${serviceIndex}].${key}`, value);
			}
			setNewPropertyService(newPropertyServiceCopy);
		},
		[newPropertyService]
	);

	const columns = useTableColumns({ serviceChangeHandler });

	const serviceData = useMemo(() => {
		if (currentStates.value === "active") {
			return propertyServices.filter((service) => service.active);
		}
		if (currentStates.value === "inactive") {
			return propertyServices.filter((service) => !service.active);
		}
		if (currentStates.value === "specific") {
			return propertyServices.filter((service) => !service.service_id);
		}
		return propertyServices;
	}, [propertyServices, currentStates]);

	console.log(serviceData);

	return (
		<div className="site_content">
			<div className="flex row j-sb">
				<SwitchButtons
					buttonStates={[...switch_buttons]}
					currentStates={currentStates}
					changeHandler={setCurrentStates}
				/>
			</div>
			<Divider />
			<Table columns={columns} data={serviceData || []} />
			<AddService
				propertyId={objectId}
				addService={addService}
				setAddService={setAddService}
			/>
		</div>
	);
};

export default PropertyServices;

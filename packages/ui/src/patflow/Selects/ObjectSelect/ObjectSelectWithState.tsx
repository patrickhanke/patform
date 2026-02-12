import { useMemo } from "react";
import { Select } from "@repo/ui";
import { useDataStore } from "@repo/provider";
import { Property, PropertySelect } from "@repo/types";

const ObjectSelectWithState = ({
	selectedObject,
	setSelectedObject,
	label,
	disabled = false
}: {
	selectedObject?: PropertySelect;
	setSelectedObject: (W: PropertySelect) => void;
	label?: string;
	disabled?: boolean;
}) => {
	const { properties } = useDataStore();

	const objectOptions = useMemo(() => {
		const objectOptionsArray: PropertySelect[] = [];
		if (properties) {
			properties.forEach((object: Property) => {
				if (object) {
					objectOptionsArray.push({
						value: object.objectId,
						id: object.objectId,
						label: object.name
					});
				}
			});
		}
		return objectOptionsArray;
	}, [properties]);

	return (
		<div>
			<Select
				label={label || ""}
				id="objects"
				value={selectedObject}
				options={objectOptions}
				onChange={(values) => setSelectedObject(values)}
				width={"100%"}
				isDisabled={disabled}
				menuPosition="absolute"
			/>
		</div>
	);
};

export default ObjectSelectWithState;

import { useFindData } from "@repo/provider";
import { ElementSelectInterface } from "@repo/ui";
import { Property } from "@repo/types";
import { FC, useMemo } from "react";
import { PropertyOptions, TaskSelectPropertyProps } from "../types";
import { isArray } from "lodash-es";

export const DisplayProperty = ({ title }: { title: string }) => (
	<div className={"property_container"}>
		<h3>{title}</h3>
	</div>
);

const TaskSelectPropery: FC<TaskSelectPropertyProps> = ({
	selectedProperty,
	setSelectedProperty
}) => {
	const { data: objectData } = useFindData({
		objectName: "Property",
		fields: ["objectId", "name"],
		filters: [
			{
				key: "archived",
				value: false,
				operator: "notEqualTo",
				id: "archived"
			}
		]
	});

	const elements = useMemo(() => {
		const objectOptionsArray: PropertyOptions[] = [];
		if (objectData && isArray(objectData)) {
			objectData.forEach((object: Property) => {
				if (object) {
					objectOptionsArray.push({
						value: object.objectId,
						id: object.objectId,
						label: object.name,
						element: <DisplayProperty title={object.name} />
					});
				}
			});
		}
		objectOptionsArray.sort((a, b) => a.label?.localeCompare(b.label));

		return objectOptionsArray;
	}, [objectData]);

	return (
		<ElementSelectInterface
			title="Objekt auswählen"
			elements={elements}
			isSearchable
			// min={1}
			max={1}
			selectedElements={elements.filter(
				(el) => el.value === selectedProperty
			)}
			onSelect={(values) => {
				console.log(values);
				if (values.length > 0) {
					setSelectedProperty(values[0]?.value as string);
				}
			}}
		/>
	);
};

export default TaskSelectPropery;

import { useDataStore } from "@repo/provider";
import { ElementSelectInterface } from "@repo/ui";
import { Property, Task } from "@repo/types";
import { FC, useMemo } from "react";
import { PropertyOptions, SelectPropertyProps } from "../types";

export const DisplayProperty = ({ title }: { title: string }) => (
	<div className={"property_container"}>
		<h3>{title}</h3>
	</div>
);

const SelectProperty: FC<SelectPropertyProps> = ({
	setTask,
	task,
	showPropertyOnly = false,
	isService = false
}) => {
	const { properties } = useDataStore();

	console.log(isService);

	const elements = useMemo(() => {
		const objectOptionsArray: PropertyOptions[] = [];
		if (properties) {
			properties.forEach((object: Property) => {
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
	}, [properties]);

	if (showPropertyOnly) {
		const property = elements.find((el) => el.value === task.property);
		if (!property) {
			return null;
		}
		return <DisplayProperty title={property?.label} />;
	}
	return (
		<ElementSelectInterface
			title="Objekt auswählen"
			elements={elements}
			isSearchable
			selectedElements={elements.filter((el) =>
				isService
					? task.properties?.includes(el.value)
					: el.value === task.property
			)}
			onSelect={(values) => {
				if (isService) {
					if (values.length > 0) {
						setTask((task: Task) => ({
							...task,
							properties: values.map((value) => value.value)
						}));
					} else if (values.length === 0 && task.property) {
						setTask((task: Task) => ({
							...task,
							properties: []
						}));
					}
				} else {
					if (values.length > 0) {
						setTask((task: Task) => ({
							...task,
							property: values[0]?.value
						}));
					} else if (values.length === 0 && task.property) {
						setTask((task: Task) => ({
							...task,
							property: undefined
						}));
					}
				}
			}}
			max={isService ? 200 : 1}
		/>
	);
};

export default SelectProperty;

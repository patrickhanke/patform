import { FC, useState } from "react";
import { ServicePropertiesColumnProps } from "../types";
import { ElementSelectInterface, IconButton, SlideIn } from "@repo/ui";
import { useDataStore } from "@repo/provider";
import { isArray } from "lodash-es";

const ServicePropertiesColumn: FC<ServicePropertiesColumnProps> = ({
	properties = [],
	onChange
}) => {
	const { properties: propertyData } = useDataStore();
	const [open, setOpen] = useState(false);
	const [selectedProperties, setSelectedProperties] = useState<string[]>(
		properties ?? []
	);
	const [loading, setLoading] = useState(false);

	return (
		<>
			<IconButton
				icon="property"
				onClick={() => {
					setOpen(true);
				}}
				text={`${properties?.length || 0} Objekte ausgewählt`}
			/>
			<SlideIn
				header="Objekte auswählen"
				isOpen={open}
				cancel={() => {
					setSelectedProperties(properties);
					setOpen(false);
				}}
				confirm={async () => {
					setLoading(true);
					await onChange(selectedProperties);
					setOpen(false);
					setLoading(false);
				}}
				loading={loading}
			>
				<ElementSelectInterface
					selectAll
					max={300}
					isSearchable
					elements={propertyData}
					selectedElements={propertyData.filter((property) =>
						selectedProperties?.includes(property.objectId)
					)}
					onSelect={(elements) => {
						console.log(elements);
						if (isArray(elements) && elements.length > 0) {
							setSelectedProperties(
								elements.map(
									(element) => element.value as string
								)
							);
						} else {
							setSelectedProperties([]);
						}
					}}
				/>
			</SlideIn>
		</>
	);
};

export default ServicePropertiesColumn;

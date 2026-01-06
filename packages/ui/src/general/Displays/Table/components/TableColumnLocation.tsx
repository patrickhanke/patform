import { TableColumnLocationProps } from "../types";
import {
	ElementSelectInterface,
	Button,
	SelectElement,
	SlideIn
} from "@repo/ui";
import { useContext, useMemo, useState } from "react";
import { PatstoreAppContext, generateGraphQLQuery } from "@repo/provider";
import { useQuery } from "@apollo/client";
import { LocationClass } from "@repo/types";

const TableColumnLocation = ({
	value,
	isEditable,
	onChange
}: TableColumnLocationProps) => {
	const { modules } = useContext(PatstoreAppContext);
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [selectedLocation, setSelectedLocation] = useState<
		string | undefined
	>(value);

	const { data: locationData } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Location",
			fields: ["objectId", "label", "title "]
		}),
		{
			variables: {
				params: {
					module: {
						_eq: modules.find(
							(module) => module.path === "/locations"
						)?.objectId
					}
				}
			}
		}
	);

	const elements = useMemo(() => {
		const locationOptionsArray: SelectElement[] = [];
		if (locationData) {
			locationData.objects.findLocation.results.forEach(
				(location: LocationClass) => {
					if (location) {
						locationOptionsArray.push({
							value: location.objectId,
							id: location.objectId,
							label: `${location.label}`
							// element: <LocationDisplay location={location} />
						});
					}
				}
			);
		}
		locationOptionsArray.sort((a, b) => a.label?.localeCompare(b.label));

		return locationOptionsArray;
	}, [locationData]);

	const currentLocation: SelectElement | undefined = useMemo(() => {
		if (selectedLocation) {
			return elements.find((element) => element.id === selectedLocation);
		}
		return elements.find((element) => element.id === value);
	}, [elements, value, selectedLocation]);

	const selectLocation = useMemo(
		() => (
			<ElementSelectInterface
				elements={elements}
				selectedElements={currentLocation ? [currentLocation] : []}
				onSelect={(selectValue) => {
					if (!selectValue || selectValue.length === 0) {
						setSelectedLocation("");
					} else if (selectValue.length > 0) {
						setSelectedLocation(
							(selectValue[0]?.id as string) || ""
						);
					}
				}}
				max={1}
				isSearchable
			/>
		),
		[elements, value, currentLocation]
	);

	if (!isEditable) {
		return (
			<div>
				{value ? (
					locationData?.objects.findLocation.results.find(
						(location: LocationClass) => location.objectId === value
					)?.label || "-"
				) : (
					<span>-</span>
				)}
			</div>
		);
	}

	return (
		<>
			<Button
				maxWidth={180}
				minWidth={180}
				onClick={() => {
					if (isEditable) {
						setIsOpen(true);
					}
				}}
				text={
					currentLocation
						? locationData?.objects.findLocation.results.find(
								(location: LocationClass) =>
									location.objectId === value
							)?.label || "-"
						: "+ Ort hinzufügen"
				}
			/>
			<SlideIn
				isOpen={isOpen}
				cancel={() => setIsOpen(false)}
				confirm={async () => {
					if (selectedLocation) {
						setLoading(true);
						if (onChange) {
							await onChange(selectedLocation);
						}
						setIsOpen(false);
						setLoading(false);
					}
				}}
				disabled={[loading, loading || !selectedLocation]}
				header="Ort auswählen"
			>
				{selectLocation}
			</SlideIn>
		</>
	);
};

export default TableColumnLocation;

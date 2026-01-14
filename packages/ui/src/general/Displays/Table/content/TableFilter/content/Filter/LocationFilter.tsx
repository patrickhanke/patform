"use client";

import { FC, useCallback, useContext, useMemo, useState } from "react";
import { LocationFilterProps } from "./types";
import { ElementSelectInterface, Modal, SelectElement } from "@repo/ui";
import { PatstoreAppContext, useFindData } from "@repo/provider";
import { LocationClass } from "@repo/types";
import "../../styles.scss";

const LocationFilter: FC<LocationFilterProps> = ({
	onValueChange,
	onOperatorChange
}) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { modules } = useContext(PatstoreAppContext);
	const [selectedLocation, setSelectedLocation] = useState<SelectElement[]>(
		[]
	);

	const locationModuleId = useMemo(
		() => modules?.find((module) => module.path === "/locations")?.objectId,
		[modules]
	);

	const { data: locationData } = useFindData({
		objectName: "Location",
		fields: ["objectId", "label", "title"],
		moduleId: locationModuleId
	});

	const locationElements = useMemo(() => {
		if (!locationData) return [];
		const locationElementsArray: SelectElement[] = [
			{
				label: "Kein Ort",
				value: null
			}
		];
		locationData.forEach((location: LocationClass) => {
			if (!location.label || !location.title) return;
			locationElementsArray.push({
				label: location.label,
				value: location.objectId
			});
		});
		return locationElementsArray;
	}, [locationData]);

	// const selectedLocation = useMemo(() => {
	// 	if (!filter.value || !locationElements.length) return [];

	// 	const found = locationElements.find(
	// 		(el: { value: string | null; label: string }) =>
	// 			el.value === filter.value
	// 	);
	// 	return found ? [found] : [];
	// }, [filter.value, locationElements]);

	const handleConfirm = useCallback(() => {
		if (selectedLocation.length > 0) {
			onOperatorChange("equalTo");
			onValueChange(selectedLocation[0]?.value || null);
		} else {
			onValueChange(null);
		}
		setIsModalOpen(false);
	}, [selectedLocation, onValueChange, onOperatorChange]);

	const handleCancel = () => {
		setSelectedLocation([]);
		setIsModalOpen(false);
	};

	return (
		<div className="filter-row-content">
			{/* <div className="select-wrapper">
				<Select
					id={`operator-${filter.id}`}
					value={filter.operator}
					onChange={(option) => {
						console.log({ option });
						onOperatorChange("_eq");
						if (option.value === "_eq") {
							onValueChange("");
						} else if (option.value === "_ne") {
							onValueChange(null);
						}
					}}
					options={operatorOptions}
					placeholder="Operator"
					width={160}
				/>
			</div> */}

			<>
				<button
					className="full_button sm light"
					onClick={() => setIsModalOpen(true)}
				>
					{selectedLocation.length > 0
						? selectedLocation[0]?.label || "Kein Ort ausgewählt"
						: "Ort auswählen"}
				</button>

				<Modal
					isOpen={isModalOpen}
					cancelButtonHandler={handleCancel}
					confirmButtonHandler={handleConfirm}
					header="Ort auswählen"
					confirmButtonText="Auswählen"
					cancelButtonText="Abbrechen"
				>
					<ElementSelectInterface
						elements={locationElements}
						selectedElements={selectedLocation}
						onSelect={(elements) => {
							setSelectedLocation(elements);
						}}
						max={1}
						isSearchable={true}
						setSelectedToTop={true}
					/>
				</Modal>
			</>
		</div>
	);
};

export default LocationFilter;

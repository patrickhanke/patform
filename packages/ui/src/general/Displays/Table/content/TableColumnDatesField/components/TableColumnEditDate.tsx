import { useCallback, useContext, useMemo } from "react";
import { Map, Select, StatelessToggle, SwitchButtons } from "@repo/ui";
import { EventDate, LocationClass } from "@repo/types";
import { TableColumnEditDateProps } from "../types";
import { set, cloneDeep } from "lodash-es";
import { useFindData } from "@repo/provider";
import { PatstoreAppContext } from "@repo/provider";
import locationButtonStates from "../constants/locationButtonStates";

const TableColumnEditDate = ({ date, setDates }: TableColumnEditDateProps) => {
	const { modules } = useContext(PatstoreAppContext);

	const locationModule = modules.find(
		(module) => module.path === "/locations"
	);

	const { data: locationData } = useFindData({
		objectName: "Location",
		fields: ["objectId", "label"],
		moduleId: locationModule?.objectId
	});

	console.log({ locationData });

	const locationOptions = useMemo(() => {
		if (!locationData) return [];

		return locationData?.map((location: LocationClass) => ({
			label: location.label,
			value: location.objectId
		}));
	}, [locationData]);

	const changeHandler = useCallback(
		(
			key: string,
			value:
				| EventDate[keyof EventDate]
				| EventDate["place"][keyof EventDate["place"]]
		) => {
			if (date) {
				setDates((draft: EventDate[]) => {
					const index: number = draft.findIndex(
						(dateToFind) => dateToFind.id === date.id
					);
					const dateCopy: typeof date = cloneDeep(date);
					set(dateCopy, key, value);

					if (index !== -1) {
						draft[index] = { ...dateCopy };
					}
				});
			}
		},
		[date, setDates]
	);

	if (!date) {
		return null;
	}

	return (
		<div>
			<h3>{date.label}</h3>
			<div>
				<label>Label</label>
				<input
					type="text"
					defaultValue={date.label}
					onChange={(e) => changeHandler("label", e.target.value)}
				/>
			</div>
			<div>
				<label>Startzeit</label>
				<input
					type="datetime-local"
					defaultValue={date.start}
					onChange={(e) => changeHandler("start", e.target.value)}
				/>
			</div>
			<div>
				<label>Endzeit</label>
				<input
					type="datetime-local"
					defaultValue={date.end}
					onChange={(e) => changeHandler("end", e.target.value)}
				/>
			</div>
			<div>
				<label>Ganztägig?</label>
				<StatelessToggle
					value={date.full_day}
					onChange={(value) => changeHandler("full_day", value)}
				/>
			</div>
			<div>
				<label>Ort</label>
				<SwitchButtons
					buttonStates={locationButtonStates({
						locationModule: !!locationModule
					})}
					currentStates={
						locationButtonStates({
							locationModule: !!locationModule
						}).find(
							(button) => button.value === date.place.type
						) as { label: string; value: string }
					}
					changeHandler={(value: {
						value: string;
						label: string;
						disabled?: boolean;
					}) => {
						console.log(value);
						changeHandler("place.type", value.value);
					}}
				/>
				<div className="table_columns_dates_location_container">
					{date.place.type === "address" && (
						<div>
							<label>Adresse</label>
							<input
								type="textarea"
								defaultValue={date.place.address}
								onChange={(e) =>
									changeHandler(
										"place.address",
										e.target.value
									)
								}
							/>
						</div>
					)}
					{date.place.type === "location" && (
						<div>
							<label>Ort auswählen</label>
							<Select
								width={300}
								options={locationOptions}
								value={locationOptions.find(
									(location: {
										value: string;
										label: string;
									}) => location.value === date.place.location
								)}
								onChange={(loc) =>
									changeHandler("place.location", loc.value)
								}
							/>
						</div>
					)}
					{date.place.type === "online" && (
						<div>
							<label>Link</label>
							<input
								type="text"
								defaultValue={date.place.online}
								onChange={(e) =>
									changeHandler(
										"place.online",
										e.target.value
									)
								}
							/>
						</div>
					)}
					{date.place.type === "map" && (
						<div>
							<label>Ort auswählen</label>
							<Map
								initialPlace={{
									lat: date?.place?.map?.lat || 0,
									lng: date?.place.map?.lng || 0
								}}
								onChange={(place) =>
									changeHandler("place.map", {
										lat: place.lat,
										lng: place.lng
									})
								}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default TableColumnEditDate;

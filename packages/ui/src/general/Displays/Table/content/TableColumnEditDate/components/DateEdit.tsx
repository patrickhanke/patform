import { FC, useCallback, useContext, useMemo } from "react";
import { Map, Select, StatelessToggle, SwitchButtons } from "@repo/ui";
import { EventDate, LocationClass } from "@repo/types";
import { DateEditProps } from "../types";
import { set, cloneDeep } from "lodash-es";
import { useQuery } from "@apollo/client";
import {
	PatstoreAppContext,
	generateGraphQLQuery,
	paramsHandler
} from "@repo/provider";
import locationButtonStates from "../constants/locationButtonStates";

const DateEdit: FC<DateEditProps> = ({ date, setDate }) => {
	const { modules } = useContext(PatstoreAppContext);
	const { data: locationData } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Location",
			fields: ["objectId", "label"]
		}),
		{
			variables: paramsHandler({
				filters: [
					{
						key: "module",
						value: modules.find(
							(module) => module.path === "/location"
						)?.objectId as string,
						operator: "_eq",
						id: "moduleId"
					}
				]
			})
		}
	);

	const locationOptions = useMemo(() => {
		if (!locationData) return [];

		return locationData?.objects.findLocation.results.map(
			(location: LocationClass) => ({
				label: location.label,
				value: location.objectId
			})
		);
	}, [locationData]);

	const changeHandler = useCallback(
		(
			key: string,
			value:
				| EventDate[keyof EventDate]
				| EventDate["place"][keyof EventDate["place"]]
		) => {
			console.log(key, value);
			if (date) {
				const dateCopy: typeof date = cloneDeep(date);
				set(dateCopy, key, value);
				console.log(dateCopy);

				setDate(dateCopy);
			}
		},
		[date]
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
			<p>DateEdit</p>
			<div>
				<label>Text</label>
				<input
					type="textarea"
					defaultValue={date.text}
					value={date.text}
					onChange={(e) => changeHandler("text", e.target.value)}
				/>
			</div>
			<div>
				<label>Ort</label>
				<SwitchButtons
					buttonStates={[...locationButtonStates]}
					currentStates={
						locationButtonStates.find(
							(button) => button.value === date.place.type
						) as { label: string; value: string }
					}
					changeHandler={(
						value: (typeof locationButtonStates)[number]
					) => changeHandler("place.type", value.value)}
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
									lat: date.place.map?.latitude || 0,
									lng: date.place.map?.longitude || 0
								}}
								onChange={(place) =>
									changeHandler("place.map", {
										latitude: place.lat,
										longitude: place.lng
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

export default DateEdit;

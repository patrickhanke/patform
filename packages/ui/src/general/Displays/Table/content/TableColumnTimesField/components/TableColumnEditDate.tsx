import { useCallback, useContext, useMemo } from "react";
import { Map, Select, SwitchButtons, SwitchButton } from "@repo/ui";
import { EventTime, LocationClass } from "@repo/types";
import locationButtonStates from "../constants/locationButtonStates";
import { set, cloneDeep } from "lodash-es";
import { useQuery } from "@apollo/client";
import {
	PatstoreAppContext,
	generateGraphQLQuery,
	getWeekdayLabel,
	paramsHandler,
	weekdays
} from "@repo/provider";
import { TableColumnEditTimeProps } from "../types";
import { useDebounceCallback } from "usehooks-ts";

const TableColumnEditTime = ({ time, setTimes }: TableColumnEditTimeProps) => {
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
				| EventTime[keyof EventTime]
				| EventTime["place"][keyof EventTime["place"]]
		) => {
			if (time) {
				setTimes((draft: EventTime[]) => {
					const index: number = draft.findIndex(
						(dateToFind) => dateToFind.id === time.id
					);
					const dateCopy: typeof time = cloneDeep(time);
					set(dateCopy, key, value);

					if (index !== -1) {
						draft[index] = { ...dateCopy };
					}
				});
			}
		},
		[time, setTimes]
	);

	const inputChangeHandler = useDebounceCallback(changeHandler, 1000);

	if (!time) {
		return null;
	}

	return (
		<div>
			<h3>{getWeekdayLabel(time.weekday)}</h3>
			<div>
				<label>Wochentag</label>
				<Select
					value={time.weekday}
					options={weekdays}
					onChange={(selectValue) =>
						changeHandler("weekday", selectValue.value)
					}
				/>
			</div>
			<div>
				<label>Startzeit</label>
				<input
					key={time.start}
					type="time"
					defaultValue={time.start}
					onChange={(e) =>
						inputChangeHandler("start", e.target.value)
					}
				/>
			</div>
			<div>
				<label>Endzeit</label>
				<input
					key={time.end}
					type="time"
					defaultValue={time.end}
					onChange={(e) => inputChangeHandler("end", e.target.value)}
				/>
			</div>
			<div>
				<label>Text</label>
				<input
					type="textarea"
					defaultValue={time.text}
					value={time.text}
					onChange={(e) => changeHandler("text", e.target.value)}
				/>
			</div>
			<div>
				<label>Ort</label>
				<SwitchButtons
					buttonStates={locationButtonStates}
					currentStates={
						locationButtonStates.find(
							(button) => button.value === time.place.type
						) as { label: string; value: string }
					}
					changeHandler={(value: SwitchButton) =>
						changeHandler("place.type", value.value as string)
					}
				/>
				<div className="table_columns_dates_location_container">
					{time.place.type === "address" && (
						<div>
							<label>Adresse</label>
							<input
								type="textarea"
								defaultValue={time.place.address}
								onChange={(e) =>
									changeHandler(
										"place.address",
										e.target.value
									)
								}
							/>
						</div>
					)}
					{time.place.type === "location" && (
						<div>
							<label>Ort auswählen</label>
							<Select
								width={300}
								options={locationOptions}
								value={locationOptions.find(
									(location: {
										value: string;
										label: string;
									}) => location.value === time.place.location
								)}
								onChange={(loc) =>
									changeHandler("place.location", loc.value)
								}
							/>
						</div>
					)}
					{time.place.type === "online" && (
						<div>
							<label>Link</label>
							<input
								key={time.place.online}
								type="text"
								defaultValue={time.place.online}
								onChange={(e) =>
									changeHandler(
										"place.online",
										e.target.value
									)
								}
							/>
						</div>
					)}
					{time.place.type === "map" && (
						<div>
							<label>Ort auswählen</label>
							<Map
								initialPlace={{
									lat: time.place.map?.latitude || 0,
									lng: time.place.map?.longitude || 0
								}}
								onChange={(place) =>
									changeHandler("place.map", place)
								}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default TableColumnEditTime;

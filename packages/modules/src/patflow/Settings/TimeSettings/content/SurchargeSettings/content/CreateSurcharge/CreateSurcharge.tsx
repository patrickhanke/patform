import { DatePicker, StateDisplay } from "@repo/ui";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CreateSurchargeProps } from "./types";
import { ErrorMessage, Surcharge } from "@repo/types";
import default_surcharge from "./constants/default_surcharge";
import surcharge_types from "./constants/surcharge_types";
import { cloneDeep, set } from "lodash-es";
import SurchargeTimeEdit from "./components/SurchargeTimeEdit";
import "./CreateSurcharge.scss";
import SurchargeDaySelect from "./components/SurchargeDaySelect";
import SurchargeDayEdit from "./components/SurchargeDayEdit";
import SurchargeOvertimeEdit from "./components/SurchargeOvertimeEdit";
import { formatISO9075 } from "date-fns";
import { InfoBox, SlideIn, SwitchButtons } from "@repo/ui";
import colors from "../../../../../../../../../ui/src/general/Inputs/ColorSelect/constants/colors";
import SurchargeSelectColor from "./components/SurchargeSelectColor";

const CreateSurcharge: React.FC<CreateSurchargeProps> = ({
	surcharge = null,
	createSurcharge,
	setCreateSurcharge,
	setEditSurcharge,
	updateSurchargeHandler,
	holidays
}) => {
	const [newSurcharge, setNewSurcharge] = useState<Surcharge>(
		surcharge?.objectId ? surcharge : default_surcharge()
	);
	const [errors, setErrors] = useState<ErrorMessage[]>([]);
	const [loading, setLoading] = useState(false);
	const [selectColor, setSelectColor] = useState<boolean>(false);
	const surchargeChangeHandler = useCallback(
		(path: string, value: Surcharge[keyof Surcharge]) => {
			const newSurchargeCopy: Surcharge = cloneDeep(newSurcharge);
			set(newSurchargeCopy, path, value);
			setNewSurcharge(newSurchargeCopy);
		},
		[newSurcharge, surcharge]
	);

	useEffect(() => {
		if (surcharge) {
			setNewSurcharge(surcharge);
		} else {
			setNewSurcharge(default_surcharge());
		}
	}, [surcharge]);

	useEffect(() => {
		const errorArray: ErrorMessage[] = [];
		if (!newSurcharge.name) {
			errorArray.push({
				message: "Bitte einen Namen angeben",
				key: "name",
				id: "name"
			});
		}
		if (newSurcharge.type === "time") {
			if (!newSurcharge.time_value?.start) {
				errorArray.push({
					message: "Bitte eine Startzeit angeben",
					key: "start",
					id: "start"
				});
			}
			if (!newSurcharge.time_value?.end) {
				errorArray.push({
					message: "Bitte eine Endzeit angeben",
					key: "end",
					id: "end"
				});
			}
			const newDate = new Date();
			const startDate = newDate.setHours(
				Number(newSurcharge.time_value?.start.split(":")[0]),
				Number(newSurcharge.time_value?.start.split(":")[1])
			);
			const endDate = newDate.setHours(
				Number(newSurcharge.time_value?.end.split(":")[0]),
				Number(newSurcharge.time_value?.end.split(":")[1])
			);

			if (
				newSurcharge.time_value?.start &&
				newSurcharge.time_value?.end &&
				(startDate > endDate || startDate === endDate)
			) {
				errorArray.push({
					message: "Die Startzeit muss vor der Endzeit liegen",
					key: "start",
					id: "start"
				});
			}
		}
		if (
			newSurcharge.type === "day" &&
			newSurcharge.day_value.length === 0
		) {
			errorArray.push({
				message: "Bitte mindestens einen Tag auswählen",
				key: "day",
				id: "day"
			});
		}
		if (newSurcharge.value === 0 || !newSurcharge.value) {
			errorArray.push({
				message: "Bitte einen Wert angeben",
				key: "value",
				id: "value"
			});
		}
		setErrors(errorArray);
	}, [newSurcharge]);

	const selectDays = useMemo(() => {
		if (newSurcharge.type === "day") {
			return (
				<SurchargeDaySelect
					holidays={holidays}
					newSurcharge={newSurcharge}
					surchargeChangeHandler={surchargeChangeHandler}
				/>
			);
		}
		return null;
	}, [newSurcharge, holidays]);

	console.log({ newSurcharge });

	return (
		<>
			<SlideIn
				isOpen={createSurcharge || surcharge !== null}
				cancel={() => {
					if (createSurcharge) {
						setCreateSurcharge(false);
					}
					if (surcharge) {
						setEditSurcharge(null);
					}
				}}
				confirm={async () => {
					setLoading(true);
					await updateSurchargeHandler(newSurcharge);
					setLoading(false);
					if (createSurcharge) {
						setCreateSurcharge(false);
					}
					if (surcharge) {
						setEditSurcharge(null);
					}
				}}
				header={
					surcharge
						? "Zuschlag bearbeiten"
						: "Neuen Zuschlag erstellen"
				}
				secondaryContent={selectDays}
				showSecondaryContent={true}
				errors={errors}
				disabled={[loading, errors.length > 0 || loading]}
				preventClickOutside
			>
				<div className="create_surcharge_container">
					{surcharge && (
						<InfoBox text="Alle Änderungen hier werden rückwirkend auf die bestehenden Abrechnungen angwendet. Wenn sich dieser Zuschlag bspw. durch eine Veränderung am Arbeitsvertrag verändert hat, dann archivieren Sie diesen Zuschlage und erstellen einen Neuen zum Grültigkeitsdatum der neuen Rahmenbedingungen." />
					)}
					<div className="surcharge_container">
						<label>Name</label>
						<input
							style={{ width: "240px" }}
							type="text"
							defaultValue={newSurcharge.name}
							onChange={(e) =>
								surchargeChangeHandler("name", e.target.value)
							}
						/>
					</div>
					<div className="surcharge_container">
						<label>Kurzform</label>
						<input
							style={{ width: "240px" }}
							type="text"
							defaultValue={newSurcharge.short}
							onChange={(e) =>
								surchargeChangeHandler("short", e.target.value)
							}
						/>
					</div>
					<div className="surcharge_container">
						<label>Beschreibung</label>
						<textarea
							style={{ width: "240px" }}
							defaultValue={newSurcharge.description}
							onChange={(e) =>
								surchargeChangeHandler(
									"description",
									e.target.value
								)
							}
						/>
					</div>
					<div className="surcharge_container">
						<label>Farbe</label>
						<div className="horizontal_container">
							<button
								className="full_button sm"
								onClick={() => setSelectColor(true)}
							>
								Farbe wählen
							</button>
							{colors.find(
								(color) => color.value === newSurcharge.color
							) && (
								<StateDisplay
									color={newSurcharge.color}
									label={
										colors.find(
											(color) =>
												color.value ===
												newSurcharge.color
										)?.label as string
									}
								/>
							)}
						</div>
					</div>
					<div className="surcharge_container">
						{/* <label>Start</label> */}
						<DatePicker
							label="Start"
							id="start"
							type="date"
							defaultValue={formatISO9075(
								new Date(newSurcharge.start_date || new Date()),
								{ representation: "date" }
							)}
							onChange={(date) =>
								surchargeChangeHandler("start_date", date)
							}
						/>
					</div>
					<div className="horizontal_container">
						<label>Typ</label>
						<SwitchButtons
							key={JSON.stringify(newSurcharge)} // Use JSON.stringify to create a unique key based on the newSurcharge object
							buttonStates={surcharge_types}
							currentStates={
								surcharge_types.find(
									(type) => type.value === newSurcharge.type
								) as (typeof surcharge_types)[0]
							}
							changeHandler={(
								value: (typeof surcharge_types)[number]
							) => surchargeChangeHandler("type", value.value)}
						/>
					</div>
					{newSurcharge.type === "time" && (
						<SurchargeTimeEdit
							key={JSON.stringify(newSurcharge)} // Use JSON.stringify to create a unique key based on the newSurcharge object
							surchargeChangeHandler={surchargeChangeHandler}
							newSurcharge={newSurcharge}
						/>
					)}
					{newSurcharge.type === "day" && (
						<SurchargeDayEdit
							key={JSON.stringify(newSurcharge)} // Use JSON.stringify to create a unique key based on the newSurcharge object
							newSurcharge={newSurcharge}
							holidays={holidays}
							surchargeChangeHandler={surchargeChangeHandler}
						/>
					)}
					{newSurcharge.type === "overtime" && (
						<SurchargeOvertimeEdit
							newSurcharge={newSurcharge}
							surchargeChangeHandler={surchargeChangeHandler}
						/>
					)}
				</div>
			</SlideIn>
			<SurchargeSelectColor
				selectColor={selectColor}
				setSelectColor={setSelectColor}
				initialColor={newSurcharge.color}
				surchargeChangeHandler={surchargeChangeHandler}
			/>
		</>
	);
};

export default CreateSurcharge;

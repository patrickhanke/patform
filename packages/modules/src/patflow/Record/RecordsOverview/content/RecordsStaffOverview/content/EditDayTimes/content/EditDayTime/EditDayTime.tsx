import { millisecondsToMinutes } from "date-fns";
import { FC, useCallback } from "react";
import { EditTimeProps, WorkingTime } from "./types";
import { useDebounceCallback } from "usehooks-ts";
import { cloneDeep, set } from "lodash-es";
import "./styles.scss";
import { v4 as generateUuid } from "uuid";
import { IconButton } from "@repo/ui";
import { WorkDay } from "@repo/types";

const EditDayTime: FC<EditTimeProps> = ({
	time,
	timeChangeHandler,
	date,
	errors
}) => {
	const updateHandler = useCallback(
		(key: string, value: string) => {
			const timeCopy: WorkingTime = cloneDeep(time);
			if (!time) {
				return;
			}
			set(timeCopy, key, value);

			timeChangeHandler(timeCopy);
		},
		[time]
	);

	const debounced = useDebounceCallback(updateHandler, 600);

	const addPause = useCallback(() => {
		if (time) {
			const breakArray = time.breaks || [];
			const pauseId = generateUuid();
			breakArray.push({
				start: time.start,
				end: time.end,
				id: pauseId
			});
			timeChangeHandler({
				...time,
				breaks: breakArray
			});
		}
	}, [time]);

	return (
		<div>
			<form className="edit_day_edit_time_form" action="">
				<div>
					<h3>Start- und Endzeit angeben</h3>
				</div>
				<div className="vertical_container gap-sm">
					<div className="horizontal_container">
						<label htmlFor={"start"}>Start</label>
						<input
							aria-label="Time"
							id={"start"}
							name={"start"}
							type="datetime-local"
							// onChange={(e) => timeChangeHandler(dayKey as string, {...time, start: e.target.value as D})}
							onChange={(e) => {
								if (e.target.value) {
									debounced("start", e.target.value);
								}
							}}
							defaultValue={time?.start || ""}
							step={undefined}
							disabled={!date}
						/>
					</div>
					<div className="horizontal_container">
						<label htmlFor={"end"}>Ende</label>
						<input
							aria-label="Time"
							id={"end"}
							name={"end"}
							type="datetime-local"
							onChange={(e) => {
								if (e.target.value) {
									debounced("end", e.target.value);
								}
							}}
							defaultValue={time?.end || ""}
							step={undefined}
							disabled={!date}
						/>
					</div>
				</div>
				<div>
					<div className="horizontal_container">
						<h3>Pausen angeben</h3>
						<IconButton
							color="light"
							size={12}
							key="add_pause"
							onClick={() => addPause()}
							icon="plus"
							text="Pause hinzufügen"
						/>
					</div>
					<div className="vertical_container gap-md">
						{time?.breaks &&
							time?.breaks.map(
								(
									breakTime: WorkDay["time"]["breaks"][number],
									index: number
								) => {
									return (
										<div
											key={breakTime.id}
											className="vertical_container light_box gap-sm"
										>
											<div className="horizontal_container">
												<label
													htmlFor={`break-start-${index}`}
												>
													Start
												</label>
												<input
													data-error={errors.find(
														(error) =>
															error.id ===
															breakTime.id
													)}
													aria-label="Time"
													id={`break-start-${index}`}
													name="break-start"
													type="datetime-local"
													onChange={(e) =>
														debounced(
															`breaks.${index}.start`,
															e.target.value
														)
													}
													defaultValue={
														breakTime.start || ""
													}
													step={undefined}
													disabled={!date}
												/>
											</div>
											<div className="horizontal_container">
												<label
													htmlFor={`break-end-${index}`}
												>
													Ende
												</label>
												<input
													data-error={errors.find(
														(error) =>
															error.id ===
															breakTime.id
													)}
													aria-label="Time"
													id={`break-end-${index}`}
													name="break-end"
													type="datetime-local"
													onChange={(e) =>
														debounced(
															`breaks.${index}.end`,
															e.target.value
														)
													}
													defaultValue={
														breakTime.end || ""
													}
													step={undefined}
													disabled={!date}
												/>
											</div>
											<button
												className="full_button red sm"
												onClick={() => {
													const timeCopy =
														cloneDeep(time);
													timeCopy.breaks.splice(
														index,
														1
													);
													timeChangeHandler(timeCopy);
												}}
											>
												Pause löschen
											</button>
										</div>
									);
								}
							)}
					</div>
					<div className="horizontal_container">
						<label htmlFor={"pause"}>Pausenzeit:</label>
						<p>
							<span style={{ fontWeight: "bold" }}>
								{millisecondsToMinutes(time?.pause || 0)}
							</span>{" "}
							Minuten
						</p>
					</div>
				</div>
				<div>
					<label htmlFor="comments">Kommentar</label>
					<textarea
						style={{ width: "100%" }}
						id={"comment"}
						name={"comment"}
						onChange={(e) => debounced("comment", e.target.value)}
						defaultValue={time?.comment}
						disabled={!date}
					/>
				</div>
			</form>
		</div>
	);
};

export default EditDayTime;

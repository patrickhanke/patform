"use client";

import { FC, useMemo, useState } from "react";
import { EditDayTimesProps } from "./types";
import {
	absence_type_options,
	dayHasFullDayAbsence,
	getDefaultTime
} from "@repo/provider";
import { IconButton, StateDisplay } from "@repo/ui";
import { getDateString } from "@repo/provider";
import { EditDayAbsence } from "./content";
import { isArray } from "lodash-es";

const EditDayTimes: FC<EditDayTimesProps> = ({
	type,
	date,
	dayId,
	initialTime,
	times,
	days,
	refetch,
	userId,
	records,
	absenceId,
	color,
	label,
	isWorkingDay,
	hasRecordForDate,
	onOpenWorkEditor
}) => {
	const [editAbsence, setEditAbsence] = useState(false);

	const openWorkEditor = (
		editorInitialTime?: EditDayTimesProps["initialTime"]
	) => {
		onOpenWorkEditor({
			key: `${date}-${dayId ?? "new"}-${editorInitialTime?.start ?? "default"}`,
			date,
			dayId,
			initialTime: editorInitialTime,
			times,
			refetch,
			records
		});
	};

	const timeType = useMemo(() => {
		const absenceType = absence_type_options.find(
			(option) => option.value === initialTime?.type
		);

		if (absenceType) {
			return absenceType;
		}

		return {
			value: initialTime?.type,
			label: ` A - ${getDateString(initialTime?.start).time} -
						${getDateString(initialTime?.end).time}`,
			color: "green"
		};
	}, [initialTime]);

	const stateLabel = useMemo(() => {
		if (initialTime) {
			return `${getDateString(initialTime.start).time} -
						${getDateString(initialTime.end).time}`;
		}
		return null;
	}, [initialTime]);

	const addButtonDisabled = useMemo(() => {
		if (dayHasFullDayAbsence(date, days)) {
			return true;
		}

		if (!isArray(times) || times.length === 0) {
			return false;
		}

		return times.some((timeElement) => {
			if (timeElement.type === "absence") {
				if (
					timeElement.absence?.type === "vacation" ||
					timeElement.absence?.type === "compensation_times"
				) {
					return true;
				}
			}

			const time = timeElement?.time;
			if (!time || !("state" in time)) {
				return false;
			}

			return (
				time.type === "vacation" ||
				time.type === "compensation_times" ||
				(time.type === "illness" && time.state === "full") ||
				time.state === "full"
			);
		});
	}, [times, days, date]);

	return (
		<>
			<div className="horizontal_container j-fe">
				{type === "edit" ? (
					<StateDisplay
						onClick={() => {
							if (absenceId) {
								setEditAbsence(true);
							} else {
								openWorkEditor(initialTime);
							}
						}}
						label={label || stateLabel || ""}
						color={color || timeType.color}
					/>
				) : (
					<>
						<IconButton
							icon="plus"
							onClick={() => {
								setEditAbsence(true);
							}}
							text="Abwesenheit"
							color="dark"
							disabled={
								addButtonDisabled ||
								!isWorkingDay ||
								!hasRecordForDate
							}
						/>
						<IconButton
							icon="plus"
							onClick={() => {
								openWorkEditor(
									initialTime ?? getDefaultTime(date).time
								);
							}}
							text="Arbeitszeit"
							disabled={addButtonDisabled || !hasRecordForDate}
							color="dark"
						/>
					</>
				)}
			</div>
			<EditDayAbsence
				date={date}
				dayId={dayId}
				type={absenceId ? "edit" : "create"}
				times={times}
				days={days}
				absenceId={absenceId}
				records={records}
				workerId={userId}
				isOpen={editAbsence}
				setIsOpen={setEditAbsence}
				refetch={refetch}
			/>
		</>
	);
};

export default EditDayTimes;

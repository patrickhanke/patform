import { FC, useCallback } from "react";
import { Divider, SwitchButtons } from "@repo/ui";
import absence_type_options from "./constants/absence_type_options";
import AddEditVacation from "./components/AddEditVacation";
import AddEditCompensationTimes from "./components/AddEditCompensationTimes";
import AddEditDaySick from "./components/AddEditDaySick";
import AddEditPayedAbsence from "./components/AddEditPayedAbsence";
import { EditDayAbsenceProps } from "./types";
import { AbsenceTime } from "@repo/types";
import { findDefaultTimeForDate } from "@repo/provider";

const EditDayAbsence: FC<EditDayAbsenceProps> = ({
	date,
	time,
	setTime,
	records
}) => {
	console.log({ time });
	const absenceTypeChangeHandler = useCallback(
		(newAbsenceType: (typeof absence_type_options)[number]) => {
			setTime({
				...time,
				type: newAbsenceType.value
			});
		},
		[time]
	);

	const absenceChangeHandler = useCallback(
		(newAbsence: AbsenceTime) => {
			setTime({
				...time,
				...newAbsence
			});
		},
		[time]
	);

	const defaultTime = findDefaultTimeForDate(date, records);

	return (
		<div>
			<div>
				<SwitchButtons
					buttonStates={[...absence_type_options]}
					currentStates={
						absence_type_options.find(
							(option) => option.value === time.type
						) || absence_type_options[0]
					}
					changeHandler={absenceTypeChangeHandler}
				/>
			</div>
			<Divider size="small" showLine={false} />
			<h3>
				{absence_type_options.find(
					(option) => option.value === time.type
				)?.title || absence_type_options[0].title}
			</h3>
			{time.type === "vacation" && (
				<AddEditVacation date={date} records={records} />
			)}
			{time.type === "compensation_times" && (
				<AddEditCompensationTimes
					date={date}
					time={time}
					timeChangeHandler={absenceChangeHandler}
					defaultTime={defaultTime?.default_time}
				/>
			)}
			{time.type === "illness" && (
				<AddEditDaySick
					date={date}
					time={time}
					timeChangeHandler={absenceChangeHandler}
				/>
			)}
			{time.type === "payed_absence" && (
				<AddEditPayedAbsence
					date={date}
					time={time}
					timeChangeHandler={absenceChangeHandler}
				/>
			)}
		</div>
	);
};

export default EditDayAbsence;

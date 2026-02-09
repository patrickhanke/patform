import { StaffMember } from "@repo/types";
import { DatePicker, DisplayWorker, Select, TextInput } from "@repo/ui";
import { FC, useMemo } from "react";
import { EditAbsenceProps } from "../types";
import { absence_type_options, absence_state_options } from "@repo/provider";

const EditAbsence: FC<EditAbsenceProps> = ({
	type,
	staffData,
	user,
	absenceState,
	setAbsenceState,
	record
}) => {
	const selectOptions = useMemo(() => {
		let staffOptions = [] as { value: string; label: string }[];

		if (staffData) {
			staffOptions = staffData.map((staff: StaffMember) => ({
				value: staff.objectId,
				label: `${staff.first_name} ${staff.last_name}`,
				...staff
			}));
		}
		return { staffOptions };
	}, [staffData]);

	return (
		<div className="flex col gap-sm">
			<form>
				{type === "create" && staffData && (
					<Select
						label="Mitarbeiter auswählen"
						width="300px"
						options={selectOptions.staffOptions}
						value={
							type === "create"
								? absenceState.user
								: {
										...absenceState.user,
										value: user?.objectId,
										label: `${user?.first_name} ${user?.last_name}`
									}
						}
						onChange={(value) => {
							setAbsenceState({
								...absenceState,
								user: value
							});
						}}
						placeholder="Mitarbeiter..."
					/>
				)}
				{type === "edit" && absenceState.user && (
					<DisplayWorker workerId={absenceState.user.objectId} />
				)}

				<div>
					<DatePicker
						id="dstart"
						defaultValue={absenceState.start_date}
						onChange={(value) => {
							setAbsenceState({
								...absenceState,
								start_date: value
							});
						}}
						disabled={!record || type === "edit"}
						type="date"
						label="Anfangsdatum"
						width={300}
						onlyDate
					/>
				</div>
				<div>
					<DatePicker
						id="end"
						defaultValue={absenceState.end_date}
						onChange={(value) =>
							setAbsenceState({
								...absenceState,
								end_date: value
							})
						}
						disabled={
							!record ||
							type === "edit" ||
							!absenceState.start_date
						}
						type="date"
						label="Enddatum"
						width={300}
						onlyDate
					/>
				</div>
				<div>
					<Select
						value={absenceState.type}
						options={absence_type_options}
						onChange={(value) =>
							setAbsenceState({
								...absenceState,
								type: value.value
							})
						}
						placeholder="Art der Abwesenheit"
						label="Art der Abwesenheit"
						width={300}
						isDisabled={!record || type === "edit"}
					/>
				</div>
				<div style={{ position: "relative" }}>
					<Select
						value={absenceState.state}
						options={absence_state_options}
						onChange={(value) =>
							setAbsenceState({
								...absenceState,
								state: value.value
							})
						}
						placeholder="Status"
						label="Status"
						width={300}
						isDisabled={
							!absenceState.end_date ||
							!absenceState.start_date ||
							absenceState.state === "approved"
						}
					/>
					{/* {type === 'edit' && absence.state === 'approved' && <InfoBox text='Eine bereits bestätigte Abwesenheit kann nicht bestätigt werden. Bitte die Abwesenheit löschen und eine neue erstellen.' /> } */}
				</div>
				<div>
					<TextInput
						id="comment"
						defaultValue={absenceState.comment}
						onChange={(value) =>
							setAbsenceState({
								...absenceState,
								comment: value
							})
						}
						label="Kommentar"
						placeholder="Kommentar"
						isTextArea
						width={"300px"}
					/>
				</div>
			</form>
		</div>
	);
};

export default EditAbsence;

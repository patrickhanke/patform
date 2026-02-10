import React, { useContext, useEffect, useMemo } from "react";
import { RecordsStaffOverviwProps } from "./types";
import SiteHeaderContent from "./components/SiteHeaderContent";
import {
	useFindData,
	useFindDataSecure,
	months,
	UserContext
} from "@repo/provider";
import { Divider } from "@repo/ui";
import StaffRecord from "./content/StaffRecord";
import { TimesSaldo } from "./content/TimesSaldo";
import { Record } from "@repo/types";
import { StaffSurcharges } from "./content/StaffSurcharges";
import { StaffVacation } from "./content/StaffVacation";
import { StaffWorkingTimes } from "./content/StaffWorkingTimes";
import { PrintWorkerTimes } from "./content";
import { cloneDeep } from "lodash-es";

const RecordsStaffOverview = ({
	year,
	selectedUser,
	setSelectedUser,
	printWorkerTimes,
	setPrintWorkerTimes
}: RecordsStaffOverviwProps) => {
	const { projectId } = useContext(UserContext);

	const [selectedMonth, setSelectedMonth] = React.useState<
		(typeof months)[number]
	>(
		months.find(
			(month) => month.id === new Date().getMonth()
		) as (typeof months)[number]
	);

	const { data: days, refetch } = useFindData({
		objectName: "Day",
		fields: [
			"objectId",
			"date",
			"time",
			"user {objectId}",
			"year",
			"surcharges",
			"type",
			"absence { objectId  type }"
		],
		filters: [{ key: "year", value: year, operator: "equalTo" }],
		userId: selectedUser?.value,
		skipQuery: !year || !selectedUser?.value
	});

	useEffect(() => {
		if (selectedUser?.value && year) {
			refetch();
		}
	}, [selectedUser, year]);

	const { data: recordData } = useFindData({
		objectName: "Record",
		fields: [
			"objectId",
			"year",
			"user {objectId}",
			"default_times",
			"createdAt",
			"start_date",
			"end_date",
			"time_settings",
			"holiday_template { objectId name holidays { ... on Element { value } } }"
		],
		filters: [{ key: "year", value: year, operator: "equalTo" }],
		skipQuery: !year
	});

	const { data: staffData } = useFindDataSecure({
		objectName: "User",
		fields: [
			"objectId",
			"first_name",
			"last_name",
			"is_worker",
			"portrait",
			"color",
			"time_settings",
			"number",
			"data",
			"role { objectId name type color }"
		],
		filters: [{ key: "is_worker", value: true, operator: "equalTo" }],
		order: "last_name_DESC",
		useMasterKey: true
	});

	const currentRecords = useMemo(() => {
		const rec: Record[] = [];

		if (!recordData || !selectedUser) return rec;
		recordData.forEach((record: Record) => {
			if (record.user.objectId === selectedUser.value) {
				const holidayTemplate = cloneDeep(record.holiday_template) as {
					value: string[];
				};

				const holidayArray: string[] = holidayTemplate.holidays.map(
					(holiday: { value: string }) => holiday.value as string
				);

				rec.push({
					...record,
					holiday_template: {
						...holidayTemplate,
						holidays: holidayArray
					}
				});
			}
		});
		return rec;
	}, [recordData, selectedUser, setSelectedMonth]);

	const siteHeaderContent = useMemo(
		() => (
			<SiteHeaderContent
				setSelectedMonth={setSelectedMonth}
				selectedMonth={selectedMonth}
				setSelectedUser={setSelectedUser}
				selectedUser={selectedUser}
				staff={staffData || []}
			/>
		),
		[selectedMonth, selectedUser, staffData]
	);

	return (
		<div>
			<StaffRecord days={days} year={year} staff={staffData || []} />
			<div className="button_container">{siteHeaderContent}</div>
			<Divider size="small" showLine={false} />
			{selectedUser ? (
				<>
					<StaffWorkingTimes
						days={days}
						year={year}
						month={selectedMonth}
						refetch={refetch}
						selectedUser={selectedUser}
						records={currentRecords}
					/>
					<Divider size="large" showLine={false} />
					<TimesSaldo
						days={days}
						year={year}
						month={selectedMonth}
						selectedUser={selectedUser}
						records={currentRecords}
					/>
					<Divider size="large" showLine={false} />
					<StaffSurcharges
						days={days}
						year={year}
						month={selectedMonth}
						projectId={projectId}
					/>
					<Divider size="large" showLine={false} />
					<StaffVacation
						days={days}
						year={year}
						month={selectedMonth}
						records={currentRecords}
					/>
					<Divider size="large" showLine={false} />
				</>
			) : (
				<div>
					<p>Bitte wählen Sie einen Mitarbeiter aus</p>
				</div>
			)}
			<PrintWorkerTimes
				printWorkerTimes={printWorkerTimes}
				setPrintWorkerTimes={setPrintWorkerTimes}
			/>
		</div>
	);
};

export default RecordsStaffOverview;

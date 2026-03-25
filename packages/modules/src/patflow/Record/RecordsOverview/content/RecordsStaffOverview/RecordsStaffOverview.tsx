import React, { useContext, useEffect, useMemo } from "react";
import { RecordsStaffOverviwProps } from "./types";
import SiteHeaderContent from "./components/SiteHeaderContent";
import { months, UserContext, useFindDays, useDataStore } from "@repo/provider";
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

	const { data: days, refetch } = useFindDays({
		userId: selectedUser?.value as string,
		year: year,
		skipQuery: !year || !selectedUser?.value
	});

	useEffect(() => {
		if (selectedUser?.value && year) {
			refetch();
		}
	}, [selectedUser, year]);

	const { records: recordData } = useDataStore();

	const { workers } = useDataStore();

	const currentRecords = useMemo(() => {
		const rec: Record[] = [];

		if (!recordData || !selectedUser) return rec;

		recordData.forEach((record: Record) => {
			if (
				record.user.objectId === selectedUser.value &&
				record.year === year
			) {
				const holidayTemplate = cloneDeep(record.holiday_template);

				const holidayArray: string[] = holidayTemplate.holidays.map(
					(holiday: string) => holiday as string
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
	}, [recordData, selectedUser, year]);

	const siteHeaderContent = useMemo(
		() => (
			<SiteHeaderContent
				setSelectedMonth={setSelectedMonth}
				selectedMonth={selectedMonth}
				setSelectedUser={setSelectedUser}
				selectedUser={selectedUser}
				staff={workers || []}
			/>
		),
		[selectedMonth, selectedUser, workers]
	);

	return (
		<div>
			<StaffRecord days={days} year={year} staff={workers || []} />
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

import React, { useContext, useMemo } from "react";
import { RecordsStaffOverviwProps, StaffOption } from "./types";
import SiteHeaderContent from "./components/SiteHeaderContent";
import {
	FIND_ALL_STAFF,
	find_record,
	months,
	UserContext
} from "@repo/provider";
import useGetDay from "./hooks/useGetDay";
import { Divider } from "@repo/ui";
import { useQuery } from "@apollo/client";
import StaffRecord from "./content/StaffRecord";
import { TimesSaldo } from "./content/TimesSaldo";
import { Record } from "@repo/types";
import { StaffSurcharges } from "./content/StaffSurcharges";
import { StaffVacation } from "./content/StaffVacation";
import { StaffWorkingTimes } from "./content/StaffWorkingTimes";

const RecordsStaffOverview = ({ year }: RecordsStaffOverviwProps) => {
	const { projectId } = useContext(UserContext);

	const [selectedMonth, setSelectedMonth] = React.useState<
		(typeof months)[number]
	>(
		months.find(
			(month) => month.id === new Date().getMonth()
		) as (typeof months)[number]
	);
	const [selectedUser, setSelectedUser] = React.useState<StaffOption | null>(
		null
	);

	const { days, refetch } = useGetDay({
		year,
		user: selectedUser?.value
	});

	const { data: recordData } = useQuery(find_record, {
		variables: {
			params: {
				year: { _eq: year }
			}
		},
		skip: !year
	});
	const { data: staffData } = useQuery(FIND_ALL_STAFF);

	const currentRecords = useMemo(() => {
		const rec: Record[] = [];

		if (!recordData || !selectedUser) return rec;
		recordData.objects.findRecord.results.forEach((record: Record) => {
			if (record.user.objectId === selectedUser.value) {
				rec.push(record);
			}
		});

		return rec;
	}, [recordData, selectedUser]);

	const siteHeaderContent = useMemo(
		() => (
			<SiteHeaderContent
				setSelectedMonth={setSelectedMonth}
				selectedMonth={selectedMonth}
				setSelectedUser={setSelectedUser}
				selectedUser={selectedUser}
				staff={staffData?.objects.find_User.results || []}
			/>
		),
		[selectedMonth, selectedUser, staffData]
	);

	return (
		<div>
			<StaffRecord
				days={days}
				year={year}
				staff={staffData?.objects.find_User.results || []}
			/>
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
		</div>
	);
};

export default RecordsStaffOverview;

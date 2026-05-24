"use client";

import React, { useContext, useMemo, useState } from "react";
import useGetRecords from "./hooks/useGetRecords";
import initialFilters from "./constants/initialFilters";
import WeeklyRecords from "./content/WeeklyRecords/WeeklyRecords";
import siteStates from "./constants/site_states";
import RecordsCalendar from "./content/RecordsCalendar";
import RecordsAbsence from "./content/RecordsAbsence";
import RecordsStaffOverview from "./content/RecordsStaffOverview";
import { PatflowAppContext, useDataStore, useFindData } from "@repo/provider";
import { Filter } from "@repo/types";
import RecordsSettings from "./content/RecordsSettings";
import { Page } from "@repo/ui";
import ResetWorkerTimes from "./content/ResetWorkerTimes";
import { StaffOption } from "./types";
import { filterAbsences } from "./content";

const RecordsOverview = () => {
	const { year } = useContext(PatflowAppContext);
	const [filters, setFilters] = React.useState(
		initialFilters(year) as Filter[]
	);
	const { absences } = useDataStore();
	const { records, refetch } = useGetRecords({ filters });
	const [siteState, setSiteState] = useState<{
		value: string;
		label: string;
	}>(siteStates(0)[0]);
	const [editAbsence, setEditAbsence] = useState(false);
	const [resetWorkerTimes, setResetWorkerTimes] = useState(false);
	const [printWorkerTimes, setprintWorkerTimes] = useState(false);

	const [selectedUser, setSelectedUser] = React.useState<StaffOption | null>(
		null
	);

	const absenceData = useMemo(() => {
		return filterAbsences(absences, year);
	}, [absences, selectedUser]);

	const pageHeaderButtons = useMemo(() => {
		if (siteState.value === "workers") {
			return [
				{
					type: "button",
					text: "Monatsdaten aktualisieren",
					onClick: () => {
						setResetWorkerTimes(true);
					},
					color: "light",
					is_add_button: false
				},
				{
					type: "button",
					text: "Monatsdaten drucken",
					onClick: () => {
						setprintWorkerTimes(true);
					},
					color: "primary",
					is_add_button: false
				}
			];
		}
		if (siteState.value === "absence") {
			return [
				{
					type: "button",
					text: "Neue Abwesenheit",
					onClick: () => {
						setEditAbsence(true);
					},
					color: "primary",
					is_add_button: true
				}
			];
		}
	}, [siteState]);

	if (!records) {
		return null;
	}

	return (
		<Page
			title="Zeiterfassung"
			description="Hier finden Sie alle erfassten Arbeitszeiten und Urlaube."
			pageState={siteState}
			pageStates={[...siteStates(absenceData?.length || 0)]}
			setPageState={setSiteState}
			pageHeaderButtons={pageHeaderButtons}
		>
			{siteState.value === "weeks" && (
				<WeeklyRecords
					records={records}
					refetch={refetch}
					filters={filters}
					setFilters={setFilters}
				/>
			)}
			{siteState.value === "workers" && (
				<RecordsStaffOverview
					year={year}
					setSelectedUser={setSelectedUser}
					selectedUser={selectedUser}
					printWorkerTimes={printWorkerTimes}
					setPrintWorkerTimes={setprintWorkerTimes}
				/>
			)}
			{siteState.value === "absence" && <RecordsAbsence />}
			{siteState.value === "calendar" && (
				<RecordsCalendar records={records} />
			)}
			{siteState.value === "settings" && <RecordsSettings />}
			<ResetWorkerTimes
				resetWorkerTimes={resetWorkerTimes}
				setResetWorkerTimes={setResetWorkerTimes}
			/>
		</Page>
	);
};

export default RecordsOverview;

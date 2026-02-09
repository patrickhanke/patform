"use client";

import { useCallback, useContext, useMemo, useState } from "react";
import site_states from "./constants/site_states";
import { useDataHandler, useFindData } from "@repo/provider";
import SurchargeSettings from "./content/SurchargeSettings";
import HolidayTemplates from "./content/HolidayTemplates";
import Holidays from "./content/Holidays";
import { Holiday } from "@repo/types";
import { cloneDeep } from "lodash-es";
import axios from "axios";
import { Page, PageHeaderButtons } from "@repo/ui";
import { SiteState } from "@repo/types";
import EditRecords from "./content/EditRecords";
import { UserContext } from "@repo/provider";

const TimeSettings = () => {
	const [siteState, setSiteState] = useState<SiteState>(
		site_states[0] as SiteState
	);
	const { projectId } = useContext(UserContext);
	const [createTemplate, setCreateTemplate] = useState(false);
	const [createRecord, setCreateRecord] = useState(false);
	const { data: holidayData, refetch: refetchHolidays } = useFindData({
		objectName: "Holiday",
		fields: ["objectId", "name", "label", "type", "dates"],
		projectId,
		filters: [{ key: "type", value: "holiday", operator: "equalTo" }],
		skipQuery: !projectId
	});

	const { updateData } = useDataHandler();

	const refreshHolidayDates = useCallback(async () => {
		const holidays = holidayData || [];
		const yearArray = [];

		for (let i = 0; i < 7; i += 1) {
			const year = new Date().getFullYear() + i;
			yearArray.push(year);
		}
		const returnObject: { [key: string]: string[] } = {};

		const getYears = yearArray.map(async (year) => {
			const response = await axios.get(
				`https://feiertage-api.de/api/?jahr=${year}`
			);
			const data = response.data;

			if (!data || typeof data !== "object") {
				throw new Error("Invalid API response");
			}

			function findDatum(data: { [key: string]: object }) {
				const holidayObject = {};
				for (const region in data) {
					if (data[region]) {
						Object.assign(holidayObject, data[region]);
					}
				}
				return holidayObject;
			}
			const hdObject: { [key: string]: { datum: string } } =
				findDatum(data);

			console.log(hdObject);

			Object.keys(hdObject).forEach((holiday: keyof typeof hdObject) => {
				const holidayCopy = cloneDeep(returnObject[holiday]);
				const datum = hdObject[holiday]?.datum;
				console.log({ datum });
				if (datum && returnObject[holiday]) {
					returnObject[holiday].push(datum as string);
				} else {
					returnObject[holiday] = [datum as string];
				}
			});
		});

		await Promise.all(getYears);

		console.log(returnObject);

		const updateHolidays = holidays.map((holiday: Holiday) => {
			const dates = returnObject[holiday.name];
			console.log(dates);

			return updateData({
				className: "Holiday",
				objectId: holiday.objectId,
				updateObject: {
					dates: dates as object
				},
				feedback: "Feiertags-Daten aktualisiert"
			});
		});

		await Promise.all(updateHolidays);
		await refetchHolidays();
		return returnObject;
	}, [refetchHolidays, holidayData]);

	const siteHeaderButtons: PageHeaderButtons = useMemo(() => {
		if (siteState.value === "holiday-templates") {
			return [
				{
					text: "Neues Feiertag-Template erstellen",
					onClick: () => {
						setCreateTemplate(true);
					},
					is_add_button: true,
					color: "primary",
					disabled: false
				}
			];
		}
		if (siteState.value === "holidays") {
			return [
				{
					text: "Daten aktualisieren",
					onClick: () => {
						refreshHolidayDates();
					},
					is_add_button: false,
					color: "primary",
					disabled: false
				}
			];
		}
		if (siteState.value === "records") {
			return [
				{
					text: "Neuen Record erstellen",
					onClick: () => {
						setCreateRecord(true);
					},
					is_add_button: false,
					color: "primary",
					disabled: false
				}
			];
		}
		return [];
	}, [siteState]);

	return (
		<Page
			title="Zeiten und Zuschläge"
			pageStates={site_states}
			pageState={siteState}
			setPageState={setSiteState}
			pageHeaderButtons={siteHeaderButtons}
		>
			{siteState.value === "holiday-templates" && (
				<HolidayTemplates
					projectId={projectId}
					createHolidayTemplate={createTemplate}
					setCreateHolidayTemplate={setCreateTemplate}
					holidays={holidayData || []}
				/>
			)}
			{siteState.value === "holidays" && (
				<Holidays holidays={holidayData || []} />
			)}
			{siteState.value === "surcharges" && projectId && (
				<SurchargeSettings
					projectId={projectId}
					holidays={holidayData || []}
				/>
			)}
			{siteState.value === "records" && (
				<EditRecords
					createRecord={createRecord}
					setCreateRecord={setCreateRecord}
					projectId={projectId}
				/>
			)}
		</Page>
	);
};

export default TimeSettings;

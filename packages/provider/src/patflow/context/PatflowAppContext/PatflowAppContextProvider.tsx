"use client";

import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState
} from "react";
import PatflowAppContext from "./PatflowAppContext";
import {
	useFindData,
	useFindDataSecure,
	useTaskSubscription,
	useTicketSubscription
} from "@repo/provider";
import { RecordDataStore, RoleUsers } from "./types";
import {
	Absence,
	Holiday,
	PatflowUser,
	PatflowUserRole,
	Property,
	Record
} from "@repo/types";
import { CreateTask, CreateTicket } from "@repo/modules";
import dynamic from "next/dynamic";
import { useAppContext } from "@repo/provider";
import useDataStore from "./hooks/useDataStore";

const SelectYear = dynamic(() => import("./components/SelectYear"), {
	ssr: false
});

const PatflowAppContextProvider = ({
	children
}: {
	children: React.ReactNode;
}) => {
	const { project } = useAppContext();
	const [year, setYear] = useState(new Date().getFullYear());
	const projectId = project?.objectId;
	useTaskSubscription(projectId);
	useTicketSubscription(projectId);

	const { data: roleData } = useFindData({
		objectName: "Role",
		fields: [
			"objectId",
			"name",
			"type",
			"color",
			"users {edges{node{objectId username}}}"
		],
		projectId
	});

	const { data: workerData, refetch: refetchWorkers } = useFindDataSecure({
		objectName: "User",
		fields: [
			"objectId",
			"first_name",
			"last_name",
			"email",
			"portrait { name url }",
			"color",
			"time_settings",
			"is_worker",
			"number",
			"data",
			"role { objectId name type color }",
			"value: objectId",
			"label: label",
			"updatedAt"
		],
		filters: [{ key: "is_worker", value: true, operator: "equalTo" }],
		order: "last_name_ASC",
		projectId,
		useMasterKey: true
	});

	const { data: propertyData, refetch: refetchProperties } = useFindData({
		objectName: "Property",
		fields: [
			"objectId",
			"name",
			"created_by { objectId first_name last_name portrait { name url } }",
			"value: objectId",
			"label",
			"assigned_staff",
			"images",
			"settings",
			"archived",
			"updatedAt"
		],
		projectId
	});

	const { data: holidayData, refetch: refetchHolidays } = useFindData({
		objectName: "Holiday",
		fields: ["objectId", "name", "label", "type", "dates", "updatedAt"],
		projectId,
		filters: [{ key: "type", value: "holiday", operator: "equalTo" }],
		skipQuery: !projectId
	});

	const { data: recordData, refetch: refetchRecords } = useFindData({
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
			"holiday_template { objectId name holidays { ... on Element { value } } }",
			"updatedAt"
		],
		projectId,
		skipQuery: !projectId
	});

	const { data: absenceData, refetch: refetchAbsences } = useFindData({
		objectName: "Absence",
		fields: [
			"objectId",
			"year",
			"type",
			"state",
			"start_date",
			"end_date",
			"user {objectId first_name last_name portrait { name url }}",
			"updatedAt",
			"approved_by { objectId first_name last_name portrait { name url } }"
		],
		filters: [{ key: "year", value: year, operator: "equalTo" }],
		projectId,
		skipQuery: !projectId
	});

	console.log({ absenceData });

	const { setHolidays, setWorkers, setRecords, setProperties, setAbsences } =
		useDataStore();

	const prevHolidayIdsRef = useRef("");
	const prevWorkerIdsRef = useRef("");
	const prevRecordIdsRef = useRef("");
	const prevPropertyIdsRef = useRef("");
	const prevAbsenceIdsRef = useRef("");

	useEffect(() => {
		if (!projectId) {
			prevHolidayIdsRef.current = "";
			prevWorkerIdsRef.current = "";
			prevRecordIdsRef.current = "";
			prevPropertyIdsRef.current = "";
			setHolidays([]);
			setWorkers([]);
			setRecords([]);
			setProperties([]);
		}
	}, [projectId, setHolidays, setWorkers, setRecords, setProperties]);

	useEffect(() => {
		if (holidayData === undefined) return;
		const updatedAtHash = (holidayData ?? [])
			.map((h) => `${h.objectId}:${h.updatedAt}`)
			.sort()
			.join(",");
		if (updatedAtHash !== prevHolidayIdsRef.current) {
			prevHolidayIdsRef.current = updatedAtHash;
			setHolidays(holidayData ?? []);
		}
	}, [holidayData, setHolidays]);

	useEffect(() => {
		if (workerData === undefined) return;
		const updatedAtHash = (workerData ?? [])
			.map((w) => `${w.objectId}:${w.updatedAt}`)
			.sort()
			.join(",");
		if (updatedAtHash !== prevWorkerIdsRef.current) {
			prevWorkerIdsRef.current = updatedAtHash;
			setWorkers(workerData ?? []);
		}
	}, [workerData, setWorkers]);

	useEffect(() => {
		if (recordData === undefined) return;
		const updatedAtHash = (recordData ?? [])
			.map((r) => `${r.objectId}:${r.updatedAt}`)
			.sort()
			.join(",");
		if (updatedAtHash !== prevRecordIdsRef.current) {
			prevRecordIdsRef.current = updatedAtHash;

			const recordsCopy: RecordDataStore[] = recordData.map((r) => ({
				...r,
				holiday_template: {
					...r.holiday_template,
					holidays: r.holiday_template.holidays.map(
						(h: { value: string }) => h.value as string
					)
				},
				value: r.objectId,
				label: r.user.first_name + " " + r.user.last_name + " " + r.year
			}));
			setRecords(recordsCopy ?? []);
		}
	}, [recordData, setRecords]);

	useEffect(() => {
		if (propertyData === undefined) return;
		const updatedAtHash = (propertyData ?? [])
			.map((p) => `${p.objectId}:${p.updatedAt}`)
			.sort()
			.join(",");
		if (updatedAtHash !== prevPropertyIdsRef.current) {
			prevPropertyIdsRef.current = updatedAtHash;
			setProperties(
				propertyData.filter((p: Property) => !p.archived) ?? []
			);
		}
	}, [propertyData, setProperties]);

	useEffect(() => {
		if (absenceData === undefined) return;
		const updatedAtHash = (absenceData ?? [])
			.map((a) => `${a.objectId}:${a.updatedAt}`)
			.sort()
			.join(",");
		if (updatedAtHash !== prevAbsenceIdsRef.current) {
			prevAbsenceIdsRef.current = updatedAtHash;
			setAbsences(absenceData ?? []);
		}
	}, [absenceData, setAbsences]);

	const reloadHolidays = useCallback(async () => {
		const result = await refetchHolidays();
		if (result.data) {
			const queryData =
				result.data.holidays?.edges?.map(
					(edge: { node: Holiday }) => edge.node
				) || [];
			setHolidays(queryData);
			prevHolidayIdsRef.current = queryData
				.map((h: Holiday) => `${h.objectId}:${h.updatedAt}`)
				.sort()
				.join(",");
		}
	}, [refetchHolidays, setHolidays]);

	const reloadWorkers = useCallback(async () => {
		const result = await refetchWorkers();
		if (result.data) {
			const queryData =
				result.data.users?.edges?.map(
					(edge: { node: PatflowUser }) => edge.node
				) || [];
			setWorkers(queryData);
			prevWorkerIdsRef.current = queryData
				.map((w: PatflowUser) => `${w.objectId}:${w.updatedAt}`)
				.sort()
				.join(",");
		}
	}, [refetchWorkers, setWorkers]);

	const reloadRecords = useCallback(async () => {
		const result = await refetchRecords();
		if (result.data) {
			const queryData =
				result.data.records?.edges?.map(
					(edge: { node: Record }) => edge.node
				) || [];
			const recordsCopy: RecordDataStore[] = queryData.map(
				(r: Record) => ({
					...r,
					holiday_template: {
						...r.holiday_template,
						holidays: r.holiday_template.holidays.map(
							(h: { value: string }) => h.value as string
						)
					},
					value: r.objectId,
					label:
						r.user.first_name +
						" " +
						r.user.last_name +
						" " +
						r.year
				})
			);
			setRecords(recordsCopy);
			prevRecordIdsRef.current = queryData
				.map((r: Record) => `${r.objectId}:${r.updatedAt}`)
				.sort()
				.join(",");
		}
	}, [refetchRecords, setRecords]);

	const reloadProperties = useCallback(async () => {
		const result = await refetchProperties();
		if (result.data) {
			const queryData =
				result.data.properties?.edges?.map(
					(edge: { node: Property }) => edge.node
				) || [];
			setProperties(queryData.filter((p: Property) => !p.archived) ?? []);
			prevPropertyIdsRef.current = queryData
				.map((p: Property) => `${p.objectId}:${p.updatedAt}`)
				.sort()
				.join(",");
		}
	}, [refetchProperties, setProperties]);

	const reloadAbsences = useCallback(async () => {
		console.log("reloadAbsences");
		const result = await refetchAbsences();
		if (result.data) {
			const queryData =
				result.data.absences?.edges?.map(
					(edge: { node: Absence }) => edge.node
				) || [];
			setAbsences(queryData);
			prevAbsenceIdsRef.current = queryData
				.map((a: Absence) => `${a.objectId}:${a.updatedAt}`)
				.sort()
				.join(",");
		}
		console.log("reloadAbsences done");
	}, [refetchAbsences, setAbsences]);

	const roleUsers = useMemo(() => {
		const roleObject: RoleUsers = {
			worker: [],
			office: [],
			admin: []
		};

		if (roleData) {
			roleData.forEach((role: PatflowUserRole) => {
				roleObject[role.type] = role.users.edges.map(
					(user: { node: { objectId: string } }) => user.node.objectId
				);
			});
		}

		return roleObject;
	}, [roleData]);

	const appContextObject = useMemo(
		() => ({
			createTicket: <CreateTicket />,
			createTask: <CreateTask />,
			selectYear: <SelectYear year={year} setYear={setYear} />,
			year,
			refetchWorkers,
			refetchProperties,
			reloadHolidays,
			reloadWorkers,
			reloadRecords,
			reloadProperties,
			reloadAbsences,
			project: project ?? { objectId: "" },
			roles: roleData
				? roleData.map((role: PatflowUserRole) => ({
						value: role.objectId,
						type: role.type,
						label: role.name,
						color: role.color,
						users: role.users.edges.map(
							(user: {
								node: { objectId: string; username: string };
							}) => ({
								objectId: user.node.objectId,
								username: user.node.username
							})
						)
					}))
				: [],
			roleUsers
		}),
		[
			roleUsers,
			year,
			roleData,
			workerData,
			propertyData,
			project,
			reloadHolidays,
			reloadWorkers,
			reloadRecords,
			reloadProperties,
			reloadAbsences
		]
	);

	return (
		<PatflowAppContext.Provider value={appContextObject}>
			{children}
		</PatflowAppContext.Provider>
	);
};

export default PatflowAppContextProvider;

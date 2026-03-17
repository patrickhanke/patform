"use client";

import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState
} from "react";
import PatflowAppContext from "./PatflowAppContext";
import { useFindData, useFindDataSecure } from "@repo/provider";
import { RoleUsers } from "./types";
import { PatflowUserRole } from "@repo/types";
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
	const [refetchTicket, setRefetchTicket] = useState<Date | undefined>();
	const [refetchTask, setRefetchTask] = useState<Date | undefined>();
	const [year, setYear] = useState(new Date().getFullYear());
	const projectId = project?.objectId;

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
			"portrait",
			"color",
			"time_settings",
			"is_worker",
			"number",
			"data",
			"role { objectId name type color }",
			"value: objectId",
			"label: label"
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
			"created_by { objectId first_name last_name portrait }"
		],
		projectId
	});

	const { data: holidayData, refetch: refetchHolidays } = useFindData({
		objectName: "Holiday",
		fields: ["objectId", "name", "label", "type", "dates"],
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
			"holiday_template { objectId name holidays { ... on Element { value } } }"
		],
		projectId,
		skipQuery: !projectId
	});

	const { setHolidays, setWorkers, setRecords, setProperties } =
		useDataStore();

	const prevHolidayIdsRef = useRef("");
	const prevWorkerIdsRef = useRef("");
	const prevRecordIdsRef = useRef("");
	const prevPropertyIdsRef = useRef("");

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
		const ids = (holidayData ?? [])
			.map((h) => h.objectId)
			.sort()
			.join(",");
		if (ids !== prevHolidayIdsRef.current) {
			prevHolidayIdsRef.current = ids;
			setHolidays(holidayData ?? []);
		}
	}, [holidayData, setHolidays]);

	useEffect(() => {
		if (workerData === undefined) return;
		const ids = (workerData ?? [])
			.map((w) => w.objectId)
			.sort()
			.join(",");
		if (ids !== prevWorkerIdsRef.current) {
			prevWorkerIdsRef.current = ids;
			setWorkers(workerData ?? []);
		}
	}, [workerData, setWorkers]);

	useEffect(() => {
		if (recordData === undefined) return;
		const ids = (recordData ?? [])
			.map((r) => r.objectId)
			.sort()
			.join(",");
		if (ids !== prevRecordIdsRef.current) {
			prevRecordIdsRef.current = ids;
			setRecords(recordData ?? []);
		}
	}, [recordData, setRecords]);

	useEffect(() => {
		if (propertyData === undefined) return;
		const ids = (propertyData ?? [])
			.map((p) => p.objectId)
			.sort()
			.join(",");
		if (ids !== prevPropertyIdsRef.current) {
			prevPropertyIdsRef.current = ids;
			setProperties(propertyData ?? []);
		}
	}, [propertyData, setProperties]);

	const reloadHolidays = useCallback(async () => {
		await refetchHolidays();
	}, [refetchHolidays]);

	const reloadWorkers = useCallback(async () => {
		await refetchWorkers();
	}, [refetchWorkers]);

	const reloadRecords = useCallback(async () => {
		await refetchRecords();
	}, [refetchRecords]);

	const reloadProperties = useCallback(async () => {
		await refetchProperties();
	}, [refetchProperties]);

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
			refetchTask,
			refetchTicket,
			setRefetchTask,
			setRefetchTicket,
			createTicket: <CreateTicket setRefetchTicket={setRefetchTicket} />,
			createTask: <CreateTask setRefetchTask={setRefetchTask} />,
			selectYear: <SelectYear year={year} setYear={setYear} />,
			year,
			refetchWorkers,
			refetchProperties,
			reloadHolidays,
			reloadWorkers,
			reloadRecords,
			reloadProperties,
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
			refetchTask,
			refetchTicket,
			roleUsers,
			year,
			roleData,
			workerData,
			propertyData,
			project,
			reloadHolidays,
			reloadWorkers,
			reloadRecords,
			reloadProperties
		]
	);

	return (
		<PatflowAppContext.Provider value={appContextObject}>
			{children}
		</PatflowAppContext.Provider>
	);
};

export default PatflowAppContextProvider;

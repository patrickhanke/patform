"use client";

import React, { useMemo, useState } from "react";
import PatflowAppContext from "./PatflowAppContext";
import { useFindData } from "@repo/provider";
import { RoleUsers } from "./types";
import { PatflowUserRole } from "@repo/types";
import { CreateTask, CreateTicket } from "@repo/modules";
import dynamic from "next/dynamic";
import { useAppContext } from "@repo/provider";

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
	const { data: roleData } = useFindData({
		objectName: "Role",
		fields: [
			"objectId",
			"name",
			"type",
			"color",
			"users { objectId username }"
		],
		projectId: project?.objectId
	});

	const { data: workerData, refetch: refetchWorkers } = useFindData({
		objectName: "User",
		fields: [
			"objectId",
			"first_name",
			"last_name",
			"email",
			"portrait",
			"color"
		],
		projectId: project?.objectId
	});

	const { data: propertyData, refetch: refetchProperties } = useFindData({
		objectName: "Property",
		fields: [
			"objectId",
			"name",
			"created_by { objectId first_name last_name portrait }"
		],
		projectId: project?.objectId
	});

	const roleUsers = useMemo(() => {
		const roleObject: RoleUsers = {
			worker: [],
			office: [],
			admin: []
		};

		if (roleData) {
			roleData.forEach((role: PatflowUserRole) => {
				roleObject[role.type] = role.users.results.map(
					(user) => user.objectId
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
			workers: workerData || [],
			properties: propertyData || [],
			refetchWorkers,
			refetchProperties,
			roles: roleData
				? roleData.map((role: PatflowUserRole) => ({
						value: role.objectId,
						type: role.type,
						label: role.name,
						color: role.color,
						users: role.users.results
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
			project
		]
	);

	return (
		<PatflowAppContext.Provider value={appContextObject}>
			{children}
		</PatflowAppContext.Provider>
	);
};

export default PatflowAppContextProvider;

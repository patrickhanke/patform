"use client";

import {
	generateGraphQLQuery_4_1,
	useDataHandler,
	useFindData
} from "@repo/provider";
import { DnDDisplay, sortItemsByPosition } from "@repo/ui";
import { Module } from "@repo/types";
import { useQuery } from "@apollo/client";
import AppModule from "./content/AppModule";
import { useCallback, useMemo, useState } from "react";
import { AdminPage } from "@repo/modules";
import { SelectModule } from "./types";
import CreateModule from "./components/CreateModule";
import site_states from "./constants/site_states";
import AppUsers from "./content/AppUsers";
import ProjectSettings from "./content/ProjectSettings";
import ProjectRoles from "./content/ProjectRoles";

const Project = ({ params }: { params: { project_id: string } }) => {
	const { data: projectData } = useQuery(
		generateGraphQLQuery_4_1({
			type: "get",
			queryName: "project",
			objectName: "Project",
			fields: ["objectId", "name", "createdAt", "logo { url name }"]
		}),
		{
			variables: { id: params.project_id }
		}
	);
	const [createModule, setCreateModule] = useState(false);
	const [createUser, setCreateUser] = useState(false);
	const [createRole, setCreateRole] = useState(false);
	const [addUser, setAddUser] = useState(false);

	const [siteState, setSiteState] = useState(
		site_states[0] as (typeof site_states)[number]
	);
	const { createData, updateData } = useDataHandler(true, false);
	const { data, refetch } = useFindData({
		objectName: "Module",
		fields: [
			"objectId",
			"name",
			"createdAt",
			"icon",
			"path",
			"connected_class"
		],
		projectId: params.project_id
	});

	const pageHeaderButtons = useMemo(() => {
		if (siteState.value === "modules")
			return [
				{
					text: "Neues Modul",
					onClick: () => setCreateModule(true)
				}
			];
		if (siteState.value === "users")
			return [
				{
					text: "Neuer Benutzer",
					onClick: () => setCreateUser(true),
					is_add_button: true
				},
				{
					text: "Benutzer hinzufügen",
					onClick: () => setAddUser(true)
				}
			];
		if (siteState.value === "roles")
			return [
				{
					text: "Neue Rolle erstellen",
					onClick: () => setCreateRole(true),
					is_add_button: true
				}
			];
	}, [params.project_id, siteState]);

	const createModuleHandler = useCallback(
		async (module: SelectModule["fields"]) => {
			await createData({
				className: "Module",
				updateObject: {
					...module,
					position: data?.length + 1,
					project: {
						__type: "Pointer",
						className: "Project",
						objectId: params.project_id
					}
				},
				afterSaveHandler: async (data) => {
					await updateData({
						className: "Project",
						objectId: params.project_id,
						updateObject: {
							modules: {
								__op: "AddRelation",
								objects: [
									{
										__type: "Relation",
										className: "Module",
										objectId: data.objectId
									}
								]
							}
						}
					});
				}
			});
			await refetch();
			setCreateModule(false);
		},
		[data]
	);

	if (!data && !projectData) return <div> loading ...</div>;

	console.log(data);

	const modules = data || [];

	console.log(modules);

	return (
		<AdminPage
			title={`${projectData?.project?.name} - ${siteState.label}`}
			pageHeaderButtons={pageHeaderButtons}
			pageStates={site_states}
			activeState={siteState}
			navOnClick={setSiteState}
		>
			{siteState?.value === "modules" && (
				<div style={{ width: "fit-content" }}>
					<DnDDisplay
						items={
							sortItemsByPosition(modules).map(
								(module: Module) => ({
									...module,
									id: module?.objectId
								})
							) || []
						}
						ItemComponent={({ item }) => (
							<AppModule
								id={item.id}
								projectId={params.project_id}
								modules={modules}
							/>
						)}
						objectClass="Module"
					/>
					<CreateModule
						createModule={createModule}
						setCreateModule={setCreateModule}
						createModuleHandler={createModuleHandler}
						modules={modules}
					/>
				</div>
			)}
			{siteState?.value === "users" && (
				<>
					<AppUsers
						projectId={params.project_id}
						createUser={createUser}
						setCreateUser={setCreateUser}
						addUser={addUser}
						setAddUser={setAddUser}
					/>
				</>
			)}
			{siteState?.value === "roles" && (
				<>
					<ProjectRoles
						projectId={params.project_id}
						createRole={createRole}
						setCreateRole={setCreateRole}
						modules={modules}
					/>
				</>
			)}
			{siteState?.value === "settings" && (
				<>
					<ProjectSettings projectId={params.project_id} />
				</>
			)}
		</AdminPage>
	);
};

export default Project;

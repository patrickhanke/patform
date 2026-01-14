import { useCallback } from "react";
import { useQuery } from "@apollo/client";
import {
	generateGraphQLQuery,
	paramsHandler,
	useDataHandler
} from "@repo/provider";
import { SlideIn, Table } from "@repo/ui";
import useUserColumns from "./hooks/useUserColumns";
import { AppUsersProps, UserObject } from "./types";
import { FC, useEffect, useState } from "react";
import CreateUser from "./components/CreateUser";
import AddUser from "./components/AddUser";
import { v4 } from "uuid";
import { cloneDeep } from "lodash-es";
import { PatstoreRoleClass } from "@repo/types";

const AppUsers: FC<AppUsersProps> = ({
	projectId,
	createUser,
	setCreateUser,
	addUser,
	setAddUser
}) => {
	const { updateData, createData } = useDataHandler(true, false);;
	const { data, refetch } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "_User",
			fields: ["objectId", "username", "email", "label", "name", "roles"]
		}),
		{
			variables: {
				params: paramsHandler({
					filters: [
						{
							key: "projects",
							value: projectId,
							operator: "_in",
							id: "projects"
						}
					]
				})
			}
		}
	);

	const { data: roleData } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "_Role",
			fields: [
				"objectId",
				"name",
				"users {results{objectId username}}",
				"default"
			]
		}),
		{
			variables: {
				params: paramsHandler({
					filters: [
						{
							key: "project",
							value: projectId,
							operator: "_eq",
							id: "project"
						}
					]
				})
			}
		}
	);
	const columns = useUserColumns({
		refetch,
		roles: roleData?.objects.find_Role.results || []
	});

	const [user, setUser] = useState<UserObject>({
		username: "",
		label: "",
		value: "",
		name: "",
		projects: [projectId],
		role: { value: "", label: "" }
	});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!user && createUser && roleData) {
			const defaultRole = roleData.objects.find_Role.results.find(
				(role: PatstoreRoleClass) => role.default
			);
			setUser({
				username: "",
				label: "",
				value: "",
				name: "",
				projects: [projectId],
				role: { value: defaultRole.objectId, label: defaultRole.name }
			});
		}
	}, [createUser, user, roleData]);

	const updateUserHandler = useCallback(async () => {
		setLoading(true);
		if (createUser && user) {
			await createData({
				className: "_User",
				updateObject: {
					username: user?.username,
					label: user?.label,
					projects: [projectId],
					password: v4(),
					email: user?.username,
					set_password: true,
					name: user?.name,
					roles: [user.role.value],
					is_superuser: false
				}
			});
		}
		if (addUser && user) {
			const projectsCopy = cloneDeep(user.projects);
			projectsCopy.push(projectId);
			await updateData({
				className: "_User",
				objectId: user?.value,
				updateObject: {
					projects: projectsCopy
				}
			});
		}
		await refetch();
		setLoading(false);
		if (createUser) {
			setCreateUser(false);
		}
		if (addUser) {
			setAddUser(false);
		}
	}, [user]);

	return (
		<div>
			<Table
				columns={columns}
				data={data?.objects.find_User.results || []}
			/>
			<SlideIn
				header="Neuen Benutzer erstellen"
				isOpen={createUser || addUser}
				cancel={() => {
					if (createUser) {
						setCreateUser(false);
					} else {
						setAddUser(false);
					}
				}}
				confirm={() => updateUserHandler()}
				disabled={[loading, loading]}
				preventClickOutside
			>
				<div>
					{createUser && user && (
						<CreateUser
							user={user}
							setUser={setUser}
							roles={roleData?.objects.find_Role.results || []}
						/>
					)}
					{addUser && (
						<AddUser
							user={user}
							setUser={setUser}
							projectId={projectId}
							roles={roleData?.objects.find_Role.results || []}
						/>
					)}
				</div>
			</SlideIn>
		</div>
	);
};

export default AppUsers;

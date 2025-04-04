"use client";

import { useCallback, useMemo } from "react";
import { useQuery } from "@apollo/client";
import {
	axiosclient,
	generateGraphQLQuery,
	paramsHandler,
	useAppContext
} from "@repo/provider";
import { Page, SlideIn, Table } from "@repo/ui";
import useUserColumns from "./hooks/useUserColumns";
import { UsersOverviewProps, UserObject } from "./types";
import { FC, useEffect, useState } from "react";
import CreateUser from "./components/CreateUser";

const UsersOverview: FC<UsersOverviewProps> = () => {
	const { project } = useAppContext();
	const [createUser, setCreateUser] = useState(false);
	const { data, refetch } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "_User",
			fields: ["objectId", "username", "email", "name"]
		}),
		{
			variables: {
				params: paramsHandler({
					filters: [
						{
							key: "projects",
							value: project.objectId,
							operator: "_in",
							id: "projects"
						},
						{
							key: "is_superuser",
							value: true,
							operator: "_ne",
							id: "is_superuser"
						}
					]
				})
			},
			skip: !project?.objectId
		}
	);
	const columns = useUserColumns();

	const [user, setUser] = useState<UserObject | undefined>();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!user && createUser) {
			setUser({
				username: "",
				value: "",
				name: "",
				projects: [project.objectId]
			});
		}
	}, [createUser, user]);

	console.log(user);

	const updateUserHandler = useCallback(async () => {
		setLoading(true);
		console.log("update user");

		if (createUser && user) {
			axiosclient().post("/functions/send-user-invitation", {
				username: user.username,
				email: user.username,
				name: user.name,
				project_id: project.objectId
			});
		}

		await refetch();
		setLoading(false);
	}, [user]);

	const pageHeaderButtons = useMemo(
		() => [
			{
				text: "Neuen Benutzer einladen",
				onClick: () => setCreateUser(true),
				is_add_button: true
			}
		],
		[]
	);

	return (
		<Page title="Nutzerübersicht" pageHeaderButtons={pageHeaderButtons}>
			<Table
				columns={columns}
				data={data?.objects.find_User.results || []}
			/>
			<SlideIn
				header="Neuen Benutzer einladen"
				isOpen={createUser}
				cancel={() => setCreateUser(false)}
				confirm={() => updateUserHandler()}
				disabled={[loading, loading]}
				preventClickOutside
			>
				<div>
					{createUser && user && (
						<CreateUser user={user} setUser={setUser} />
					)}
				</div>
			</SlideIn>
		</Page>
	);
};

export default UsersOverview;

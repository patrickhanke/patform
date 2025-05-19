"use client";

import { useCallback, useMemo } from "react";
import { axiosclient, useAppContext } from "@repo/provider";
import { Page, RenderFilters, SlideIn, Table } from "@repo/ui";
import useUserColumns from "./hooks/useUserColumns";
import { UsersOverviewProps, UserObject } from "./types";
import { FC, useEffect, useState } from "react";
import CreateUser from "./components/CreateUser";
import useFindUser from "./hooks/useFindUser";
import { Filter } from "@repo/types";

const UsersOverview: FC<UsersOverviewProps> = () => {
	const { project } = useAppContext();
	const [createUser, setCreateUser] = useState(false);

	const initialFilters: Filter[] = useMemo(
		() => [
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
		],
		[project]
	);

	const [filters, setFilters] = useState<Filter[]>(initialFilters);

	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});

	const { users, refetch, count } = useFindUser({
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize
	});
	const columns = useUserColumns({ refetch });

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

	const updateUserHandler = useCallback(async () => {
		setLoading(true);
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

	const renderFilters = useMemo(() => {
		return (
			<RenderFilters
				filters={filters}
				setFilters={setFilters}
				fields={[
					{
						type: "input",
						key: "name",
						operator: "_regex",
						value: "",
						placeholder: "Suchwort"
					}
				]}
				categories={[]}
				initialFilters={initialFilters}
			/>
		);
	}, []);

	return (
		<Page title="Nutzerübersicht" pageHeaderButtons={pageHeaderButtons}>
			<Table
				columns={columns}
				data={users || []}
				setPagination={setPagination}
				pagination={pagination}
				rowCount={count}
				filterContent={renderFilters}
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

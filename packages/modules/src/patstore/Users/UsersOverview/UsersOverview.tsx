"use client";

import { useCallback, useMemo } from "react";
import { axiosclient, useAppContext, useDataContext } from "@repo/provider";
import { Page, RenderFilters, SlideIn, SlideInForm, Table } from "@repo/ui";
import useUserColumns from "./hooks/useUserColumns";
import { UsersOverviewProps, UserObject } from "./types";
import { FC, useEffect, useState } from "react";
import useFindUser from "./hooks/useFindUser";
import { Filter } from "@repo/types";
import page_states from "./constants/page_states";
import UserInvitations from "./content/UserInvitations";
import FileImporter from "./components/FileImporter";
import create_user_fieds from "./constants/create_user_fields";

const UsersOverview: FC<UsersOverviewProps> = () => {
	const { project } = useAppContext();
	const [createUser, setCreateUser] = useState(false);
	const { feedbackHandler } = useDataContext();
	const [pageState, setPageState] = useState<(typeof page_states)[number]>(
		page_states[0]
	);

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

	const updateUserHandler = useCallback(
		async (values) => {
			console.log(values);
			axiosclient().post("/functions/send-user-invitation", {
				username: values.username,
				email: values.username,
				name: values.name,
				project_id: project.objectId,
				initial_invitation: true
			});

			feedbackHandler({
				success: true,
				message: "Einladung erfolgreich gesendet",
				type: "success"
			});

			await refetch();
			setCreateUser(false);
		},
		[project]
	);

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
		<Page
			title="Nutzerübersicht"
			pageHeaderButtons={pageHeaderButtons}
			pageStates={[...page_states]}
			pageState={pageState}
			setPageState={setPageState}
		>
			{process.env.NODE_ENV === "development" && <FileImporter />}
			{pageState.value === "user" && (
				<Table
					columns={columns}
					data={users || []}
					setPagination={setPagination}
					pagination={pagination}
					rowCount={count}
					filterContent={renderFilters}
				/>
			)}
			{pageState.value === " invitations" && <UserInvitations />}
			<SlideInForm
				title="Neuen Benutzer einladen"
				isOpen={createUser}
				setIsOpen={setCreateUser}
				dataHandler={updateUserHandler}
				fields={create_user_fieds}
			/>
		</Page>
	);
};

export default UsersOverview;

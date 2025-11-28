"use client";

import { useCallback, useContext, useMemo } from "react";
import {
	axiosclient,
	PatstoreAppContext,
	useAppContext,
	useDataContext
} from "@repo/provider";
import {
	generateColumnsFromFields,
	Page,
	RenderFilters,
	SlideInForm,
	Table,
	useCreateColumns
} from "@repo/ui";
import { UsersOverviewProps } from "./types";
import { FC, useState } from "react";
import { Filter, PatstoreRoleClass, PatstoreUser } from "@repo/types";
import page_states from "./constants/page_states";
import UserInvitations from "./content/UserInvitations";
import create_user_fieds from "./constants/create_user_fields";
import useFindRoles from "./hooks/useFindRoles";
import { useDataHandler } from "@repo/provider";
import useFindUserData from "./hooks/useFindUserData";

const UsersOverview: FC<UsersOverviewProps> = () => {
	const { deleteData } = useDataHandler(true);
	const { project } = useAppContext();
	const { currentModule } = useContext(PatstoreAppContext);
	const { roles } = useFindRoles({ projectId: project.objectId });

	const [inviteUser, setInviteUser] = useState(false);
	const [_createUser, setCreateUser] = useState(false);

	const { feedbackHandler } = useDataContext();
	const [pageState, setPageState] = useState<(typeof page_states)[number]>(
		page_states[0]
	);

	const initialFilters: Filter[] = useMemo(
		() => [
			{
				key: "projects",
				value: [project.objectId],
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

	const {
		data: users,
		refetch,
		count
	} = useFindUserData<PatstoreUser>({
		module: currentModule,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize,
		order: "name_ASC"
	});

	const columns = useCreateColumns<PatstoreUser>({
		data: generateColumnsFromFields(currentModule.fields),
		fields: currentModule.data_fields,
		className: "_User",
		refetch,
		categories: currentModule?.categories
	});

	const updateUserHandler = useCallback(
		async (values) => {
			axiosclient().post("/functions/send-user-invitation", {
				username: values.username,
				email: values.username,
				name: values.name,
				roles: [values.role],
				project_id: project.objectId,
				initial_invitation: true
			});

			feedbackHandler({
				success: true,
				message: "Einladung erfolgreich gesendet",
				type: "success"
			});

			await refetch();
			setInviteUser(false);
		},
		[project]
	);

	const pageHeaderButtons = useMemo(
		() => [
			{
				text: "Neuen Benutzer erstellen",
				onClick: () => setCreateUser(true),
				is_add_button: true,
				disabled: false
				// !(
				// 	project.id !== "EgRR0prozh" || project.id !== "JRxDkaxCoI"
				// )
			},
			{
				text: "Neuen Benutzer einladen",
				onClick: () => setInviteUser(true),
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
						key: "last_name",
						operator: "_regex",
						value: "",
						placeholder: "Nachname"
					},
					{
						type: "input",
						key: "first_name",
						operator: "_regex",
						value: "",
						placeholder: "Vorname"
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
			{process.env.NODE_ENV === "development" && (
				<button
					onClick={async () => {
						if (!users) return;
						const deleteUsers = users.map(async (user) => {
							return await deleteData({
								className: "_User",
								objectId: user.objectId
							});
						});

						await Promise.all(deleteUsers);
						await refetch();
					}}
				>
					alle Löschen
				</button>
			)}
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
				isOpen={inviteUser}
				setIsOpen={setInviteUser}
				dataHandler={updateUserHandler}
				fields={create_user_fieds(
					roles?.map((role: PatstoreRoleClass) => ({
						value: role.objectId,
						label: role.name
					})) || []
				)}
			/>
		</Page>
	);
};

export default UsersOverview;

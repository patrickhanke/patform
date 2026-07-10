"use client";

import { useCallback, useContext, useMemo } from "react";
import {
	axiosclient,
	generateQueryFromFields,
	PatstoreAppContext,
	useAppContext,
	useDataContext,
	useFindDataSecure
} from "@repo/provider";
import {
	generateColumnsFromFields,
	Page,
	SlideInForm,
	Table,
	useCreateColumns
} from "@repo/ui";
import { CreateUser, UsersOverviewProps } from "./types";
import { FC, useState } from "react";
import { Filter, PatstoreRoleClass, PatstoreUser } from "@repo/types";
import page_states from "./constants/page_states";
import UserInvitations from "./content/UserInvitations";
import create_user_fieds from "./constants/create_user_fields";
import useFindRoles from "./hooks/useFindRoles";
import create_user from "./constants/create_user";
import EmailSuppression from "./components/EmailSuppression";

const UsersOverview: FC<UsersOverviewProps> = () => {
	const { project } = useAppContext();
	const { currentModule } = useContext(PatstoreAppContext);
	const { roles } = useFindRoles({ projectId: project.objectId });
	const [order, setOrder] = useState<string>("name_ASC");

	const [emailSuppression, setEmailSuppression] = useState(false);
	const [inviteUser, setInviteUser] = useState(false);
	const [createUser, setCreateUser] = useState(false);

	const { feedbackHandler } = useDataContext();
	const [pageState, setPageState] = useState<(typeof page_states)[number]>(
		page_states[0]
	);

	const initialFilters: Filter[] = useMemo(
		() => [
			{
				key: "projects",
				value: [project.objectId],
				operator: "in"
			},
			{
				key: "is_superuser",
				value: true,
				operator: "notEqualTo"
			}
		],
		[project]
	);

	const [filters, setFilters] = useState<Filter[]>([]);

	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});

	const {
		data: users,
		refetch,
		count
	} = useFindDataSecure({
		objectName: "User",
		fields: [
			...generateQueryFromFields(currentModule.fields),
			"data",
			"roles",
			"settings",
			"name"
		],
		filters: [...initialFilters, ...filters] as Filter[],
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize,
		order: order,
		useMasterKey: true
	});

	const columns = useCreateColumns<PatstoreUser>({
		data: generateColumnsFromFields(currentModule.fields),
		fields: currentModule.data_fields,
		settings: currentModule.setting_fields,
		className: "User",
		refetch,
		categories: currentModule?.categories,
		useMasterKey: true,
		hasEmailSettings:
			currentModule.fields?.find((field) => field.id === "emails")
				?.active || false
	});

	const createUserFields: CreateUser[keyof CreateUser] | undefined =
		create_user(
			roles?.map((role: PatstoreRoleClass) => ({
				value: role.objectId,
				label: role.name
			}))
		)?.[project?.objectId || ""];

	const updateUserHandler = useCallback(
		async (values: Partial<PatstoreUser>) => {
			axiosclient().post("/functions/send_user_invitation", {
				username: values.username,
				email: values.username,
				name: values.name,
				roles: [values.role],
				project_id: project?.objectId || "",
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

	const createUserHandler = useCallback(
		async (values: Partial<PatstoreUser>) => {
			axiosclient().post("/functions/create_user_from_data", {
				...values,
				email: values.username,
				project_id: project?.objectId || "",
				roles: [values.role]
			});

			feedbackHandler({
				success: true,
				message: "Benutzer erfolgreich erstellt",
				type: "success"
			});

			await refetch();
		},
		[project]
	);

	const pageHeaderButtons = useMemo(() => {
		const buttonArray = [];
		if (
			currentModule.fields?.find((field) => field.id === "emails")?.active
		) {
			buttonArray.push({
				text: "Email Adressen prüfen",
				onClick: () => setEmailSuppression(true),
				is_add_button: false
			});
		}
		if (project?.settings?.user_creation) {
			buttonArray.push({
				text: "Neuen Nutzer erstellen",
				onClick: () => setCreateUser(true),
				is_add_button: true,
				disabled: false
			});
		}

		if (project?.settings?.user_invitations) {
			buttonArray.push({
				text: "Neuen Nutzer einladen",
				onClick: () => setInviteUser(true),
				is_add_button: true
			});
		}

		return buttonArray;
	}, [createUserFields]);

	return (
		<Page
			title="Nutzerübersicht"
			pageHeaderButtons={pageHeaderButtons}
			pageStates={
				project?.settings?.user_invitations
					? [...page_states]
					: undefined
			}
			pageState={pageState}
			setPageState={setPageState}
		>
			{pageState.value === "user" && (
				<Table
					columns={columns}
					data={users || []}
					setPagination={setPagination}
					pagination={pagination}
					rowCount={count}
					filters={filters}
					setFilters={setFilters}
					filterColumns={currentModule.filters}
					setOrder={setOrder}
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
			<SlideInForm
				title="Neuen Benutzer erstellen"
				isOpen={createUser}
				setIsOpen={setCreateUser}
				dataHandler={createUserHandler}
				fields={createUserFields?.fields || []}
				data={createUserFields?.data || {}}
			/>
			<EmailSuppression
				isOpen={emailSuppression}
				setIsOpen={setEmailSuppression}
				projectId={project.objectId}
			/>
		</Page>
	);
};

export default UsersOverview;

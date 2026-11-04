import { FC, useCallback, useContext, useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { PatflowAppContext, useDataHandlerSecure } from "@repo/provider";
import { ErrorMessage, PatflowUser } from "@repo/types";
import { SlideIn } from "@repo/ui";
import { CreateStaffMemberProps, NewStaffMemberForm } from "./types";
import EditStaffData from "./components/EditStaffData";
import EditStaffSecondaryData from "./components/EditStaffSecondaryData";

const initialStaffMember = (): NewStaffMemberForm => ({
	last_name: "",
	first_name: "",
	email: "",
	password: "",
	repeat_password: "",
	color: "blue",
	roles: []
});

const CreateStaffMember: FC<CreateStaffMemberProps> = ({
	users = [],
	setIsOpen,
	isOpen,
	refetch
}) => {
	const { project, roles, refetchRoles } = useContext(PatflowAppContext);
	const {
		createData,
		updateData,
		loading: dataLoading
	} = useDataHandlerSecure(true);
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState([] as unknown as ErrorMessage[]);
	const [staffMember, setStaffMember] =
		useImmer<NewStaffMemberForm>(initialStaffMember());

	useEffect(() => {
		if (!isOpen) {
			return;
		}
		setStaffMember(initialStaffMember());
	}, [isOpen, setStaffMember]);

	useEffect(() => {
		const errorArray: ErrorMessage[] = [];

		users.forEach((existingUser: PatflowUser) => {
			if (
				existingUser.last_name === staffMember.last_name &&
				existingUser.first_name === staffMember.first_name
			) {
				errorArray.push({
					message: "Dieser Name existiert bereits",
					key: "last_name_group",
					id: "last_name"
				});
			}
		});

		if (!staffMember.first_name) {
			errorArray.push({
				message: "Bitte einen Vornamen angeben",
				key: "first_name",
				id: "first_name"
			});
		}
		if (!staffMember.last_name) {
			errorArray.push({
				message: "Bitte einen Nachnamen angeben",
				key: "last_name",
				id: "last_name"
			});
		}
		if (!staffMember.roles.length) {
			errorArray.push({
				message: "Bitte eine Rolle auswählen",
				key: "role",
				id: "role"
			});
		}
		if (!staffMember.email) {
			errorArray.push({
				message: "Bitte eine E-Mail Adresse angeben",
				key: "email",
				id: "email"
			});
		}
		if (!staffMember.password) {
			errorArray.push({
				message: "Bitte ein Passwort angeben",
				key: "password",
				id: "password"
			});
		}
		if (!staffMember.repeat_password) {
			errorArray.push({
				message: "Bitte das Passwort wiederholen",
				key: "repeat_password",
				id: "repeat_password"
			});
		}
		if (
			staffMember.repeat_password &&
			staffMember.repeat_password !== staffMember.password
		) {
			errorArray.push({
				message: "Die beiden Passwörter stimmen nicht überein",
				key: "repeat_password",
				id: "repeat_password"
			});
		}

		setErrors(errorArray);
	}, [staffMember, users]);

	const createStaffMember = useCallback(async () => {
		const roleId = staffMember.roles[0];
		if (!roleId || !project.objectId) {
			return;
		}

		setLoading(true);

		await createData({
			className: "User",
			updateObject: {
				username: staffMember.email,
				last_name: staffMember.last_name,
				first_name: staffMember.first_name,
				email: staffMember.email,
				password: staffMember.password,
				color: staffMember.color,
				project: {
					__type: "Pointer",
					className: "Project",
					objectId: project.objectId
				},
				projects: [project.objectId],
				settings: {
					time_settings: {
						hours: 40,
						weekdays: 5,
						pause: 30,
						vacation: 30
					},
					is_worker: true
				},
				data: {
					street: "",
					zip: "",
					city: "",
					email: staffMember.email,
					phone: ""
				}
			},
			feedback: "Mitarbeiter erfolgreich erstellt",
			afterSaveHandler: async (data: { objectId: string }) => {
				await updateData({
					className: "Role",
					objectId: roleId,
					updateObject: {
						users: {
							__op: "AddRelation",
							objects: [
								{
									__type: "Pointer",
									className: "_User",
									objectId: data.objectId
								}
							]
						}
					}
				});
				await refetch();
				await refetchRoles();
			}
		});

		setLoading(false);
		setIsOpen(false);
	}, [
		createData,
		updateData,
		project.objectId,
		refetch,
		refetchRoles,
		setIsOpen,
		staffMember
	]);

	const isBusy = loading || dataLoading;

	return (
		<SlideIn
			header="Neuen Mitarbeiter anlegen"
			isOpen={isOpen}
			cancel={() => setIsOpen(false)}
			confirm={createStaffMember}
			disabled={[isBusy, errors.length > 0 || isBusy]}
			loading={isBusy}
			secondaryContent={
				<EditStaffSecondaryData
					staffMember={staffMember}
					setStaffMember={setStaffMember}
				/>
			}
			showSecondaryContent={true}
		>
			<EditStaffData
				staffMember={staffMember}
				setStaffMember={setStaffMember}
				errors={errors}
				roles={roles}
			/>
		</SlideIn>
	);
};

export default CreateStaffMember;

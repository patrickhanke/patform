import {
	PatflowAppContext,
	useDataHandlerSecure,
	useGetDataSecure
} from "@repo/provider";
import { useCallback, useContext, useState, useEffect, useMemo } from "react";
import { useImmer } from "use-immer";
import { ErrorMessage, PatflowUser } from "@repo/types";
import {
	FileObject,
	FileUploader,
	IconButton,
	Select,
	SlideIn,
	SwitchButtons,
	TextInput
} from "@repo/ui";
import styles from "../user_overview.module.scss";
import ContactInformation from "./ContactInformations";
import { StaffMemberContactData } from "../types";
import { normalizeStaffContactData } from "../functions/normalizeStaffContactData";

const site_states = [
	{
		value: "settings",
		label: "Allgemein"
	},
	{
		value: "contact",
		label: "Kontaktdaten"
	}
] as const;

type EditStaffMemberProps = {
	userId: string;
	listUser?: Pick<PatflowUser, "first_name" | "last_name" | "email" | "data">;
};

const EditStaffMember = ({ userId, listUser }: EditStaffMemberProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [siteState, setSiteState] = useState<(typeof site_states)[number]>(
		site_states[0]
	);
	const [loading, setLoading] = useState(false);
	const { roles } = useContext(PatflowAppContext);
	const { updateData } = useDataHandlerSecure(true);
	const [errors] = useState([] as unknown as ErrorMessage[]);
	const [staffMember, setStaffMember] = useImmer<
		Pick<
			PatflowUser,
			"first_name" | "last_name" | "email" | "roles" | "portrait" | "data"
		>
	>({
		first_name: "",
		last_name: "",
		email: "",
		roles: [],
		portrait: undefined as unknown as FileObject,
		data: {} as StaffMemberContactData["data"]
	});

	const userFields = useMemo(
		() =>
			[
				"objectId",
				"first_name",
				"last_name",
				"email",
				"portrait { name url }",
				"role {objectId}",
				"data"
			] as const,
		[]
	);

	const { data: userData, refetch } = useGetDataSecure({
		objectName: "User",
		fields: [...userFields],
		id: userId,
		useMasterKey: true,
		skip: !isOpen
	});

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const source = userData ?? listUser;
		if (!source) {
			return;
		}

		const contact = normalizeStaffContactData(source);

		setStaffMember((draft) => {
			draft.first_name = contact.first_name;
			draft.last_name = contact.last_name;
			draft.email = source.email ?? contact.data.email ?? "";
			draft.data = contact.data;
			if (userData) {
				draft.roles = userData.roles ?? [];
				draft.portrait = userData.portrait;
			}
		});
	}, [userData, listUser, isOpen, setStaffMember]);

	const contactData: Pick<
		StaffMemberContactData,
		"first_name" | "last_name" | "data"
	> = useMemo(
		() => ({
			first_name: staffMember.first_name,
			last_name: staffMember.last_name,
			data: staffMember.data
		}),
		[staffMember.first_name, staffMember.last_name, staffMember.data]
	);

	const openEditor = useCallback(() => {
		setSiteState(site_states[0]);
		setIsOpen(true);
	}, []);

	const handlePortraitUpload = useCallback(
		(uploads: FileObject[]) => {
			const uploaded = uploads.find((file) => file?.url);
			if (!uploaded) {
				return;
			}
			setStaffMember((draft) => {
				draft.portrait = uploaded;
			});
		},
		[setStaffMember]
	);

	const updateUser = useCallback(async () => {
		setLoading(true);
		await updateData({
			className: "User",
			objectId: userId,
			updateObject: {
				first_name: staffMember.first_name,
				last_name: staffMember.last_name,
				email: staffMember.email,
				data: staffMember.data,
				roles: staffMember.roles
			},
			feedback: "Nutzerdaten aktualisiert"
		});
		await refetch();
		setIsOpen(false);
		setLoading(false);
	}, [staffMember, updateData, userId, refetch]);

	return (
		<>
			<IconButton icon="edit" onClick={openEditor} />
			<SlideIn
				header={`Nutzerdaten aktualisieren (${userData?.first_name ?? listUser?.first_name ?? ""} ${userData?.last_name ?? listUser?.last_name ?? ""})`}
				isOpen={isOpen}
				cancel={() => setIsOpen(false)}
				confirm={updateUser}
				preventClickOutside
				errors={errors}
				loading={loading}
			>
				<div className={styles.user_slidein_container}>
					<SwitchButtons
						buttonStates={[...site_states]}
						changeHandler={setSiteState}
						currentStates={siteState}
					/>
					{siteState.value === "settings" && (
						<form>
							<TextInput
								label="E-Mail"
								id="email"
								type="email"
								onChange={(value) =>
									setStaffMember((draft) => {
										draft.email = value;
									})
								}
								defaultValue={staffMember.email}
							/>
							{roles && (
								<Select
									label="Rolle auswählen"
									id="role"
									options={roles.map((role) => ({
										value: role.value,
										label: role.label
									}))}
									value={
										staffMember.roles &&
										roles.find((roleToFind) =>
											staffMember.roles.includes(
												roleToFind.value
											)
										)
									}
									onChange={(value) =>
										setStaffMember((draft) => {
											draft.roles = value.value;
										})
									}
								/>
							)}
							<label>Porträt</label>
							{staffMember.portrait?.url && (
								<img
									src={staffMember.portrait.url}
									alt={staffMember.portrait.name || "Porträt"}
									className={styles.user_portrait_preview}
								/>
							)}
							<FileUploader
								type="image"
								maxFileCount={1}
								className="_User"
								classKey="portrait"
								classId={userId}
								existingFile={
									staffMember.portrait?.name
										? staffMember.portrait
										: undefined
								}
								afterUploadHandler={handlePortraitUpload}
							/>
						</form>
					)}
					{siteState.value === "contact" && (
						<ContactInformation
							data={contactData}
							setData={(newData) => {
								setStaffMember((draft) => {
									const resolved =
										typeof newData === "function"
											? newData(contactData)
											: newData;
									draft.first_name = resolved.first_name;
									draft.last_name = resolved.last_name;
									draft.data = resolved.data;
								});
							}}
						/>
					)}
				</div>
			</SlideIn>
		</>
	);
};

export default EditStaffMember;

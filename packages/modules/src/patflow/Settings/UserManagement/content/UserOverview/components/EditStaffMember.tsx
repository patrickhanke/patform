import {
	generateImagePath,
	PatflowAppContext,
	useAppContext
} from "@repo/provider";
import { useDataHandler } from "@repo/provider";
import { useCallback, useContext, useEffect, useState } from "react";
import { useImmer } from "use-immer";
import styles from "../UserOverview.module.scss";
import clsx from "clsx";
import { useQuery } from "@apollo/client";
import { GET_USER_DISPLAY_DATA } from "@repo/provider";
import { ErrorMessage, Image } from "@repo/types";
import {
	IconButton,
	ImageUploader,
	Select,
	SlideInRight,
	TextInput
} from "@repo/ui";

const EditStaffMember = ({ userId }: { userId: string }) => {
	const { project } = useAppContext();

	const [isOpen, setIsOpen] = useState(false);

	const { roles } = useContext(PatflowAppContext);
	const { updateData } = useDataHandler();

	const [errors, setErrors] = useState([] as unknown as ErrorMessage[]);
	const [staffMember, setStaffMember] = useImmer({
		first_name: "",
		family_name: "",
		email: "",
		role: null,
		portrait: undefined as unknown as Image
	});

	const { refetch } = useQuery(GET_USER_DISPLAY_DATA, {
		variables: {
			id: userId
		},
		onCompleted(data) {
			setStaffMember((draft) => {
				draft.first_name = data.objects.get_User.first_name;
				draft.family_name = data.objects.get_User.family_name;
				draft.email = data.objects.get_User.email;
				draft.role = data.objects.get_User.role.objectId;
				draft.portrait = data.objects.get_User.portrait;
			});
		}
	});

	useEffect(() => {
		const errorArray: ErrorMessage[] = [];

		if (!staffMember.email) {
			errorArray.push({
				message: "Bitte eine E-Mail Adresse angeben",
				key: "email",
				id: "email"
			});
		}

		setErrors(errorArray);
	}, [staffMember]);

	const updateUser = useCallback(async () => {
		await updateData({
			className: "_User",
			objectId: userId,
			updateObject: {
				email: staffMember.email,
				role: {
					__type: "Pointer",
					className: "_Role",
					objectId: staffMember.role
				},
				portrait: staffMember.portrait
			}
		});
		await refetch();
		setIsOpen(false);
	}, [staffMember]);

	return (
		<>
			<IconButton icon="edit" onClick={() => setIsOpen(true)} />
			<SlideInRight
				header="Nutzerdaten aktualisierten"
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				preventClickOutside
			>
				<div className={styles.slidein_container}>
					<form>
						{staffMember.email && (
							<TextInput
								label="E-Mail"
								id={"email"}
								type="email"
								onChange={(value) =>
									setStaffMember((draft) => {
										draft.email = value;
									})
								}
								defaultValue={staffMember.email}
								errors={errors}
							/>
						)}
						{staffMember.role && (
							<Select
								label="Rolle auswählen"
								id="role"
								errors={errors}
								options={roles}
								value={
									staffMember.role &&
									roles &&
									roles.find(
										(roleToFind) =>
											roleToFind.value ===
											staffMember.role
									)
								}
								onChange={(value) =>
									setStaffMember((draft) => {
										draft.role = value.value;
									})
								}
							/>
						)}

						<ImageUploader
							filename={`${staffMember.first_name}_${staffMember.family_name}_${new Date()}_portrait.jpg`}
							path={generateImagePath(
								process.env.APP_NAME as string,
								project.path
							)}
							label="Portrait"
							onChange={(images) => {
								if (
									images[0] &&
									typeof images[0] === "string"
								) {
									setStaffMember((draft) => {
										draft.portrait = images[0] as string;
									});
								}
							}}
							previewImage={staffMember.portrait}
							maxFileCount={1}
						/>
					</form>
					<div className="button_container">
						<button
							className={clsx("full_button", "primary", "md")}
							disabled={errors.length > 0}
							onClick={() => updateUser()}
						>
							Daten aktualisieren
						</button>
						<button
							className={clsx("full_button", "secondary", "md")}
							onClick={() => setIsOpen(false)}
						>
							Abbrechen
						</button>
					</div>
				</div>
			</SlideInRight>
		</>
	);
};

export default EditStaffMember;

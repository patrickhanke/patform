import { PatflowAppContext } from "@repo/provider";
import { useDataHandler, useGetData } from "@repo/provider";
import { useCallback, useContext, useState, useEffect } from "react";
import { useImmer } from "use-immer";
import clsx from "clsx";
import { ErrorMessage } from "@repo/types";
import {
	FileObject,
	FileUploader,
	IconButton,
	Select,
	SlideInRight,
	TextInput
} from "@repo/ui";
import "../user_overview.scss";

const EditStaffMember = ({ userId }: { userId: string }) => {
	const [isOpen, setIsOpen] = useState(false);

	const { roles } = useContext(PatflowAppContext);
	const { updateData } = useDataHandler();

	const [errors] = useState([] as unknown as ErrorMessage[]);
	const [staffMember, setStaffMember] = useImmer({
		first_name: "",
		last_name: "",
		email: "",
		role: null,
		portrait: undefined as unknown as FileObject
	});

	const { data: userData, refetch } = useGetData({
		objectName: "User",
		fields: [
			"objectId",
			"first_name",
			"last_name",
			"email",
			"portrait { name url }",
			"role {objectId}"
		],
		id: userId
	});

	useEffect(() => {
		if (userData) {
			setStaffMember((draft) => {
				draft.first_name = userData.first_name;
				draft.last_name = userData.last_name;
				draft.email = userData.email;
				draft.role = userData.role?.objectId;
				draft.portrait = userData.portrait;
			});
		}
	}, [userData]);

	// useEffect(() => {
	// 	const errorArray: ErrorMessage[] = [];

	// 	if (!staffMember.email) {
	// 		errorArray.push({
	// 			message: "Bitte eine E-Mail Adresse angeben",
	// 			key: "email",
	// 			id: "email"
	// 		});
	// 	}

	// 	setErrors(errorArray);
	// }, [staffMember]);

	const updateUser = useCallback(async () => {
		await updateData({
			className: "User",
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
				header="Nutzerdaten aktualisieren"
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				preventClickOutside
			>
				<div className={"slidein_container"}>
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
							/>
						)}
						{staffMember.role && (
							<Select
								label="Rolle auswählen"
								id="role"
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

						<FileUploader
							inline={true}
							type="image"
							className="User"
							classKey="portrait"
							classId={userId}
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

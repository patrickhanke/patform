import { FC, useState } from "react";
import { IconButton, SlideIn } from "@repo/ui";
import { useDataHandler } from "@repo/provider";
import { ErrorMessage, PatstoreUser } from "@repo/types";

const EditUser: FC<{ user: PatstoreUser }> = ({ user }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const { updateData } = useDataHandler(true, false);

	const errors: ErrorMessage[] = [];
	if (password && repeatPassword && password !== repeatPassword) {
		errors.push({
			id: "repeat_password",
			key: "repeat_password",
			message: "Die beiden Passwörter stimmen nicht überein"
		});
	}

	const canSave =
		password.length > 0 &&
		repeatPassword.length > 0 &&
		password === repeatPassword &&
		!loading;

	const close = () => {
		setIsOpen(false);
		setPassword("");
		setRepeatPassword("");
	};

	return (
		<>
			<IconButton
				icon="edit"
				tooltip="Benutzer bearbeiten"
				onClick={() => setIsOpen(true)}
			/>
			<SlideIn
				header="Passwort ändern"
				isOpen={isOpen}
				cancel={close}
				confirm={async () => {
					if (!canSave) return;
					setLoading(true);
					let failed = false;
					try {
						await updateData({
							className: "User",
							objectId: user.objectId,
							updateObject: {
								password
							},
							feedback: "Passwort aktualisiert",
							onError: () => {
								failed = true;
							}
						});
						if (!failed) close();
					} finally {
						setLoading(false);
					}
				}}
				disabled={[loading, !canSave]}
				errors={errors}
				confirmText="Passwort setzen"
				loading={loading}
				preventClickOutside
			>
				<div className="flex col gap-md">
					<p>
						Neues Passwort für {user.label || user.username} setzen.
						Das bisherige Passwort wird nicht angezeigt.
					</p>
					<label htmlFor={`password-${user.objectId}`}>
						Neues Passwort
						<br />
						<input
							id={`password-${user.objectId}`}
							type="password"
							autoComplete="new-password"
							value={password}
							onChange={(event) =>
								setPassword(event.target.value)
							}
						/>
					</label>
					<label htmlFor={`repeat-password-${user.objectId}`}>
						Passwort wiederholen
						<br />
						<input
							id={`repeat-password-${user.objectId}`}
							type="password"
							autoComplete="new-password"
							value={repeatPassword}
							onChange={(event) =>
								setRepeatPassword(event.target.value)
							}
						/>
					</label>
				</div>
			</SlideIn>
		</>
	);
};

export default EditUser;

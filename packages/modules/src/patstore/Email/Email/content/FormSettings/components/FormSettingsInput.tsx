import { FC } from "react";
import { FormSettingsInputProps } from "../types";

const FormSettingsInput: FC<FormSettingsInputProps> = ({
	settings,
	updateSettings
}) => {
	return (
		<div>
			<input
				content={settings.response_text || ""}
				onChange={(e) =>
					updateSettings({
						...settings,
						sender_email: e.target.value
					})
				}
				defaultValue={settings.sender_email}
				placeholder="E-Mail Sender"
				disabled={settings["response"] === false}
			/>
		</div>
	);
};

export default FormSettingsInput;

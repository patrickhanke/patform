import { FC } from "react";
import { Editor } from "@repo/ui";
import { FormSettingsTextProps } from "../types";

const FormSettingsText: FC<FormSettingsTextProps> = ({
	settings,
	updateSettings
}) => {
	return (
		<div>
			<Editor
				content={settings.response_text || ""}
				onChange={(value) =>
					updateSettings({
						...settings,
						response_text: value
					})
				}
				placeholder="Benachrichtigungstext"
				label="Benachrichtigungstext"
				disabled={settings["response"] === false}
			/>
		</div>
	);
};

export default FormSettingsText;

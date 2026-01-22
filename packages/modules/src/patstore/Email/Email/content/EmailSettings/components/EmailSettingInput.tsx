import { FC } from "react";
import { TextInput } from "@repo/ui";
import { EmailSettingsInputProps } from "../types";

const EmailSettingInput: FC<EmailSettingsInputProps> = ({
	settingsKey,
	loading,
	settings,
	updateSettings,
	disabled
}) => {
	return (
		<TextInput
			id={settingsKey}
			defaultValue={settings[settingsKey] as string}
			onChange={(value) =>
				updateSettings({
					...settings,
					[settingsKey]: value
				})
			}
			disabled={loading || disabled}
			placeholder=""
		/>
	);
};

export default EmailSettingInput;

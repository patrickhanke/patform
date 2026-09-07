import { FC } from "react";
import { EmailSettingsInputProps } from "../types";

const EmailSettingInput: FC<EmailSettingsInputProps> = ({
	settingsKey,
	settings,
	updateSettings
}) => {
	return (
		<input
			id={settingsKey}
			value={settings[settingsKey] as string}
			onChange={(e) =>
				updateSettings({
					...settings,
					[settingsKey]: e.target.value
				})
			}
			placeholder=""
		/>
	);
};

export default EmailSettingInput;

import { FC } from "react";
import { StatelessToggle } from "@repo/ui";
import { EmailSettingsToggleProps } from "../types";

const EmailSettingToggle: FC<EmailSettingsToggleProps> = ({
	settingsKey,
	loading,
	settings,
	updateSettings
}) => {
	return (
		<StatelessToggle
			value={settings[settingsKey] as boolean}
			onChange={(value) =>
				updateSettings({
					...settings,
					[settingsKey]: value
				})
			}
			disabled={loading}
		/>
	);
};

export default EmailSettingToggle;

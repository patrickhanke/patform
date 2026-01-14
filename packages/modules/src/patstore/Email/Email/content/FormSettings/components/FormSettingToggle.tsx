import { FC } from "react";
import { StatelessToggle } from "@repo/ui";
import { FormSettingsToggleProps } from "../types";

const FormSettingToggle: FC<FormSettingsToggleProps> = ({
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

export default FormSettingToggle;

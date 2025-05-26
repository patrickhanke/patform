import { FC } from "react";
import { StatelessToggle } from "@repo/ui";
import { FormEmailSettingsToggleProps } from "../types";
import { get } from "lodash-es";

const FormEmailSettingToggle: FC<FormEmailSettingsToggleProps> = ({
	settingsKey,
	loading,
	settings,
	updateSettings
}) => {
	return (
		<StatelessToggle
			value={get(settings, settingsKey, false) as boolean}
			onChange={(value) => updateSettings(settingsKey, value)}
			disabled={loading}
		/>
	);
};

export default FormEmailSettingToggle;

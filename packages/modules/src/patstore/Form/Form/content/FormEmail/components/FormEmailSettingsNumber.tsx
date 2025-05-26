import { FC } from "react";
import { FormEmailSettingsNumberProps } from "../types";
import { get } from "lodash-es";
import { useDebounceCallback } from "usehooks-ts";

const FormEmailSettingsNumber: FC<FormEmailSettingsNumberProps> = ({
	settingsKey,
	settings,
	updateSettings
}) => {
	const onChange = useDebounceCallback(updateSettings, 1000);

	return (
		<div>
			<input
				defaultValue={
					get(settings, settingsKey, "") as unknown as number
				}
				onChange={(e) => onChange(settingsKey, Number(e.target.value))}
				// placeholder="Benachrichtigungstext"
				disabled={settings["response"] === false}
				type={"number"}
				min={0}
				step={1}
				max={999}
			/>
		</div>
	);
};

export default FormEmailSettingsNumber;

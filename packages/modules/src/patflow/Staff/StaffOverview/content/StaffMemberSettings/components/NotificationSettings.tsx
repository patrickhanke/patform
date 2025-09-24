import React, { useMemo } from "react";
import { Form } from "@repo/ui";
import notification_settings_labels from "../constants/notification_settings_labels";
import { ChangeUserSettingsProps } from "../types";

const NotificationSettings: React.FC<ChangeUserSettingsProps> = ({
	data,
	setData
}) => {
	const fields = useMemo(() => {
		const settingsArray = [];
		if (data && data.notification_settings) {
			const settings = data.notification_settings;
			for (const [key, value] of Object.entries(settings)) {
				console.log(value);

				settingsArray.push({
					type: "toggle",
					id: key,
					name: key,
					initialValue: value,
					label: notification_settings_labels[
						key as keyof typeof notification_settings_labels
					],
					value: value
				});
			}
		}
		return settingsArray;
	}, [data]);

	return (
		<div>
			<h4>Nachrichteneinstellungen</h4>
			<Form
				fields={fields}
				data={data}
				formSubmitHandler={async (values) => {
					setData({ ...data, ...values });
				}}
				useWithDebounce
				isHorizontal
			/>
		</div>
	);
};

export default NotificationSettings;

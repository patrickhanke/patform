import { useCallback, useEffect, useState } from "react";
import { useDataHandler, useGetData } from "@repo/provider";
import { EmailClass } from "@repo/types";
import email_settings from "./constants/email_settings";
import EmailSettingToggle from "./components/EmailSettingToggle";
import EmailSettingInput from "./components/EmailSettingInput";
import EmailListSelector from "./components/EmailListSelector";
import initial_settings from "./constants/initial_settings";

const EmailSettings = ({ emailId }: { emailId: string }) => {
	const { updateData } = useDataHandler();
	const [settings, setSettings] = useState<EmailClass["settings"]>();
	const { data, refetch } = useGetData({
		objectName: "Email",
		fields: ["settings", "objectId"],
		id: emailId
	});

	const [loading, setLoading] = useState(false);

	console.log("settings", data);

	useEffect(() => {
		if (data && !settings) {
			setSettings(data.settings || initial_settings);
		}
	}, [data, settings]);

	const updateSettingsHandler = useCallback(
		async (st: EmailClass["settings"]) => {
			const updateObject = {
				settings: {
					...settings,
					...st
				}
			};
			await updateData({
				className: "Email",
				objectId: emailId,
				updateObject,
				feedback: "E-Mail Einstellungen aktualisiert"
			});

			await refetch();
			setLoading(false);
		},
		[settings, data, loading]
	);

	if (!settings) {
		return null;
	}

	return (
		<div className="flex col a-st gap-sm">
			<EmailListSelector
				settings={settings}
				updateSettings={updateSettingsHandler}
				loading={loading}
			/>

			{(
				Object.keys(email_settings) as Array<
					keyof typeof email_settings
				>
			).map((key) => {
				console.log("key", key);
				const setting = email_settings[key];
				console.log("setting", setting);
				const isBoolean = typeof setting.value === "boolean";
				const isDisabled = false;

				return (
					<div key={key} className="flex row a-ce j-sb gap-sm">
						<div className="flex col a-st">
							<label>{setting.label}</label>
							<p>{setting.description}</p>
						</div>
						{isBoolean ? (
							<EmailSettingToggle
								settingsKey={
									key as keyof EmailClass["settings"]
								}
								loading={loading}
								settings={settings}
								updateSettings={updateSettingsHandler}
							/>
						) : (
							<EmailSettingInput
								settingsKey={
									key as keyof EmailClass["settings"]
								}
								loading={loading}
								settings={settings}
								updateSettings={updateSettingsHandler}
								disabled={isDisabled}
							/>
						)}
					</div>
				);
			})}
		</div>
	);
};

export default EmailSettings;

import { FC, useCallback, useEffect, useState } from "react";
import { useDataHandler, useGetData } from "@repo/provider";
import { EmailClass } from "@repo/types";
import email_settings from "./constants/email_settings";
import EmailSettingToggle from "./components/EmailSettingToggle";
import EmailSettingInput from "./components/EmailSettingInput";
import EmailListSelector from "./components/EmailListSelector";
import initial_settings from "./constants/initial_settings";
import { EmailSettingsProps } from "./types";

const EmailSettings: FC<EmailSettingsProps> = ({
	emailId,
	recipients,
	suppressedRecipients,
	onSettingsSaved
}) => {
	const { updateData } = useDataHandler();
	const [settings, setSettings] = useState<EmailClass["settings"]>();
	const { data, refetch } = useGetData({
		objectName: "Email",
		fields: ["settings", "objectId"],
		id: emailId
	});

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (data && !settings) {
			setSettings(data.settings || initial_settings);
		}
	}, [data, settings]);

	const updateSettingsHandler = useCallback(
		async (st: EmailClass["settings"]) => {
			setLoading(true);
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
			await onSettingsSaved();
			setLoading(false);
		},
		[settings, emailId, updateData, refetch, onSettingsSaved]
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
				recipients={recipients}
				suppressedRecipients={suppressedRecipients}
			/>

			{(
				Object.keys(email_settings) as Array<
					keyof typeof email_settings
				>
			).map((key) => {
				const setting = email_settings[key];
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

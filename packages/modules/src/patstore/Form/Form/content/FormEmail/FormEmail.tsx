import { FC, useCallback, useEffect, useState } from "react";
import { FormEmailProps } from "./types";
import { FormClass } from "@repo/types";
import form_email_settings from "./constants/form_email_settings";
import { generateGraphQLQuery, useDataHandler } from "@repo/provider";
import { useQuery } from "@apollo/client";
import FormEmailSettingToggle from "./components/FormEmailSettingToggle";
import FormEmailSettingsText from "./components/FormEmailSettingsText";
import FormEmailSettingsNumber from "./components/FormEmailSettingsNumber";
import { cloneDeep } from "@apollo/client/utilities";
import { set } from "lodash-es";
import TestEmail from "./components/TestEmail";

const FormEmail: FC<FormEmailProps> = ({ formId }) => {
	const { updateData } = useDataHandler();
	const [testEmail, setTestEmail] = useState<boolean>(false);
	const [settings, setSettings] = useState<
		FormClass["settings"] | undefined
	>();
	const { data, refetch } = useQuery(
		generateGraphQLQuery({
			type: "get",
			objectName: "Form",
			fields: ["settings", "objectId"]
		}),
		{
			variables: {
				id: formId
			}
		}
	);

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (data) {
			setSettings(data.objects.getForm.settings);
		}
	}, [data]);

	const updateSettingsHandler = useCallback(
		async (
			key: keyof FormClass["settings"],
			value: string | number | boolean
		) => {
			if (!settings || loading) {
				return;
			}

			const settingsCopy: FormClass["settings"] = cloneDeep(settings);

			set(settingsCopy, key, value);

			await updateData({
				className: "Form",
				objectId: formId,
				updateObject: {
					objectId: formId,
					settings: settingsCopy
				},
				feedback: "Einstellungen aktualisiert"
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
			{(
				Object.keys(form_email_settings) as Array<
					keyof typeof form_email_settings
				>
			).map((key) => {
				const setting = form_email_settings[key];

				if (
					key === "server.secure" ||
					key === "server.requireTLS" ||
					key === "server.auth"
				) {
					return (
						<div key={key} className="flex col a-st gap-sm w-100">
							<div
								key={key}
								className="flex row a-ce j-sb gap-sm"
							>
								<div className="flex col a-st">
									<label>{setting.label}</label>
									<p>{setting.description}</p>
								</div>
								<FormEmailSettingToggle
									settingsKey={
										key as keyof FormClass["settings"]
									}
									loading={loading}
									settings={settings}
									updateSettings={updateSettingsHandler}
								/>
							</div>
						</div>
					);
				} else if (
					key === "server.from" ||
					key === "server.password" ||
					key === "server.host"
				) {
					return (
						<div key={key} className="flex row a-ce j-sb gap-sm">
							<div className="flex col a-st">
								<label>{setting.label}</label>
								<p>{setting.description}</p>
							</div>
							<FormEmailSettingsText
								settingsKey={key as keyof FormClass["settings"]}
								settings={settings}
								updateSettings={updateSettingsHandler}
								isPassword={
									key === "server.password" ? true : false
								}
							/>
						</div>
					);
				} else if (key === "server.port") {
					return (
						<div key={key} className="flex row a-ce j-sb gap-sm">
							<div className="flex col a-st">
								<label>{setting.label}</label>
								<p>{setting.description}</p>
							</div>
							<FormEmailSettingsNumber
								settingsKey={key as keyof FormClass["settings"]}
								settings={settings}
								updateSettings={updateSettingsHandler}
							/>
						</div>
					);
				}
			})}
			<button
				className="full_button lg primary"
				onClick={() => refetch()}
				disabled={loading}
			>
				Test E-Mail senden
			</button>
			<TestEmail testEmail={testEmail} setTestEmail={setTestEmail} />
		</div>
	);
};

export default FormEmail;

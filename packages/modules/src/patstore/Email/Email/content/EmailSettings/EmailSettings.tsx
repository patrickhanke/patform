import { FC } from "react";
import { EmailTemplate } from "@repo/types";
import EmailSettingInput from "./components/EmailSettingInput";
import EmailListSelector from "./components/EmailListSelector";
import RecipientCount from "./components/RecipientCount";
import { EmailSettingsProps } from "./types";
import { Divider, usePageData } from "@repo/ui";

const INITIAL_SETTINGS = {
	subject: "",
	recipient_list: undefined
} as const;

const EmailSettings: FC<EmailSettingsProps> = ({
	email,
	recipients,
	suppressedRecipients,
	settings,
	recipientsLoading
}) => {
	const { data, setData } = usePageData<EmailTemplate["settings"]>(
		{
			objectId: email?.objectId,
			initialData: {
				...(settings ?? INITIAL_SETTINGS)
			}
		},
		{
			className: "Email",
			message: "E-Mail Einstellungen aktualisiert",
			updateObject: (currentData) => ({
				settings: {
					...currentData
				}
			})
		}
	);

	return (
		<div className="flex col a-st gap-sm">
			<Divider showLine />
			<h3>Einstellungen</h3>
			<EmailListSelector
				settings={data || settings}
				updateSettings={(value) =>
					setData("recipient_list", value.recipient_list)
				}
			/>
			<div className="flex row gap-md a-ce j-sb">
				<div style={{ minWidth: "180px", fontWeight: "600" }}>
					Anzahl Empfänger:
				</div>
				<div>
					<RecipientCount
						email={email}
						recipients={recipients}
						suppressedRecipients={suppressedRecipients}
						loading={recipientsLoading}
					/>
				</div>
			</div>
			<div className="flex row a-ce j-sb gap-sm">
				<div className="flex col a-st">
					<label>Betreff</label>
					<p>Der Betreff der E-Mail.</p>
				</div>
				<EmailSettingInput
					settingsKey="subject"
					settings={data || settings}
					updateSettings={(value) =>
						setData("subject", value.subject)
					}
				/>
			</div>
			<div className="flex row gap-md a-ce j-sb">
				<div style={{ minWidth: "180px", fontWeight: "600" }}>
					<label>Anhänge:</label>
				</div>
				<div>
					<p>{email?.attachments?.length || 0}</p>
				</div>
			</div>
		</div>
	);
};

export default EmailSettings;

import { EmailClass } from "@repo/types";
import { EmailRecipient } from "../../types";

export type EmailSettingsProps = {
	emailId: string;
	recipients: EmailRecipient[];
	suppressedRecipients: EmailRecipient[];
	onSettingsSaved: () => Promise<void>;
};

export type EmailSettingsToggleProps = {
	settingsKey: keyof EmailClass["settings"];
	loading: boolean;
	settings: EmailClass["settings"];
	updateSettings: (settings: EmailClass["settings"]) => Promise<void>;
};

export type EmailSettingsInputProps = {
	settingsKey: keyof EmailClass["settings"];
	loading: boolean;
	settings: EmailClass["settings"];
	updateSettings: (settings: EmailClass["settings"]) => Promise<void>;
	disabled?: boolean;
};

export interface EmailListSelectorProps {
	settings: EmailClass["settings"];
	updateSettings: (settings: EmailClass["settings"]) => Promise<void>;
	loading: boolean;
	recipients: EmailRecipient[];
	suppressedRecipients: EmailRecipient[];
}

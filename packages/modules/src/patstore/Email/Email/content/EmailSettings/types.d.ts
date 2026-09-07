import { EmailTemplate } from "@repo/types";
import { EmailRecipient } from "../../types";

export type EmailSettingsProps = {
	email: EmailTemplate;
	recipients: EmailRecipient[];
	suppressedRecipients: EmailRecipient[];
	settings: EmailTemplate["settings"];
	recipientsLoading?: boolean;
};

export type EmailSettingsInputProps = {
	settingsKey: keyof EmailTemplate["settings"];
	settings: EmailTemplate["settings"];
	updateSettings: (settings: EmailTemplate["settings"]) => void;
};

export type EmailListSelectorProps = {
	settings: EmailTemplate["settings"];
	updateSettings: (settings: EmailTemplate["settings"]) => void;
};

export type EmailSettingsToggleProps = {
	settingsKey: keyof EmailTemplate["settings"];
	settings: EmailTemplate["settings"];
	updateSettings: (settings: EmailTemplate["settings"]) => void;
};

export type RecipientCountProps = {
	email: EmailTemplate;
	recipients: EmailRecipient[];
	suppressedRecipients: EmailRecipient[];
	loading?: boolean;
};

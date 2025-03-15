import { FormClass, Recipient } from "@repo/types";

export type FormRecipientsProps = {
  settingsKey: "recipients";
  settings: FormClass["settings"];
  updateSettings: (T: FormClass["settings"]) => void;
};

export type FormRecipientProps = {
  initialRecipient: Recipient;
  updateRecipients: (T: Recipient) => void;
  isLast: boolean;
  disabled: booelean;
};

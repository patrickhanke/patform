import React, { useCallback, useState } from "react";
import FormReceipient from "./components/FormRecipient";
import { CreateButton } from "@repo/ui";
import { v4 } from "uuid";
import { FormRecipientsProps } from "./types";
import { Recipient } from "@repo/types";
import { cloneDeep } from "lodash-es";
import "./styles.scss";

const FormRecipients: React.FC<FormRecipientsProps> = ({
  settingsKey,
  settings,
  updateSettings,
}) => {
  const [recipients, setRecipients] = useState<Recipient[]>(
    settings[settingsKey] || [],
  );

  const updateRecipients = useCallback(
    (recipient: Recipient) => {
      let recipientsCopy = cloneDeep(recipients);
      const index = recipients.findIndex((rec) => rec.id === recipient.id);
      if (index !== -1) {
        recipientsCopy[index] = recipient;
        setRecipients(recipientsCopy);
      }

      updateSettings({
        ...settings,
        [settingsKey]: recipientsCopy,
      });
    },
    [recipients],
  );

  const isDisabled = () => {
    let disabled = false;
    if (settings["notification"] === false) {
      disabled = true;
    }
    if (recipients.length === 5) {
      disabled = true;
    }
    return disabled;
  };

  return (
    <div
      className="content_element flex col gap-sm form_recipients_container"
      data-disabled={isDisabled()}
    >
      <h3>Empfänger</h3>
      {recipients.map((recipient, index) => (
        <FormReceipient
          disabled={isDisabled()}
          updateRecipients={updateRecipients}
          key={recipient.id}
          initialRecipient={recipient}
          isLast={recipients.length === index + 1}
        />
      ))}
      <CreateButton
        size="small"
        text="Empfänger hinzufügen"
        disabled={isDisabled()}
        onClick={() => {
          const recipientsCopy = [...recipients];
          recipientsCopy.push({
            email: "",
            name: "",
            id: v4(),
          });
          setRecipients(recipientsCopy);
        }}
      />
    </div>
  );
};

export default FormRecipients;

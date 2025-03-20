import { FC, useCallback, useState } from "react";
import { FormRecipientProps } from "../types";
import { Divider, TextInput } from "@repo/ui";

const FormRecipient: FC<FormRecipientProps> = ({
  disabled,
  updateRecipients,
  initialRecipient,
  isLast,
}) => {
  const [recipient, setRecipient] = useState(initialRecipient);
  const [edit, setEdit] = useState(false);

  const saveRecipient = useCallback(() => {
    updateRecipients(recipient);
    setEdit(false);
  }, [recipient]);

  return (
    <>
      <div className="flex row a-ce j-sb">
        {edit ? (
          <>
            <div className="flex col">
              <TextInput
                width="180px"
                id="name"
                label="Name"
                defaultValue={recipient.name}
                onChange={(value) =>
                  setRecipient({ ...recipient, name: value })
                }
              />
            </div>
            <div className="flex col">
              <TextInput
                width="180px"
                id="email"
                label="E-Mail"
                defaultValue={recipient.email}
                onChange={(value) =>
                  setRecipient({ ...recipient, email: value })
                }
              />
            </div>
            <button
              disabled={disabled}
              className="full_button sm primary"
              onClick={() => saveRecipient()}
            >
              Speichern
            </button>
          </>
        ) : (
          <>
            <div className="flex col" style={{ width: "180px" }}>
              <label>Name</label>
              <p>{recipient.name || "-"}</p>
            </div>
            <div className="flex col" style={{ width: "180px" }}>
              <label>E-Mail</label>
              <p>{recipient.email || "-"}</p>
            </div>
            <button
              disabled={disabled}
              className="full_button sm primary"
              onClick={() => setEdit(true)}
            >
              Bearbeiten
            </button>
          </>
        )}
      </div>
      {!isLast && <Divider size="small" showLine />}
    </>
  );
};

export default FormRecipient;

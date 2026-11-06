import { FC, useCallback, useEffect, useState } from "react";
import * as yup from "yup";

import { Modal, TextInput } from "@repo/ui";
import { PasswordFormProps } from "../types";
import { ErrorMessage, Response } from "@repo/types";

const PasswordForm: FC<PasswordFormProps> = ({
  passwordReset,
  setPasswordReset,
  projectId,
}) => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<ErrorMessage[]>([]);
  const [response, setResponse] = useState<Response | undefined>();

  const submitHandler = useCallback(async () => {
    const errorArray: ErrorMessage[] = [];
    let schema = yup.object().shape({
      email: yup.string().email().required(),
    });

    await schema.validate({ email: email }).catch((errors) => {
      errorArray.push({
        message: "Bitte geben Sie eine gültige E-Mail Adresse an",
        id: errors.path,
        key: errors.path,
      });
    });

    if (errorArray.length > 0) {
      setErrors(errorArray);
      return;
    }

    try {
      const response = await fetch("/api/password_reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          projectId,
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.error || data.success === false) {
        setResponse(undefined);
        setErrors([
          {
            message:
              data.error ||
              data.message ||
              "Der Passwort-Reset konnte nicht gesendet werden.",
            id: "email",
            key: "email",
          },
        ]);
        return;
      }

      setErrors([]);
      setResponse(data);
    } catch {
      setErrors([
        {
          message: "Der Passwort-Reset konnte nicht gesendet werden.",
          id: "email",
          key: "email",
        },
      ]);
    }
  }, [email, projectId]);

  useEffect(() => {
    if (response && response.success === true) {
      setTimeout(() => {
        setPasswordReset(false);
      }, 2000);
    }
  }, [response]);

  return (
    passwordReset && (
      <Modal
        header="Passwort zurücksetzen"
        isOpen={passwordReset}
        confirmButtonHandler={() => submitHandler()}
        cancelButtonHandler={() => setPasswordReset(false)}
        errors={errors}
        confirmButtonText="Link anfordern"
        buttonDisabled={[false, errors.length > 0]}
      >
        <p>
          Geben Sie eine E-Mail Adresse an, um einen Passwort-Reset Link zu
          erhalten.
        </p>
        <TextInput
          label="E-Mail Adresse"
          id="email"
          defaultValue={email}
          onChange={(value) => {
            if (errors.length > 0) {
              setErrors([]);
            }
            if (response) {
              setResponse(undefined);
            }
            setEmail(value);
          }}
        />
        {response && response.message && (
          <p
            className={
              response.success === false ? "error_message" : "success_message"
            }
          >
            {response.message}
          </p>
        )}
      </Modal>
    )
  );
};

export default PasswordForm;

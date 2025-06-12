import { FC, useCallback, useEffect, useState } from "react";
import { axiosclient, compileAxiosError } from "@repo/provider";
import * as yup from "yup";

import { Modal, TextInput } from "@repo/ui";
import { PasswordFormProps } from "../types";
import { ErrorMessage, Response } from "@repo/types";

const PasswordForm: FC<PasswordFormProps> = ({
  passwordReset,
  setPasswordReset,
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
        message: "Bitte geben Sie eine gültie E-Mail Adresse an",
        id: errors.path,
        key: errors.path,
      });
    });

    if (errorArray.length === 0) {
      const response = await axiosclient()
        .post("functions/send-password-reset", { email })
        .then((response) => {
          return response.data.result;
        })
        .catch((error) => {
          return compileAxiosError(error);
        });
      setResponse(response);
    }
    setErrors(errorArray);
  }, [email]);

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

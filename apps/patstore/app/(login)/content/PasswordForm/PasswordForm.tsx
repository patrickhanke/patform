"use client";

import React, { useState } from "react";
import { axiosclient, compileAxiosError } from "@repo/provider";
import { useFormik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";

const SignupSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Passwort muss mindestens 8 Zeichen lang sein")
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&_*])/,
      "Passwort muss einen Großbuchstaben, eine Zahl und ein Sonderzeichen enthalten"
    )
    .required("Pflichtfeld"),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref("password"), undefined],
    "Passwörter müssen übereinstimmen"
  ),
});

const PasswordForm = ({
  email,
  userId,
  passwordKey,
}: {
  email: string;
  userId: string;
  passwordKey: string;
}) => {
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    validationSchema: SignupSchema,
    initialValues: {
      username: "",
      password: "",
      passwordConfirmation: "",
    },
    onSubmit: async (values) => {
      setDisabled(true);

      const response = await axiosclient()
        .post("functions/change-user-password", {
          user_id: userId,
          key: passwordKey,
          password: values.password,
        })
        .then((response) => {
          return response.data.result;
        })
        .catch((error) => {
          setDisabled(false);
          return compileAxiosError(error);
        });

      if (response && response.success === true) {
        setSuccess(true);
      } else if (response && response.success === false) {
        setError(response.message);
        // setDisabled(false);
      } else {
        setDisabled(false);
      }
    },
  });

  return success ? (
    <>
      <p>
        Ihr Passwort wurde erfolgreich geändert. Sie können sich jetzt wieder
        einloggen.
      </p>
      <button
        className="full_button md primary"
        onClick={() => (window.location.href = "/login")}
      >
        Zum Login
      </button>
    </>
  ) : (
    <div>
      <form onSubmit={formik.handleSubmit} className={"login_form_container"}>
        <div>
          <label>E.Mail Adresse</label>
          <p>{email}</p>
        </div>
        <div>
          <label htmlFor="password">Passwort</label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            className={clsx(formik.errors.password && "error")}
          />
          <div>
            {formik.errors.password && (
              <div className="error_message">{formik.errors.password}</div>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="passwordConfirmation">Passwort bestätigen</label>
          <input
            id="passwordConfirmation"
            name="passwordConfirmation"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.passwordConfirmation}
            className={clsx(formik.errors.passwordConfirmation && "error")}
          />
          <div>
            {formik.errors.passwordConfirmation && (
              <div className="error_message">
                {formik.errors.passwordConfirmation}
              </div>
            )}
          </div>
        </div>
        <button
          className="full_button primary md"
          type="submit"
          disabled={disabled}
        >
          Passwort ändern
        </button>
        {error && <p className="error_message">{error}</p>}
      </form>
    </div>
  );
};

export default PasswordForm;

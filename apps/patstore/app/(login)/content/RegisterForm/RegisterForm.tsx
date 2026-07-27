"use client";

import React, { useCallback, useRef, useState } from "react";
import axios from "axios";
import { Module, PatstoreProject } from "@repo/types";
import { Form, getDatabaseDefaultFields, IconButton } from "@repo/ui";
import { registerUser } from "./registerUser";

const RegisterForm = ({
	email,
	project,
	module,
	invitationKey,
}: {
	email: string;
	project: PatstoreProject;
	invitationKey: string;
	module: Module;
}) => {
	const [disabled, setDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
  const [formValues, setFormValues] = useState<FormikValues>({});
	const formContainerRef = useRef<HTMLDivElement>(null);

	const axiosclient = axios.create({
		baseURL: process.env.SASHIDO_API_URL,
		headers: {
			"X-Parse-Application-Id": process.env.SASHIDO_APP_ID,
			"X-Parse-REST-API-Key": process.env.SASHIDO_REST_KEY,
		},
	});

	const formFields = [
		...getDatabaseDefaultFields(module.fields),
		{
			id: "password",
			name: "password",
			type: "password",
			label: "Passwort *",
			validation: {
				validate: true,
			},
		},
		{
			id: "password_confirmation",
			name: "password_confirmation",
			type: "password_confirmation",
			label: "Passwort bestätigen *",
			validation: {
				validate: true,
			},
		},
		{
			id: "accept_terms",
			name: "accept_terms",
			type: "checkbox",
			label: (
				<>
					<span>
						Ich akzeptiere die {" "}
						<a
							href="https://www.patwork.net/datenschutz"
							target="_blank"
						>
							Datenschutzbestimmungen
						</a>
					</span>
				</>
			),
			validation: {
				validate: true,
				required: "Die Nutzungsbedingungen müssen akzeptiert werden.",
			},
		},
	];

	const submitHandler = useCallback(
		async () => {
      const values = formValues;
			setLoading(true);
			setError("");

      if (!values) {
        return null;
      }

			const result = await registerUser(axiosclient, {
				email,
				projectId: project.objectId,
				invitationKey,
				values,
			});

			if (result.status === "success") {
				setSuccess(true);
			} else {
				setError(result.message);
			}

			setLoading(false);
		},
		[email, project.objectId, invitationKey, axiosclient],
	);

	const handleRegisterClick = () => {
		formContainerRef.current?.querySelector("form")?.requestSubmit();
	};

	return success ? (
		<p>
			Sie haben sich erfolgreich für das Projekt {project.name}{" "}
			registriert. Sie können sich jetzt{" "}
			<a href={`https://store.patwork.net/login/${project.path}`}>
				hier
			</a>{" "}
			einloggen.
		</p>
	) : (
		<div>
			<div>
				<label>E-Mail Adresse</label>
				<p>{email}</p>
			</div>
			<div ref={formContainerRef}>
				<Form
					fields={formFields}
					formSubmitHandler={values => setFormValues(values)}
					formValidationHandler={(isValid) => setDisabled(!isValid)}
          useWithDebounce
				/>
			</div>
			{error ? <p className="error_message">{error}</p> : null}
			<IconButton
				icon={"login"}
				text="Registrieren"
				onClick={submitHandler}
				disabled={disabled}
				loading={loading}
			/>
		</div>
	);
};

export default RegisterForm;

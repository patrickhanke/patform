"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import PasswordForm from "./components/PasswordForm";
import { Button } from "@chakra-ui/react";


const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Ungültiges E-Mail Format")
    .required("Eine E-Mail Adresse muss angegeben werden"),
  password: Yup.string().required("Ein Passwort muss eingegeben werden"),
});

const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [passwordReset, setPasswordReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    validationSchema: LoginSchema,
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        });
        const data = (await response.json().catch(() => ({}))) as {
          error?: string;
        };

        if (!response.ok) {
          setError(data.error || "Das Einloggen ist leider fehlgeschlagen");
          return;
        }

        router.push("/");
        router.refresh();
      } catch {
        setError("Das Einloggen ist leider fehlgeschlagen");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit} className={"login_form_container"}>
        <div>
          <h4>Login</h4>
          <label htmlFor="email">E-Mail Adresse</label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            className={clsx(formik.errors.email && "error")}
          />
          <div>
            {formik.errors.email && (
              <div className="error_message">{formik.errors.email}</div>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="password">Passwort</label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            className={clsx(formik.errors.email && "error")}
          />
          <div>
            {formik.errors.email && (
              <div className="error_message">{formik.errors.password}</div>
            )}
          </div>
        </div>
        <div className="button_container">
        <Button
            type="submit"
            className="full_button md primary"
            disabled={loading}
            loading={loading}
          >
            Anmelden
          </Button>
        <Button
            type="button"
            className="full_button md light"
            disabled={loading}
            onClick={() => setPasswordReset(true)}
            loading={loading}
          >
            Passwort vergessen?
          </Button>
        
        </div>
      </form>
      <div className="error_message">{error && error}</div>

      <PasswordForm
        passwordReset={passwordReset}
        setPasswordReset={setPasswordReset}
      />
    </div>
  );
};

export default LoginForm;

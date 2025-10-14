"use client";

import { useState } from "react";
import PasswordForm from "./components/PasswordForm";
import PatflowLoginForm from "./components/PatflowLoginForm";

const LoginForm = () => {
  const [passwordReset, setPasswordReset] = useState(false);

  return (
    <div>
      <PatflowLoginForm />
      <PasswordForm
        passwordReset={passwordReset}
        setPasswordReset={setPasswordReset}
      />
    </div>
  );
};

export default LoginForm;

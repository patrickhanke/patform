"use client";

import React, { useState } from "react";
import styles from "./Login.module.scss";
import Image from "next/image";
import LoginForm from "./components/LoginForm";
import buttonStates from "./constants/buttonStates";
import logo from "./images/patflow.png";
import PasswordForm from "./components/PasswordForm";
import { Divider, SwitchButtons } from "@repo/ui";
import Framework from "./content/Framework";

const Login = ({ children }) => {
	const [formState, setFormState] = useState(
		buttonStates[0] as (typeof buttonStates)[0]
	);

	return (
		<html lang="de">
			<body className={"login_layout"}>
				<Framework />
				<div className="login_content">{children}</div>
			</body>
		</html>
	);
};

export default Login;

'use client';

import React, { useState } from 'react';
import styles from './Login.module.scss';
import Image from 'next/image';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import SwitchButtons from '@/_UI/surfaces/SwitchButtons';
import buttonStates from './constants/buttonStates';
import PasswordForm from './components/PasswordForm';
import logo from  './images/logo_hgs_wide.png';

const Login = () => {
	const [formState, setFormState] = useState(buttonStates[0]);

	return (
		<>
			<div className={styles.left_container}>
				<div className={styles.logo_container}>
					<Image
						src={logo}
						// width={134}
						height={50}
						alt="Hausmeisterapp"
					/>
				</div>
				<div className={styles.left_content}>
					<h1>HGS Hausmeisterapp</h1>
					<div className={styles.divider} />
					<p>
						Login Hausmeister App
					</p>
				</div>
				<div className={styles.footer}>
					<p>
						HGS Hanke
					</p>
					<p>
						@ {new Date().getFullYear()}
					</p>
				</div>

			</div>
			<div className={styles.right_container}>
				<div className={styles.switch_buttons_container}>
					<SwitchButtons buttonStates={buttonStates} currentStates={formState} changeHandler={setFormState}  />
				</div>
				{formState.value === 'login' && <LoginForm />}
				{formState.value === 'register' && <RegisterForm />}
				{formState.value === 'password' && <PasswordForm />}
			</div>
		</>
	);
};

export default Login;
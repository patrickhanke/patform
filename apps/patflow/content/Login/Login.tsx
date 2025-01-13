'use client';

import React, { useState } from 'react';
import styles from './Login.module.scss';
import Image from 'next/image';
import LoginForm from './components/LoginForm';
import buttonStates from './constants/buttonStates';
import logo from  './images/patflow.png';
import PasswordForm from './components/PasswordForm';
import { Divider, SwitchButtons } from '@repo/ui';

const Login = () => {
	const [formState, setFormState] = useState(buttonStates[0] as typeof buttonStates[0]);

	return (
		<>
			<div className={styles.main_container}>
				<div className={styles.logo_container}>
					<Image
						src={logo}
						// width={134}
						height={50}
						alt="patflow"
					/>
				</div>

				<h1 style={{textAlign: 'center'}}>
					Login Patflow
				</h1>
				<Divider size='large' showLine={false} />
				<SwitchButtons
					buttonStates={buttonStates}
					changeHandler={value => setFormState(value)}
					currentStates={formState}
				/>
				<Divider size='large' showLine={false} />
				{formState.value === 'login' && <LoginForm />}
				{formState.value === 'password' && <PasswordForm />}
			</div>
		</>
	);
};

export default Login;
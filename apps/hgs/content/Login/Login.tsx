'use client';

import React, { useState } from 'react';
import styles from './Login.module.scss';
import Image from 'next/image';
import LoginForm from './components/LoginForm';
import buttonStates from './constants/buttonStates';
import logo from  './images/app_logo.png';

const Login = () => {
	const [formState] = useState(buttonStates[0] as typeof buttonStates[0]);

	return (
		<>
			
			<div className={styles.main_container}>
				<div className={styles.logo_container}>
					<Image
						src={logo}
						// width={134}
						height={50}
						alt="Hausmeisterapp"
					/>
				</div>
				{formState.value === 'login' && <LoginForm />}
			</div>
		</>
	);
};

export default Login;
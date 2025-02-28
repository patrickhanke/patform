'use client';

import { useState } from 'react';
import './styles.scss';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import {SwitchButtons} from '@repo/ui';
import buttonStates from './constants/buttonStates';
import PasswordForm from './components/PasswordForm';

const Login = () => {
	const [formState, setFormState] = useState<typeof buttonStates[number]>(buttonStates[0] as typeof buttonStates[number]);

	return (
		<>
			<div className={'login_left_container'}>
				<div className={'login_left_content'}>
					<h1>Patwork Admin</h1>
					<div className={'login_divider'} />
					<p>
						Login Patwork CMS
					</p>
				</div>
				<div className={'login_footer'}>
					<p>
						Patwork
					</p>
					<p>
						@ {new Date().getFullYear()}
					</p>
				</div>

			</div>
			<div className={'login_right_container'}>
				<div className={'login_switch_buttons_container'}>
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
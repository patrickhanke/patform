'use client';

import { useMemo, useState } from 'react';
import './styles.scss';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import {SwitchButtons} from '@repo/ui';
import buttonStates from './constants/buttonStates';
import PasswordForm from './components/PasswordForm';
import path from 'path';
import { usePathname, useRouter } from 'next/navigation';
import { axiosclient } from '@repo/provider';

const Login = () => {
	const [formState, setFormState] = useState<typeof buttonStates[number]>(buttonStates[0] as typeof buttonStates[number]);
	const path = usePathname();
	console.log(path);

	const project = useMemo(() => {
		let project;
		axiosclient().post('functions/get_project_from_path', {path})
		.then(data => {
			project = data;

		})
		.catch(error => console.error(error.message));
		return project
	}, [])
	console.log(project);

	
	return (
		<>
			<div className={'login_left_container'}>
				<div className={'login_left_content'}>
					<h1>Patstore Login</h1>
					<div className={'login_divider'} />
					<p>
						Login Patstore CMS
					</p>
				</div>
				<div className={'login_footer'}>
					<p>
						Patstore
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
import React, { useState } from 'react';
import { axiosclient, useFirebaseMessaging } from '@repo/provider';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import clsx from 'clsx';
import styles from '../Login.module.scss';
import { User } from '@types';
import { loginUser } from '@repo/provider';

const LoginSchema = Yup.object().shape({
	email: Yup.string().email('Ungültiges E-Mail Format').required('Eine E-Mail Adresse muss angegeben werden'),
	password: Yup.string().required('Ein Passwort muss eingegeben werden')
});

const LoginForm = () => {
	const [disabled, setDisabled] = useState(false);
	const [error, setError] = useState('');
	const {getFcmToken} = useFirebaseMessaging({initialize: false})



	const formik = useFormik({
		validationSchema: LoginSchema,
		initialValues: {
			email: '',
			password: ''
		},
		
		onSubmit: async (values, actions) => {
			setDisabled(true);
			const userData = await axiosclient().post('/functions/get-user-data', {
				email: values.email
			});

			const user: User & {has_access: boolean} | undefined = userData?.data?.result ;

			if (!user) {
				window.alert('Für diese E-Mail Adresse ist kein Nutzer hinterlegt');
				setDisabled(false);
				return [] as User[];
			}

			if (user) {
				console.log(user);
				console.log(user.has_access);
				
				if (user.has_access === true) {
					const login = await loginUser({email: values.email, password: values.password, getFcmToken});
					console.log(login);
					
					if (login) {
						if (login.error) {
							setError(login.message);
							setDisabled(false);
							return;
						} else {
							window.location.pathname = '/';
						}
					}
				} else {
					setError('Kein Zugriff auf die App');
				}
				setDisabled(false);
			}
			setDisabled(false);
		}
	});

	return (
		<div>
			<form onSubmit={formik.handleSubmit} className={styles.form_container}>
				<label htmlFor="email">E-Mail Adresse</label>
				<input
					id="email"
					name="email"
					type="email"
					onChange={formik.handleChange}
					value={formik.values.email}
					className={clsx(formik.errors.email && 'error')}
				/>
				{formik.errors.email &&
					<div className='error_message'>
						{formik.errors.email}
					</div>
				}
				<label htmlFor="password">Passwort</label>
				<input
					id="password"
					name="password"
					type="password"
					onChange={formik.handleChange}
					value={formik.values.password}
					className={clsx(formik.errors.email && 'error')}
				/>
				{formik.errors.email &&
					<div className='error_message'>
						{formik.errors.password}
					</div>
				}
				<button type="submit" className='full_button md primary' disabled={disabled}>Anmelden</button>
			</form>
			<div className='error_message'>
				{error && error}
			</div>
		</div>
	);
};

export default LoginForm;
import React, { useState } from 'react';
import { axiosclient } from '@provider';
import { useFormik } from 'formik';
import Cookies from 'js-cookie';
import * as Yup from 'yup';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import styles from '../Login.module.scss';
import { User } from '@types';

const LoginSchema = Yup.object().shape({
	email: Yup.string().email('Ungültiges E-Mail Format').required('Eine E-Mail Adresse muss angegeben werden'),
	password: Yup.string().required('Ein Passwort muss eingegeben werden')
});

const LoginForm = () => {
	const [disabled, setDisabled] = useState(false);
	const router = useRouter();
	const [error, setError] = useState('');

	const formik = useFormik({
		validationSchema: LoginSchema,
		initialValues: {
			email: '',
			password: ''
		},
		onSubmit: async values => {
			setDisabled(true);
			const user: User | null = await axiosclient().post('/functions/get-user-data', {
				email: values.email
			});

			console.log(user);
			console.log(values);
			

			if (!user) {
				window.alert('Für diese E-Mail Adresse ist kein Nutzer hinterlegt');
				return [] as User[];
			}

			if (user) {
				await axiosclient().post('login', {
					'username': values.email, 
					'password': values.password
				})
					.then(response => {
						Cookies.set('hgs_token', response.data.sessionToken, {expires: 90});
						setError('');
					})
					.catch(error => {
						if (error.message === 'Invalid username/password.') {
							setError('Falsche E-Mail / Passwort Kombination');
							setDisabled(false);
						} else {
							setError('Das Einloggen ist leider fehlgeschlagen');
							setDisabled(false);
						}
					});
				router.push('/');
			}
			setDisabled(false);
		}
	});

	return (
		<div>
			<form onSubmit={formik.handleSubmit} className={styles.form_container}>
				<h2>
					Login
				</h2>
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
import React, { useState } from 'react';
import { axiosclient } from '@provider';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import styles from '../Login.module.scss';
import { User } from '@types';
import { useLocalStorage } from 'usehooks-ts';
import { loginUser } from '@repo/provider';

const LoginSchema = Yup.object().shape({
	email: Yup.string().email('Ungültiges E-Mail Format').required('Eine E-Mail Adresse muss angegeben werden'),
	password: Yup.string().required('Ein Passwort muss eingegeben werden')
});

const LoginForm = () => {
	const [value, setValue, removeValue] = useLocalStorage('project', 0);
	const [disabled, setDisabled] = useState(false);
	const router = useRouter();
	const [error, setError] = useState('');

	const formik = useFormik({
		validationSchema: LoginSchema,
		initialValues: {
			email: '',
			password: ''
		},
		
		onSubmit: async (values, actions) => {
			setDisabled(true);
			const user: User | null = await axiosclient().post('/functions/get-user-data', {
				email: values.email
			});

			if (!user) {
				window.alert('Für diese E-Mail Adresse ist kein Nutzer hinterlegt');
				setDisabled(false);
				return [] as User[];
			}

			if (user) {
				const login = await loginUser({email: values.email, password: values.password});
				if (login) {
					if (login.error) {
						setError(login.message);
						setDisabled(false);
						return;
					} else {
						router.push('/');
					}
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
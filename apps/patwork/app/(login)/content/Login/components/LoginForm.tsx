import { useState } from 'react';
import { axiosclient } from '@repo/provider';
import { useFormik } from 'formik';
import Cookies from 'js-cookie';
import * as Yup from 'yup';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import '../styles.scss';

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
		onSubmit: async (values) => {
			console.log(values);
			
			const user = await axiosclient()
				.post('/functions/get-user-data', {
					email: values.email
				});

			console.log(user);
			setDisabled(false);
				
			if (user?.data?.result?.is_superuser === true) {
				await axiosclient().post('login', {
					'username': user?.data?.result?.username, 
					'password': values.password
				})
					.then(response => {
						Cookies.set('patwork_token', response.data.sessionToken, {expires: 180});
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
				setDisabled(false);
				router.push('/');
			}
		}
	});

	return (
		<div>
			<form onSubmit={formik.handleSubmit} className={'login_form_container'}>
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
import { useState } from 'react';
import { axiosclient } from '@repo/provider';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import clsx from 'clsx';
import '../styles.scss';
const SignupSchema = Yup.object().shape({
	username: Yup.string()
		.min(2, 'Name zu kurz')
		.max(30, 'Name zu lang')
		.required('Pflichtfeld'),
	password: Yup.string().required('Pflichtfeld'),
	passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), undefined], 'Passwörter müssen übereinstimmen'),
	email: Yup.string().email('Keine gültige E-Mail adresse').required('Pflichtfeld')
});

const RegisterForm = () => {
	const [disabled, setDisabled] = useState(false);
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');

	const formik = useFormik({
		validationSchema: SignupSchema,
		initialValues: {
			username: '',
			email: '',
			password: '',
			passwordConfirmation: ''
		},
		onSubmit: async values => {

			setDisabled(true);
			await axiosclient().post('users', {
				'username': values.username, 
				'password': values.password,
				'email': values.email
			})
				.catch(error => {
					if (error.response.data.code === 202) {
						setError('Für diesen Nutzernamen besteht bereits ein Account. Bitte wählen Sie einen anderen.');
						setDisabled(false);
					}
					if (error.response.data.code === 203) {
						setError('Für diese E-Mail Adresse besteht bereits ein Account');
						setDisabled(false);
					}
					setDisabled(false);
				})
				.then(() => {
					setMessage('Sie haben sich erfolgreich bei der  HGS App registriert. Bitte bestätigen Sie Ihre angegebene E-Mail Adresse bevor Sie sich einloggen.');
					setDisabled(false);
				});
		}
	});

	return message ? 
		<p>
			{message}
		</p>
		:
		<div>
			<form onSubmit={formik.handleSubmit} className={'login_form_container'}>
				<h2>
					Registrieren
				</h2>
				<label htmlFor="username">Nutzername</label>
				<input
					id="username"
					name="username"
					type="username"
					onChange={formik.handleChange}
					value={formik.values.username}
					className={clsx(formik.errors.username && 'error')}
				/>
				{formik.errors.username &&
					<div className='error_message'>
						{formik.errors.username}
					</div>
				}
				<label htmlFor="email">E-Mail</label>
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
					className={clsx(formik.errors.password && 'error')}
				/>
				{formik.errors.password &&
					<div className='error_message'>
						{formik.errors.password}
					</div>
				}
				
				<label htmlFor="passwordConfirmation">Passwort bestätigen</label>
				<input
					id="passwordConfirmation"
					name="passwordConfirmation"
					type="password"
					onChange={formik.handleChange}
					value={formik.values.passwordConfirmation}
					className={clsx(formik.errors.passwordConfirmation && 'error')}
				/>
				{formik.errors.passwordConfirmation &&
					<div className='error_message'>
						{formik.errors.passwordConfirmation}
					</div>
				}
				<button type="submit" disabled={disabled}>Registrieren</button>
				{error && <p className='error_message'>
					{error}
				</p>
				}
			</form>
		</div>;
};

export default RegisterForm;
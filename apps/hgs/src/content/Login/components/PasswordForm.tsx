import React, { useState } from 'react';
import { axiosclient } from '@/provider';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from '../Login.module.scss';
import clsx from 'clsx';

const PasswordSchema = Yup.object().shape({
	email: Yup.string().email('Ungültiges E-Mail Format').required('Eine E-Mail Adresse muss angegeben werden')
});

const PasswordForm = () => {
	const [message, setMessage] = useState('');

	const formik = useFormik({
		validationSchema: PasswordSchema,
		initialValues: {
			email: ''
		},
		onSubmit: async values => {
			await axiosclient().post('requestPasswordReset', {
				'email': values.email
			})
				.catch(error => {
					window.alert(JSON.stringify(error.message, null, ''));
					
				})
				.then(() => {
					setMessage('Sie erhalten Eine E-Mail mit einem Link für das Rücksetzen des Passworts');
				});
			// setDisabled(false);
		}
	});

	return (
		<div>
			<form onSubmit={formik.handleSubmit} className={styles.form_container}>
				<h2>
					Passwort zurücksetzen
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
				
				{message ? <p>{message} </p> : <button type="submit">Zurücksetzen</button>}
			</form>

		</div>
	);
};

export default PasswordForm;
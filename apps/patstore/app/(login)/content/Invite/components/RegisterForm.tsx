import React, { useState } from 'react';
import { axiosclient } from '@repo/provider';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import clsx from 'clsx';
import { PatstoreProject } from '@repo/types';
import axios from 'axios';

const SignupSchema = Yup.object().shape({
	username: Yup.string()
		.min(2, 'Name zu kurz')
		.max(30, 'Name zu lang')
		.required('Pflichtfeld'),
	password: Yup.string()
		.min(8, 'Passwort muss mindestens 8 Zeichen lang sein')
		.matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, 'Passwort muss einen Großbuchstaben, eine Zahl und ein Sonderzeichen enthalten')
		.required('Pflichtfeld'),
	passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), undefined], 'Passwörter müssen übereinstimmen'),
});

const RegisterForm = ({email, project, key}: {email: string, project: PatstoreProject, key: string}) => {
	const [disabled, setDisabled] = useState(false);
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);

	const formik = useFormik({
		validationSchema: SignupSchema,
		initialValues: {
			username: '',
			password: '',
			passwordConfirmation: ''
		},
		onSubmit: async values => {

			setDisabled(true);
			const invitationKey: string = await axiosclient().post('functions/check-for-invite', {email, project_id: project.objectId})
			console.log(invitationKey);
			if (invitationKey && invitationKey === key) {
				await axiosclient().post('users', {
					'username': email, 
					'name': values.username,
					'password': values.password,
					'email': email
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
					.then(async () => {
						await axiosclient().post('functions/remove-invitation-key', {key, project_id: project.objectId})

						setSuccess(true)
						setDisabled(false);
					});
			} else {
				setError('Einladung ungültig');
				setDisabled(false);
				return;
			}
			
			
		}
	});

	return success ? 
		<p>
			Sie haben sich erfolgreich für das Projekt {project.name} registriert. Sie können sich jetzt <a href={`https://store.patwork${project.path}`}>hier</a> einloggen.
		</p>
		:
		<div>
			<form onSubmit={formik.handleSubmit} className={'login_form_container'}>
				<div>
					<label>E.Mail Adresse</label>
					<p>
						{email}
					</p>
				</div>
				<div>
					<label htmlFor="username">Nutzername</label>
					<input
						id="username"
						name="username"
						type="username"
						onChange={formik.handleChange}
						value={formik.values.username}
						className={clsx(formik.errors.username && 'error')}
					/>
					<div>
						{formik.errors.username &&
							<div className='error_message'>
								{formik.errors.username}
							</div>
						}
					</div>
				</div>
				<div>
					<label htmlFor="password">Passwort</label>
					<input
						id="password"
						name="password"
						type="password"
						onChange={formik.handleChange}
						value={formik.values.password}
						className={clsx(formik.errors.password && 'error')}
					/>
					<div>
						{formik.errors.password &&
							<div className='error_message'>
								{formik.errors.password}
							</div>
						}
					</div>
				</div>
				<div>
					<label htmlFor="passwordConfirmation">Passwort bestätigen</label>
					<input
						id="passwordConfirmation"
						name="passwordConfirmation"
						type="password"
						onChange={formik.handleChange}
						value={formik.values.passwordConfirmation}
						className={clsx(formik.errors.passwordConfirmation && 'error')}
					/>
					<div>
						{formik.errors.passwordConfirmation &&
							<div className='error_message'>
								{formik.errors.passwordConfirmation}
							</div>
						}
					</div>
				</div>
				<button className='full_button primary md' type="submit" disabled={disabled}>Einladung annehmen</button>
				{error && <p className='error_message'>
					{error}
				</p>
				}
			</form>
		</div>;
};

export default RegisterForm;
import { FC, useCallback, useState } from 'react';
import { axiosclient } from '@repo/provider';
import * as yup from 'yup';

import '../styles.scss';
import { Modal, TextInput } from '@repo/ui';
import { PasswordFormProps } from '../types';
import { ErrorMessage } from '@repo/types';

const PasswordForm: FC<PasswordFormProps> = ({passwordReset, setPasswordReset}) => {
	const [email, setEmail] = useState('');
	const [errors, setErrors] = useState<ErrorMessage[]>([]);

	const submitHandler = useCallback(async () => {
		const errorArray: ErrorMessage[] = []
		let schema = yup.object().shape({
			email: yup.string().email().required(),
		});

		await schema.validate({email: email}).catch((errors) => {
			errorArray.push({message: errors.errors[0], id: errors.path, key: errors.path})
		})

		if (errorArray.length === 0) {
			await axiosclient().post('functions/send-password-reset', {email})
				.then((message) => {
					console.log(message);
					console.log('E-Mail wurde versendet');
				})
				.catch((error) => {
					console.error(error);
					errorArray.push({message: error.message, id: 'email', key: 'email'});
			});
		}
		setErrors(errorArray);

	}, [email]);

	return (
		<Modal
			header='Passwort zurücksetzen'
			isOpen={passwordReset}
			confirmButtonHandler={() => submitHandler()}
			cancelButtonHandler={() => setPasswordReset(false)}
			errors={errors}
			confirmButtonText='Link anfordern'
			buttonDisabled={[false, errors.length > 0]}
		>
				<p>
					Geben Sie eine E-Mail Adresse an, um einen Passwort-Reset Link zu erhalten.
				</p>
				<TextInput
					label='E-Mail Adresse'
					id='email'
					defaultValue={email}
					onChange={value => {
						if (errors.length > 0) {
							setErrors([])
						}
						setEmail(value)
					}}
				/>
		</Modal>
	);
};

export default PasswordForm;
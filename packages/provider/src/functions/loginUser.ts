import { axiosclient } from '../data';
import { User } from '@repo/types';
import Cookies from 'js-cookie';

type LoginUser = (T: {email: string, password: string }) => Promise<({
    user: User | null,
    error: boolean,
    message: string
} | null)>

export const loginUser: LoginUser  =  async ({email, password}) => {
	const user: User | null = await axiosclient().post('/functions/get-user-data', {
		email: email
	});

	if (!user) {
		window.alert('Für diese E-Mail Adresse ist kein Nutzer hinterlegt');
		return null;
	}

	if (user) {
		await axiosclient().post('login', {
			'username': email, 
			'password': password
		}) 
			.then(response => {
				Cookies.set(process.env.SESSION_TOKEN, response.data.sessionToken, {expires: 90});
				return({
					error: false,
					message: 'Erfolgreich eingeloggt',
					user: response.data
				});
			})
			.catch(error => {
				if (error.message === 'Invalid username/password.') {
					return ({
						error: true,
						message: 'Falsche E-Mail / Passwort Kombination',
						user: null
					});
				} else {
					return({
						error: true,
						message: 'Das Einloggen ist leider fehlgeschlagen',
						user: null
					});
				}
			});
	}

	return null;

};
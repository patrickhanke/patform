'use client';

import { axiosclient } from '../data';
import { User } from '@repo/types';
import Cookies from 'js-cookie';
import { generateUuid} from '@repo/provider';
import axios from 'axios';

type LoginUser = (T: {email: string, password: string, getFcmToken: () => Promise<string | void> }) => Promise<({
    user: User | null,
    error: boolean,
    message: string
} | null)>

const loginclient = (installationId: string) => {
	return axios.create({
		baseURL: process.env.SASHIDO_API_URL,
		headers: {
			'X-Parse-Application-Id':  process.env.SASHIDO_APP_ID,
			'X-Parse-REST-API-Key': process.env.SASHIDO_REST_KEY,
			'X-Parse-Installation-Id': installationId
		}
	});
};

export const loginUser: LoginUser  =  async ({email, password, getFcmToken}) => {
	let returnValue = {
		user: null,
		error: true,
		message: 'kein Nutzer gefunden'
	};

	const user: User | null = await axiosclient().post('/functions/get-user-data', {
		email: email
	});

	if (!user) {
		window.alert('Für diese E-Mail Adresse ist kein Nutzer hinterlegt');
	}

	if (user) {
		const installationId = generateUuid();
		
		await loginclient(installationId). post('login', {
			'username': email, 
			'password': password
		}) 
			.then(async response => {
				if (response.data.sessionToken) {
					if (process.env.SESSION_TOKEN) {
						Cookies.set(process.env.SESSION_TOKEN, response.data.sessionToken, {expires: 365, sameSite: 'strict'});
					} else {
						console.error('SESSION_TOKEN is not defined');
					}
					
					const installationIdKey = process.env.INSTALLATION_ID || 'default_installation_id';
					Cookies.set(installationIdKey, installationId, {expires: 365, sameSite: 'strict'});
					const token = await getFcmToken();
					
					await axiosclient().post('functions/create-installation', {
						deviceType: 'web',
						deviceToken: token, 
						channels: [],
						appIdentifier: process.env.FIREBASE_APP_ID,
						appName: 'patflow_web',
						appVersion: '0.6.0',
						parseVersion: '3.6.0',
						localeIdentifier: 'de-DE',
						timeZone: 'GMT',
						user: response.data.objectId,
						GCMSenderId: process.env.GCMS_SENDER_ID,
						pushType: 'gcm',
						installationId: installationId
					});

					returnValue = {
						error: false,
						message: 'Erfolgreich eingeloggt',
						user: response.data
					};
				}
			})
			.catch(error => {
				if (error.message === 'Invalid username/password.') {
					returnValue = {
						error: true,
						message: 'Falsche E-Mail / Passwort Kombination',
						user: null
					};
				} else {
					returnValue = {
						error: true,
						message: 'Das Einloggen ist leider fehlgeschlagen',
						user: null
					};
				}
			});
	}

	return returnValue;
};
"use client";

import { axiosclient } from "../data";
import { PatflowUser } from "@repo/types";
import Cookies from "js-cookie";
import { v4 as generateUuid } from "uuid";
import axios from "axios";
import { requestPermissionAndGetToken } from "../firebase/initializeFirebase";

type LoginUser = (T: {
	email: string;
	password: string;
	userData: PatflowUser;
}) => Promise<{
	user: PatflowUser | null;
	error: boolean;
	message: string;
} | null>;

const loginclient = (installationId: string) => {
	return axios.create({
		baseURL: process.env.SASHIDO_API_URL,
		headers: {
			"X-Parse-Application-Id": process.env.SASHIDO_APP_ID,
			"X-Parse-REST-API-Key": process.env.SASHIDO_REST_KEY,
			"X-Parse-Installation-Id": installationId
		}
	});
};

export const loginUser: LoginUser = async ({ email, password, userData }) => {
	let returnValue: {
		user: PatflowUser | null;
		error: boolean;
		message: string;
	} = {
		user: null,
		error: true,
		message: "kein Nutzer gefunden"
	};

	const installationId = generateUuid();
	let sessionToken;
	await loginclient(installationId)
		.post("login", {
			username: email,
			password: password
		})
		.then(async (response) => {
			if (response.data.sessionToken) {
				sessionToken = response.data.sessionToken;
				if (process.env.SESSION_TOKEN) {
					Cookies.set(
						process.env.SESSION_TOKEN,
						response.data.sessionToken,
						{
							expires: 365,
							sameSite: "strict"
						}
					);
				} else {
					console.error("SESSION_TOKEN is not defined");
				}
			}
		})
		.catch((error) => {
			const message = error.response?.data?.error ?? error.message ?? "";
			if (message === "Invalid username/password.") {
				returnValue = {
					error: true,
					message: "Falsche E-Mail / Passwort Kombination",
					user: null
				};
			} else {
				returnValue = {
					error: true,
					message: "Das Einloggen ist leider fehlgeschlagen",
					user: null
				};
			}
		});

	if (sessionToken) {
		const installationIdKey =
			process.env.INSTALLATION_ID || "patflow_installation_id";
		Cookies.set(installationIdKey, installationId, {
			expires: 365,
			sameSite: "strict"
		});

		const token = await requestPermissionAndGetToken();

		if (token) {
			try {
				await axiosclient().post("functions/create-installation", {
					deviceType: "web",
					deviceToken: token,
					channels: [],
					appIdentifier: process.env.FIREBASE_APP_ID,
					appName: "patflow_web",
					appVersion: "0.6.0",
					parseVersion: "3.6.0",
					localeIdentifier: "de-DE",
					timeZone: "GMT",
					user: userData.objectId,
					GCMSenderId: process.env.GCMS_SENDER_ID,
					pushType: "gcm",
					installationId: installationId
				});
			} catch (error) {
				console.error("Installation registration failed:", error);
			}
		} else {
			console.warn(
				"FCM token could not be generated; push notifications will be registered after login."
			);
		}

		returnValue = {
			error: false,
			message: token
				? "Erfolgreich eingeloggt und Token wurde generiert"
				: "Erfolgreich eingeloggt",
			user: userData
		};
	} else if (returnValue.error) {
		// keep login error from catch above
	} else {
		returnValue = {
			error: true,
			message: "Es konnte kein Session Token generiert werden",
			user: null
		};
	}

	return returnValue;
};

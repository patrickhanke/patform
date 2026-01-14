"use client";

import { axiosclient } from "../data";
import { PatflowUser } from "@repo/types";
import Cookies from "js-cookie";
import { v4 as generateUuid } from "uuid";
import axios from "axios";
import { requestPermissionAndGetToken } from "../firebase/initializeFirebase";

type LoginUser = (T: { email: string; password: string }) => Promise<{
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

export const loginUser: LoginUser = async ({ email, password }) => {
	let returnValue = {
		user: null,
		error: true,
		message: "kein Nutzer gefunden"
	};

	const response = await axiosclient().post("/functions/get_user_data", {
		email: email
	});

	console.log({ response });

	const responseData = response?.data?.result;

	if (!responseData) {
		console.error("Fehler beim Laden der Daten");
	} else {
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
					console.log({ sessionToken });
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
				if (error.message === "Invalid username/password.") {
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

		console.log("sessionToken: ", sessionToken);

		if (sessionToken) {
			const installationIdKey =
				process.env.INSTALLATION_ID || "default_installation_id";
			Cookies.set(installationIdKey, installationId, {
				expires: 365,
				sameSite: "strict"
			});

			const token = await requestPermissionAndGetToken();

			if (token === undefined) {
				console.log("FcmToken could not be generated");

				returnValue = {
					error: true,
					message: "Es konnte kein FCM Token generiert werden",
					user: null
				};
			} else {
				console.log("FcmToken: ", token);

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
					user: response.data.result.objectId,
					GCMSenderId: process.env.GCMS_SENDER_ID,
					pushType: "gcm",
					installationId: installationId
				});

				returnValue = {
					error: false,
					message: "Erfolgreich eingeloggt und Token wurde generiert",
					user: response.data
				};
			}
		} else {
			returnValue = {
				error: true,
				message: "Es konnte kein Session Token generiert werden",
				user: null
			};
		}
	}

	return returnValue;
};

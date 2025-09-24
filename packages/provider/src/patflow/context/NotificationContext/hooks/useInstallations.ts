import { useCallback, useEffect } from "react";
import { axiosclient } from "@repo/provider";
import { PatflowUser } from "@repo/types";
import { v4 } from "uuid";
import { isArray } from "lodash-es";

const useInstallations = ({
	user,
	firebaseToken,
}: {
	user?: PatflowUser;
	firebaseToken: string | null;
}) => {
	const findInstallation = async (userIds: string[]) => {
		try {
			const response = await axiosclient().post(
				"functions/find-installations",
				{
					userIds: userIds
				}
			);
			return response.data.result;
		} catch (error) {
			console.log(error);
		}

		return null;
	};

	const installationHandler = useCallback(async () => {
		if (user && firebaseToken) {
			const data = await findInstallation([user.objectId]);
			const installations = data.webDevices || [];

			if (isArray(installations) && installations.length === 0) {
				await axiosclient().post("functions/create-installation", {
					deviceType: "web",
					deviceToken: firebaseToken,
					channels: [],
					appIdentifier: process.env.FIREBASE_APP_ID,
					appName: "patflow",
					appVersion: "0.6.0",
					parseVersion: "3.6.0",
					localeIdentifier: "de-DE",
					timeZone: "GMT",
					user: user.objectId,
					installationId: v4(),
					GCMSenderId: process.env.GCMS_SENDER_ID,
					pushType: "gcm"
				});
			}
		}
	}, [user, firebaseToken]);

	useEffect(() => {
		if (user) {
			installationHandler();
		}
	}, [user]);
};

export default useInstallations;

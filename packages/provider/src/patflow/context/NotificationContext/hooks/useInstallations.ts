import { useCallback, useEffect } from "react";
import { axiosclient } from "@repo/provider";
import { PatflowUser } from "@repo/types";
import Cookies from "js-cookie";
import { v4 } from "uuid";
import { isArray } from "lodash-es";

const PATFLOW_APP_NAME = "patflow_web";

const getInstallationId = () => {
	const installationIdKey =
		process.env.INSTALLATION_ID || "patflow_installation_id";
	return Cookies.get(installationIdKey) || v4();
};

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
					userIds: userIds,
				}
			);
			return response.data.result;
		} catch (error) {
			console.log(error);
		}

		return null;
	};

	const createInstallation = useCallback(
		async (deviceToken: string) => {
			await axiosclient().post("functions/create-installation", {
				deviceType: "web",
				deviceToken,
				channels: [],
				appIdentifier: process.env.FIREBASE_APP_ID,
				appName: PATFLOW_APP_NAME,
				appVersion: "0.6.0",
				parseVersion: "3.6.0",
				localeIdentifier: "de-DE",
				timeZone: "GMT",
				user: user?.objectId,
				installationId: getInstallationId(),
				GCMSenderId: process.env.GCMS_SENDER_ID,
				pushType: "gcm",
			});
		},
		[user?.objectId]
	);

	const installationHandler = useCallback(async () => {
		if (!user?.objectId || !firebaseToken) {
			return;
		}

		const data = await findInstallation([user.objectId]);
		const installations = data?.webDevices || [];

		if (!isArray(installations) || installations.length === 0) {
			await createInstallation(firebaseToken);
			return;
		}

		const hasCurrentToken = installations.some(
			(installation: { deviceToken?: string }) =>
				installation.deviceToken === firebaseToken
		);

		if (!hasCurrentToken) {
			await createInstallation(firebaseToken);
		}
	}, [user?.objectId, firebaseToken, createInstallation]);

	useEffect(() => {
		installationHandler();
	}, [installationHandler]);
};

export default useInstallations;

"use client";

import { useDataHandler, useFindData } from "@repo/provider";
import { useCallback } from "react";
import data from "./constants/data.json";
import aerzteBcd from "./26_01_2026/data_bcd.json";
import aerzteDgk from "./26_01_2026/data_dgk.json";
import aerzteDgKSebastiany from "./constants/aerzte_dgk.json";
import { v4 } from "uuid";
import { remove, set, uniqBy } from "lodash-es";
import { PatstoreUser } from "@repo/types";

const getUserType = (
	status: "BCD" | "DGK" | "DGK/BCD" | "BCD/DGK"
): "bcd" | "dgk" | "dgk/bcd" => {
	switch (status) {
		case "BCD":
			return "bcd";
		case "DGK":
			return "dgk";
		case "DGK/BCD":
			return "dgk/bcd";
		case "BCD/DGK":
			return "dgk/bcd";
	}
};

const getProjectAndModule = (userType: "bcd" | "dgk" | "dgk/bcd") => {
	if (userType === "bcd") {
		return { project: "EgRR0prozh", module: "yTGwUVZ8oF" };
	} else if (userType === "dgk") {
		return { project: "JRxDkaxCoI", module: "qKRBi8FYD6" };
	} else if (userType === "dgk/bcd") {
		return { project: "JRxDkaxCoI", module: "qKRBi8FYD6" };
	}
};

const getEmailArray = (
	status: "bcd" | "dgk" | "dgk/bcd",
	email?: string,
	sebatiany?: string
) => {
	const emailArray: {
		email: string;
		lists: string[];
		settings: { [key: string]: { optIn: string; optOut: string } };
	}[] = [];
	if (status === "bcd") {
		if (email) {
			emailArray.push({
				email: email,
				lists: ["ZQRXdR278J"],
				settings: {
					ZQRXdR278J: {
						optIn: new Date().toISOString(),
						optOut: ""
					}
				}
			});
		}
		if (sebatiany) {
			const equalEmail = emailArray.findIndex(
				(item) => item.email === sebatiany
			);
			if (equalEmail === -1) {
				emailArray.push({
					email: sebatiany,
					lists: ["JaTGOQX4pZ"],
					settings: {
						JaTGOQX4pZ: {
							optIn: new Date().toISOString(),
							optOut: ""
						}
					}
				});
			} else {
				set(emailArray, `[${equalEmail}].lists`, [
					"ZQRXdR278J",
					"JaTGOQX4pZ"
				]);
				set(
					emailArray,
					`[${equalEmail}].settings.ZQRXdR278J.optIn`,
					new Date().toISOString()
				);
				set(
					emailArray,
					`[${equalEmail}].settings.ZQRXdR278J.optOut`,
					""
				);
				set(
					emailArray,
					`[${equalEmail}].settings.JaTGOQX4pZ.optIn`,
					new Date().toISOString()
				);
				set(
					emailArray,
					`[${equalEmail}].settings.JaTGOQX4pZ.optOut`,
					""
				);
			}
		}
	} else if (status === "dgk") {
		if (email) {
			emailArray.push({
				email: email,
				lists: ["g3D7DCOgIf"],
				settings: {
					g3D7DCOgIf: {
						optIn: new Date().toISOString(),
						optOut: ""
					}
				}
			});
		}
		if (sebatiany) {
			const equalEmail = emailArray.findIndex(
				(item) => item.email === sebatiany
			);
			if (equalEmail === -1) {
				emailArray.push({
					email: sebatiany,
					lists: ["QY2tNfkk0L"],
					settings: {
						QY2tNfkk0L: {
							optIn: new Date().toISOString(),
							optOut: ""
						}
					}
				});
			} else {
				set(emailArray, `[${equalEmail}].lists`, [
					"g3D7DCOgIf",
					"QY2tNfkk0L"
				]);
				set(
					emailArray,
					`[${equalEmail}].settings.g3D7DCOgIf.optIn`,
					new Date().toISOString()
				);
				set(
					emailArray,
					`[${equalEmail}].settings.g3D7DCOgIf.optOut`,
					""
				);
				set(
					emailArray,
					`[${equalEmail}].settings.QY2tNfkk0L.optIn`,
					new Date().toISOString()
				);
				set(
					emailArray,
					`[${equalEmail}].settings.QY2tNfkk0L.optOut`,
					""
				);
			}
		}
	} else if (status === "dgk/bcd") {
		if (email) {
			emailArray.push({
				email: email,
				lists: ["ZQRXdR278J", "g3D7DCOgIf"],
				settings: {
					ZQRXdR278J: {
						optIn: new Date().toISOString(),
						optOut: ""
					},
					g3D7DCOgIf: {
						optIn: new Date().toISOString(),
						optOut: ""
					}
				}
			});
		}
		if (sebatiany) {
			const equalEmail = emailArray.findIndex(
				(item) => item.email === sebatiany
			);
			if (equalEmail === -1) {
				emailArray.push({
					email: sebatiany,
					lists: ["JaTGOQX4pZ", "QY2tNfkk0L"],
					settings: {
						JaTGOQX4pZ: {
							optIn: new Date().toISOString(),
							optOut: ""
						},
						QY2tNfkk0L: {
							optIn: new Date().toISOString(),
							optOut: ""
						}
					}
				});
			} else if (equalEmail !== undefined) {
				set(emailArray, `[${equalEmail}].lists`, [
					"ZQRXdR278J",
					"g3D7DCOgIf",
					"JaTGOQX4pZ",
					"QY2tNfkk0L"
				]);
				set(
					emailArray,
					`[${equalEmail}].settings.ZQRXdR278J.optIn`,
					new Date().toISOString()
				);
				set(
					emailArray,
					`[${equalEmail}].settings.ZQRXdR278J.optOut`,
					""
				);
				set(
					emailArray,
					`[${equalEmail}].settings.g3D7DCOgIf.optIn`,
					new Date().toISOString()
				);
				set(
					emailArray,
					`[${equalEmail}].settings.g3D7DCOgIf.optOut`,
					""
				);
				set(
					emailArray,
					`[${equalEmail}].settings.JaTGOQX4pZ.optIn`,
					new Date().toISOString()
				);
				set(
					emailArray,
					`[${equalEmail}].settings.JaTGOQX4pZ.optOut`,
					""
				);
				set(
					emailArray,
					`[${equalEmail}].settings.QY2tNfkk0L.optIn`,
					new Date().toISOString()
				);
				set(
					emailArray,
					`[${equalEmail}].settings.QY2tNfkk0L.optOut`,
					""
				);
			}
		}
	}
	return emailArray;
};

const getProjects = (userType: "bcd" | "dgk" | "dgk/bcd") => {
	if (userType === "bcd") {
		return ["EgRR0prozh"];
	} else if (userType === "dgk") {
		return ["JRxDkaxCoI"];
	} else if (userType === "dgk/bcd") {
		return ["JRxDkaxCoI", "EgRR0prozh"];
	}
};

const getRoles = (userType: "bcd" | "dgk" | "dgk/bcd") => {
	if (userType === "bcd") {
		return ["kKQapdCCs9"];
	} else if (userType === "dgk") {
		return ["tEsx6N2IUm"];
	} else if (userType === "dgk/bcd") {
		return ["tEsx6N2IUm", "kKQapdCCs9"];
	}
};

const Koloproktologen = () => {
	const { data: userData } = useFindData({
		objectName: "User",
		fields: [
			"first_name",
			"last_name",
			"objectId",
			"username",
			"email",
			"data",
			"settings",
			"location",
			"address",
			"title",
			"emails",
			"type",
			"lists",
			"projects"
		],
		filters: [
			{
				key: "projects",
				value: ["EgRR0prozh", "JRxDkaxCoI"],
				operator: "in"
			}
		],
		limit: 1400
	});

	const { data: locationData } = useFindData({
		objectName: "Location",
		fields: ["objectId", "data"],
		filters: [
			{
				key: "projects",
				value: ["EgRR0prozh", "JRxDkaxCoI"],
				operator: "in"
			}
		],
		limit: 1400
	});

	console.log(userData);
	console.log(locationData);

	const { updateData, createData } = useDataHandler(true, false);

	const filterUsers = useCallback(async () => {
		const userWithLocation: PatstoreUser[] = [];
		const userWithSpecialistSetting: PatstoreUser[] = [];
		const userWithLocationAndSpecialistSetting: PatstoreUser[] = [];

		userData.forEach((aerzte) => {
			if (aerzte.location) {
				userWithLocation.push(aerzte);
			}
			if (aerzte.settings?.bcd?.publish_specialist) {
				userWithSpecialistSetting.push(aerzte);
			}
			if (aerzte.location && aerzte.settings?.bcd?.publish_specialist) {
				userWithLocationAndSpecialistSetting.push(aerzte);
			}
		});

		console.log("userWithLocation", userWithLocation);
		console.log("userWithSpecialistSetting", userWithSpecialistSetting);
		console.log(
			"userWithLocationAndSpecialistSetting",
			userWithLocationAndSpecialistSetting
		);
	}, [userData]);

	return (
		<div className="flex row gap-md">
			<button
				className="full_button secondary"
				disabled={!data}
				onClick={() => filterUsers()}
			>
				Filter Users
			</button>
		</div>
	);
};

export default Koloproktologen;

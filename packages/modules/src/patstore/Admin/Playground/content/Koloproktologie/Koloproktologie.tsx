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
				id: "projects",
				value: ["EgRR0prozh", "JRxDkaxCoI"],
				operator: "in"
			}
		],
		limit: 1400
	});

	console.log(userData);

	const { updateData, createData } = useDataHandler(true, false);

	const filterUsers = useCallback(async () => {
		const usersDgk = userData?.filter((user) =>
			user.projects.includes("JRxDkaxCoI")
		);

		const usersBcd = userData?.filter((user) =>
			user.projects.includes("EgRR0prozh")
		);

		const noFitsDgK = [];
		const restDgk = [];
		const noFitsBcd = [];
		const restBcd = [];

		aerzteDgk.forEach((aerzte) => {
			const user = usersDgk?.find(
				(user) => user.last_name === aerzte.Nachname
			);
			if (!user) {
				noFitsDgK.push(aerzte);
			}
		});

		usersDgk.forEach((user) => {
			const aerzte = aerzteDgk.find(
				(aerzte) => aerzte.Nachname === user.last_name
			);
			if (!aerzte) {
				restDgk.push(user);
			}
		});

		aerzteBcd.forEach((aerzte) => {
			const user = usersBcd?.find(
				(user) => user.last_name === aerzte.Nachname
			);
			if (!user) {
				noFitsBcd.push(aerzte);
			}
		});
		usersBcd.forEach((user) => {
			const aerzte = aerzteBcd.find(
				(aerzte) => aerzte.Nachname === user.last_name
			);
			if (!aerzte) {
				restBcd.push(user);
			}
		});

		const dgkDublicates = [];
		const bcdDublicates = [];

		aerzteDgk.forEach((aerzte) => {
			const user = aerzteDgk?.filter(
				(arzt) => arzt.Nachname === aerzte.Nachname
			);
			if (user.length > 1) {
				dgkDublicates.push(aerzte);
			}
		});

		aerzteBcd.forEach((aerzte) => {
			const user = aerzteBcd?.filter(
				(arzt) => arzt.Nachname === aerzte.Nachname
			);
			if (user.length > 1) {
				bcdDublicates.push(aerzte);
			}
		});

		console.log(noFitsDgK);
		console.log(noFitsBcd);

		console.log(restDgk);
		console.log(restBcd);
	}, [userData]);

	const findDublicates = useCallback(async () => {
		console.log(userData);
		const uniques = uniqBy(
			userData,
			(user: PatstoreUser) => user.last_name
		);

		const dublicates = remove(
			userData,
			(user: PatstoreUser) => !uniques.includes(user)
		);
		console.log(
			dublicates.sort((a, b) => a.last_name.localeCompare(b.last_name))
		);
	}, [userData]);

	const filterBcd = useCallback(async () => {
		const usersBcd = userData?.filter((user) =>
			user.projects.includes("EgRR0prozh")
		);
		const noFitsBcd = [];
		const fitsBcd = [];
		const restBcd = [];
		const bcdAerzte = aerzteBcd.filter(
			(aerzte) => typeof aerzte.ID === "number"
		);
		bcdAerzte.forEach((aerzte) => {
			const user = usersBcd?.find(
				(user) => user.last_name === aerzte.Nachname
			);
			if (!user) {
				noFitsBcd.push(aerzte);
			} else {
				fitsBcd.push(user);
			}
		});
		usersBcd.forEach((user) => {
			const aerzte = bcdAerzte.find(
				(aerzte) => aerzte.Nachname === user.last_name
			);
			if (!aerzte) {
				restBcd.push(user);
			}
		});
		console.log("usersBcd", usersBcd);
		console.log("bcdAerzte", bcdAerzte);
		console.log("notInDb", noFitsBcd);
		console.log("fitsBcd", fitsBcd);
		console.log("restBcd", restBcd);
	}, [userData]);

	const filterDgk = useCallback(async () => {
		const usersDgk = userData?.filter((user) =>
			user.projects.includes("JRxDkaxCoI")
		);
		const noFitsDgk = [];
		const fitsDgk = [];
		const restDgk = [];

		const dgkAerzte = aerzteDgk.filter((aerzte) => !!aerzte.Nachname);

		dgkAerzte.forEach((aerzte) => {
			const user = usersDgk?.find(
				(user) => user.last_name === aerzte.Nachname
			);
			if (!user) {
				noFitsDgk.push(aerzte);
			} else {
				fitsDgk.push(user);
			}
		});
		usersDgk.forEach((user) => {
			const aerzte = dgkAerzte.find(
				(aerzte) => aerzte.Nachname === user.last_name
			);
			if (!aerzte) {
				restDgk.push(user);
			}
		});
		console.log("usersDgk", usersDgk);
		console.log("dgkAerzte", dgkAerzte);
		console.log("notInDb", noFitsDgk);
		console.log("fitsDgk", fitsDgk);
		console.log("restDgk", restDgk);
	}, [userData]);

	const filterBcEmailList = useCallback(async () => {
		console.log("allListId: ZQRXdR278J");
		const usersBcdGesamt = userData?.filter((user) =>
			user.emails?.some((email) => email.lists.includes("ZQRXdR278J"))
		);
		const usersBcdWithType = usersBcdGesamt?.filter(
			(user) => user.type === "bcd" || user.type === "dgk/bcd"
		);
		const usersBcdWithoutType = usersBcdGesamt?.filter(
			(user) => user.type === "dgk"
		);
		console.log("usersBcdGesamt", usersBcdGesamt);
		console.log("usersBcdWithType", usersBcdWithType);
		console.log("usersBcdWithoutType", usersBcdWithoutType);
	}, [userData]);

	const filterDgEmailList = useCallback(async () => {
		console.log("allListId: g3D7DCOgIf");
		const usersDgkGesamt = userData?.filter((user) =>
			user.emails?.some((email) => email.lists.includes("g3D7DCOgIf"))
		);
		const usersDgkWithType = userData
			?.filter((user) => user.type === "dgk" || user.type === "dgk/bcd")
			.filter((user) => {
				let returnValue = false;
				user.emails?.forEach((email) => {
					if (email.lists.includes("g3D7DCOgIf")) {
						returnValue = true;
					}
				});
				return !returnValue;
			});

		const usersDgkWithoutType = usersDgkGesamt?.filter(
			(user) => user.type === "bcd"
		);
		console.log("usersDgkGesamt", usersDgkGesamt);
		console.log("usersDgkWithType", usersDgkWithType);
		console.log("usersDgkWithoutType", usersDgkWithoutType);
	}, [userData]);

	const getUsersWithoutEmail = useCallback(async () => {
		const usersWithoutEmail = userData?.filter(
			(user) => !user.emails?.length
		);
		console.log("usersWithoutEmail", usersWithoutEmail);
	}, [userData]);

	return (
		<div className="flex row gap-md">
			<button
				className="full_button secondary"
				disabled={!data}
				onClick={() => filterBcd()}
			>
				Filter BCD
			</button>
			<button
				className="full_button secondary"
				disabled={!data}
				onClick={() => filterDgk()}
			>
				Filter DGK
			</button>
			<button
				className="full_button secondary"
				disabled={!data}
				onClick={() => filterBcEmailList()}
			>
				Filter BC Email List
			</button>
			<button
				className="full_button secondary"
				disabled={!data}
				onClick={() => filterDgEmailList()}
			>
				Filter DGK Email List
			</button>
			<button
				className="full_button secondary"
				disabled={!data}
				onClick={() => getUsersWithoutEmail()}
			>
				Get Users Without Email
			</button>
		</div>
	);
};

export default Koloproktologen;

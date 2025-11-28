"use client";

import { AdminPage } from "@repo/modules";
import { gql, useQuery } from "@apollo/client";
import { convertDateToString, useDataHandler } from "@repo/provider";
import { useCallback } from "react";
import data from "./constants/data.json";
import aerzte_dgk from "./constants/aerzte_dgk.json";
import aerzte_bcd from "./constants/aerzte_bcd.json";
import { Specialist } from "./constants/types";
import { KoloproktologieUser } from "./types";
import { LocationClass } from "../../../../../../../types/src/patstore";
import { set } from "lodash-es";
import { v4 as uuidv4 } from "uuid";

const getDescrition = (header_1?: string, header_2?: string) => {
	let newString = "";
	if (header_1) {
		newString += header_1 + " ";
	}
	if (header_2) {
		newString += header_2 + " ";
	}
	return newString;
};

const Koloproktologen = () => {
	const { data: locationData } = useQuery(gql`
		query {
			objects {
				findLocation(where: { project: { _eq: "EgRR0prozh" } }) {
					results {
						objectId
						data
					}
				}
			}
		}
	`);
	const { data: userData } = useQuery(gql`
		query {
			objects {
				find_User(where: { projects: { _in: ["JRxDkaxCoI"] } }) {
					results {
						email
						username
						objectId
						data
						settings
					}
				}
			}
		}
	`);

	const { updateData, createData } = useDataHandler(true, false);

	console.log({ userData });

	const updateUsers = useCallback(async () => {
		const users = userData?.objects.find_User.results;
		console.log(users);

		console.log(aerzte_dgk);
		console.log(
			aerzte_bcd.filter((arzt) => arzt.mitgliedschaft === "Mitglied")
				.length
		);

		const filteredAerzteBcd = aerzte_bcd.filter((arzt) => !!arzt.login);

		const isEqual = [];

		const aerzteDGK = aerzte_dgk.map((arzt) => {
			return {
				type: "dgk",
				username: arzt.login,
				first_name: arzt.name,
				last_name: arzt.lname,
				password: arzt.passwd,
				email: null,
				title: arzt.title,
				address: arzt.salut,
				data: {
					dgk: {
						address: arzt.salut,
						title: arzt.title,
						name: arzt.name + " " + arzt.lname,
						postal_code: arzt.wp_zip.toString() || "",
						city: arzt.wp_city || "",
						country: arzt.wp_country || ""
					},
					bcd: {
						klinikposition: "",
						fachrichtung: "",
						belegklinik: "",
						tel: "",
						fax: "",
						email: "",
						location: ""
					}
				},
				settings: {
					dgk: {
						accept_search: arzt.publish === 1 ? true : false
					},
					bcd: {
						publish_specialist: false
					},
					newsletter: arzt.newsletter_optin === 1 ? true : false,
					newsletter_email: "other",
					newsletter_email_address: arzt.nlemail || "",
					newsletter_optin_date: convertDateToString(
						arzt.newsletter_optin_date
							? new Date(arzt.newsletter_optin_date)
							: new Date()
					),
					newsletter_optout_date: arzt.newsletter_optout_date
						? convertDateToString(
								new Date(arzt.newsletter_optout_date)
							)
						: null
				}
			} as KoloproktologieUser;
		});

		const aerzteBcD = [];
		const locations = locationData?.objects.findLocation.results;

		filteredAerzteBcd.forEach((arzt) => {
			const findArztDGKIndex = aerzteDGK.findIndex(
				(a: KoloproktologieUser) => a.username === arzt.login
			);
			const location = locations?.find(
				(location: LocationClass) =>
					location?.data?.id === Number(arzt?.praxis)
			);

			const bcdArzt = {
				type: "bcd",
				username: arzt.login,
				first_name: arzt.vorname,
				last_name: arzt.nachname,
				email: arzt.email,
				title: arzt.titel,
				address: arzt.anrede,
				location: location ? location.objectId : null,
				password: arzt.passwd,
				data: {
					dgk: {
						address: "",
						title: "",
						name: "",
						postal_code: "",
						city: "",
						country: ""
					},
					bcd: {
						fachrichtung: arzt.fachrichtung || "",
						klinikposition: arzt.klinikposition || "",
						belegklinik: arzt.belegklinik || "",
						tel: arzt.tel || "",
						fax: arzt.fax || "",
						email: arzt.email || ""
					}
				},
				settings: {
					bcd: {
						publish_specialist:
							arzt.publish_specialist.toString() === "1"
								? true
								: false
					},
					dgk: {
						accept_search: false
					},
					newsletter: arzt.newsletter === "1" ? true : false,
					newsletter_optin:
						arzt.newsletter_optin?.toString() === "1"
							? true
							: false,
					newsletter_email:
						arzt.newsletter === "1" && arzt.private_email
							? "other"
							: "existing",
					newsletter_email_address: arzt.private_email
						? arzt.private_email
						: "",
					newsletter_optin_date: convertDateToString(
						arzt.newsletter_optin_date
							? new Date(arzt.newsletter_optin_date)
							: new Date()
					),
					newsletter_optout_date: arzt.newsletter_optout_date
						? convertDateToString(
								new Date(arzt.newsletter_optout_date)
							)
						: null
				}
			} as KoloproktologieUser;

			if (findArztDGKIndex !== -1) {
				isEqual.push({
					arzt
				});
				const arztCopy = aerzteDGK[findArztDGKIndex];
				if (arztCopy) {
					set(arztCopy, "data.bcd", bcdArzt.data.bcd);
					set(arztCopy, "settings.bcd", bcdArzt.settings.bcd);
					set(arztCopy, "location", bcdArzt.location);
					set(arztCopy, "type", "dgk/bcd");
					set(arztCopy, "email", bcdArzt.email);
					set(aerzteDGK, findArztDGKIndex, arztCopy);
				}
			} else {
				aerzteBcD.push({
					...bcdArzt
				});
			}
		});

		console.log({
			aerzteBcD: aerzteBcD.sort((a, b) =>
				a.username.localeCompare(b.username)
			)
		});
		console.log({ aerzteDGK: aerzteDGK.filter((arzt) => !!arzt.username) });
		console.log({ isEqual });

		const filteredArray = aerzteDGK.filter(
			(arzt) => !users.find((user) => user.username === arzt.username)
		);
		console.log({ filteredArray });

		// const createArray = filteredArray.map((arzt) => {
		// 	const updateObject = {
		// 		...arzt,
		// 		projects:
		// 			arzt.type === "dgk"
		// 				? ["JRxDkaxCoI"]
		// 				: ["JRxDkaxCoI", "EgRR0prozh"],
		// 		roles:
		// 			arzt.type === "dgk"
		// 				? ["tEsx6N2IUm"]
		// 				: ["kKQapdCCs9", "tEsx6N2IUm"],
		// 		emailVerified: false,
		// 		module: {
		// 			__type: "Pointer",
		// 			className: "Module",
		// 			objectId: "qKRBi8FYD6"
		// 		},
		// 		project: {
		// 			__type: "Pointer",
		// 			className: "Project",
		// 			objectId: "JRxDkaxCoI"
		// 		},
		// 		password: uuidv4()
		// 	};

		// 	if (updateObject.email === null) {
		// 		delete updateObject.email;
		// 	}
		// 	if (!updateObject.username) {
		// 		updateObject["username"] =
		// 			`${arzt.first_name.toLowerCase().replace(/\s+/g, ".")}.${arzt.last_name.toLowerCase().replace(/\s+/g, ".")}`;
		// 	}

		// 	return createData({
		// 		className: "_User",
		// 		updateObject
		// 	});
		// });

		// console.log({ createArray });

		// const createArray = aerzteBcD.map(async (arzt) => {
		// 	const updateObject = {
		// 		...arzt,
		// 		projects: ["EgRR0prozh"],
		// 		roles: ["kKQapdCCs9"],
		// 		emailVerified: false,
		// 		module: {
		// 			__type: "Pointer",
		// 			className: "Module",
		// 			objectId: "yTGwUVZ8oF"
		// 		},
		// 		project: {
		// 			__type: "Pointer",
		// 			className: "Project",
		// 			objectId: "EgRR0prozh"
		// 		}
		// 	};
		// 	if (updateObject.email === null) {
		// 		delete updateObject.email;
		// 	}

		// 	return await createData({
		// 		className: "_User",
		// 		updateObject
		// 	});
		// });

		// await Promise.all(createArray);
	}, [userData, locationData]);

	const dataHandler = useCallback(async () => {
		const users = userData?.objects.find_User.results;
	}, [data, userData]);

	console.log({ data });
	return (
		<AdminPage title={"Playground"} emptyContent={true}>
			<p>Playground</p>
			<div className="flex row gap-md">
				<button
					className="full_button secondary"
					disabled={!data}
					onClick={() => dataHandler()}
				>
					Upload Users
				</button>
				<button
					className="full_button secondary"
					disabled={!data}
					onClick={() => updateUsers()}
				>
					Update Users
				</button>
			</div>
		</AdminPage>
	);
};

export default Koloproktologen;

"use client";

import { AdminPage } from "@repo/modules";
import { gql, useQuery } from "@apollo/client";
import { useDataHandler } from "@repo/provider";
import { useCallback } from "react";
import data from "./constants/data.json";
import aerzte from "./constants/aerzte.json";
import { Specialist } from "./constants/types";

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
	console.log({ userData });
	console.log({ aerzte });

	const { updateData, createData } = useDataHandler(true, false);

	const updateUsers = useCallback(() => {
		const users = userData?.objects.find_User.results;

		console.log(aerzte);

		// users.forEach((user) => {
		// 	updateData({
		// 		className: "_User",
		// 		objectId: user.objectId,
		// 		updateObject: {
		// 			projects: ["JRxDkaxCoI"]
		// 		}
		// 	});
		// });
	}, [userData]);

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
				<button
					disabled={!data}
					className="full_button primary"
					onClick={() => {
						const aerzteArray = aerzte.filter(
							(arz: Specialist) =>
								arz.mitgliedschaft !== "Mitglied"
						);
						const aerzteArray2 = aerzte.filter(
							(arz: Specialist) =>
								arz.mitgliedschaft === "Mitglied"
						);
						const users = userData?.objects.find_User.results;
						const userArray = aerzte.filter(
							(arz: Specialist) =>
								!users.find(
									(user: UserClass) =>
										user.username === arz.login
								)
						);
						console.log(userArray);
						console.log(aerzte.length);
						console.log(
							` ${aerzteArray.length} users with Mitgliedschaft`
						);
						console.log(
							` ${aerzteArray2.length} users without Mitgliefschaft`
						);
						console.log(userData?.objects.find_User.results.length);
					}}
				>
					Filter Ärzte
				</button>
			</div>
		</AdminPage>
	);
};

export default Koloproktologen;

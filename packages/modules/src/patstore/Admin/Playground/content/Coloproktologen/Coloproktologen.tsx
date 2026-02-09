"use client";

import { AdminPage } from "@repo/modules";
import { gql, useQuery } from "@apollo/client";
import { convertDateToString, useDataHandler } from "@repo/provider";
import { useCallback } from "react";
import data from "./constants/data.json";
import arzt from "./constants/arzt.json";
import { Specialist } from "./constants/types";
import { LocationClass } from "@repo/types";



const Playground = () => {
	const { data: locationData } = useQuery(gql`
		query {
			objects {
				findLocation(where: { project: { equalTo: "EgRR0prozh" } }) {
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
				find_User(where: { project: { equalTo: "EgRR0prozh" } }) {
					results {
						email
						username
						objectId
						location
						data
						settings
					}
				}
			}
		}
	`);

	console.log(locationData);

	const { updateData, createData } = useDataHandler(true, false);

	const updateUsers = useCallback(() => {
		const users = userData?.objects.find_User.results;

		console.log(users);

		users.forEach((user) => {
			updateData({
				className: "_User",
				objectId: user.objectId,
				updateObject: {
					projects: ["EgRR0prozh"]
				}
			});
		});
	}, [locationData, userData]);

	const dataHandler = useCallback(async () => {
		const locations = locationData?.objects.findLocation.results;
		const users = userData?.objects.find_User.results;

		if (locations.length === 0 || users.length === 0) {
			console.log("No locations or users found");
			return;
		}

		const arztArray = arzt.filter(
			(arz: Specialist) => arz?.mitgliedschaft === "Mitglied"
		);

		const promises = arztArray.map(async (arz: Specialist) => {
			if (users.find((user: UserClass) => user.username === arz.login)) {
				console.log(`User already exists: ${arz.login}`);
				return;
			}
			const location = locations?.find(
				(location: LocationClass) => location?.data?.id === arz?.praxis
			);

			const updateObject = {
				project: {
					__type: "Pointer",
					className: "Project",
					objectId: "EgRR0prozh"
				},
				module: {
					__type: "Pointer",
					className: "Module",
					objectId: "yTGwUVZ8oF"
				},
				username: arz?.login,
				password: arz?.passwd,
				name: arz?.vorname + " " + arz?.nachname,
				title: arz?.titel,
				address: arz?.anrede,
				first_name: arz?.vorname,
				last_name: arz?.nachname,
				description: arz?.fachrichtung,
				location: location?.objectId,
				roles: ["kKQapdCCs9"],
				data: {
					email: arz?.email,
					id: arz?.id,
					spezialist: arz?.spezialist,
					mitgliedschaft: arz?.mitgliedschaft,
					fachrichtung: arz?.fachrichtung,
					klinikposition: arz?.klinikposition,
					belegklinik: arz?.belegklinik,
					homepage: arz?.homepage
				},
				settings: {
					newsletter_optin:
						arz?.newsletter_optin.toString() === "1" ? true : false,
					newsletter_optin_date: arz?.newsletter_optin_date
						? convertDateToString(
								new Date(arz?.newsletter_optin_date)
							)
						: null,
					newsletter_optout_date: arz?.newsletter_optout_date
						? convertDateToString(
								new Date(arz?.newsletter_optout_date)
							)
						: null,
					publish_specialist:
						arz?.publish_specialist === 1 ? true : false
				}
			};

			return await createData({
				className: "_User",
				updateObject
			});
		});

		await Promise.all(promises);
	}, [data, locationData, userData]);

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
						const arztArray = arzt.filter(
							(arz: Specialist) =>
								arz.mitgliedschaft !== "Mitglied"
						);
						const arztArray2 = arzt.filter(
							(arz: Specialist) =>
								arz.mitgliedschaft === "Mitglied"
						);
						const users = userData?.objects.find_User.results;
						const userArray = arzt.filter(
							(arz: Specialist) =>
								!users.find(
									(user: UserClass) =>
										user.username === arz.login
								)
						);
						console.log(userArray);
						console.log(arzt.length);
						console.log(
							` ${arztArray.length} users with Mitgliedschaft`
						);
						console.log(
							` ${arztArray2.length} users without Mitgliefschaft`
						);
						console.log(userData?.objects.find_User.results.length);
						console.log(
							locationData?.objects.findLocation.results.length
						);
					}}
				>
					Filter Ärzte
				</button>
			</div>
		</AdminPage>
	);
};

export default Playground;

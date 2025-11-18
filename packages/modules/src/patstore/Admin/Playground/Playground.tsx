"use client";

import { AdminPage } from "@repo/modules";
import { gql, useQuery } from "@apollo/client";
import { convertDateToString, useDataHandler } from "@repo/provider";
import { useCallback } from "react";
import data from "./constants/data.json";
import { Specialist } from "./constants/types";
import { LocationClass } from "../../../../../types/src/patstore";

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

const Playground = () => {
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

	console.log(locationData);

	const { updateData, createData } = useDataHandler(true, false);

	const dataHandler = useCallback(async () => {
		const locations = locationData?.objects.findLocation.results;
		console.log(data.arzt.length);
		console.log(data.arzt.slice(0, 10));
		console.log(
			data.arzt.filter(
				(arz: Specialist) => arz?.mitgliedschaft === "Mitglied"
			).length
		);

		const arztArray = data.arzt.filter(
			(arz: Specialist) => arz?.mitgliedschaft === "Mitglied"
		);

		arztArray.forEach((arz: Specialist) => {
			const secArz = arztArray.find(
				(secArz: Specialist) =>
					secArz.login === arz.login && secArz.id !== arz.id
			);
			if (secArz) {
				console.log(
					`Dublicate Login: ${arz.login} - ${arz.id} - ${secArz.id}`
				);
			}
		});

		const promises = arztArray.map(async (arz: Specialist) => {
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

			if (arz.email) {
				updateObject.email = arz.email;
			}

			return await createData({
				className: "_User",
				updateObject
			});
		});

		await Promise.all(promises);
	}, [data, locationData]);

	console.log({ data });
	return (
		<AdminPage title={"Playground"} emptyContent={true}>
			<p>Playground</p>
			<button disabled={!data} onClick={() => dataHandler()}>
				Click
			</button>
		</AdminPage>
	);
};

export default Playground;

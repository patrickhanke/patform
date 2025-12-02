"use client";

import { AdminPage } from "@repo/modules";
import { gql, useQuery } from "@apollo/client";
import { useDataHandler } from "@repo/provider";
import { useCallback } from "react";
import data from "./constants/data.json";
import aerzte_bcd from "./constants/aerzte_bcd.json";

const Koloproktologen = () => {
	const { data: userData } = useQuery(gql`
		query {
			objects {
				find_User(
					where: { projects: { _in: ["EgRR0prozh", "JRxDkaxCoI"] } }
				) {
					results {
						label
						objectId
						username
						data
						settings
					}
				}
			}
		}
	`);

	console.log(userData);

	const { updateData, createData } = useDataHandler(true, false);

	const updateUsers = useCallback(async () => {
		const users = userData?.objects.find_User.results;

		const newsletterUsers = users.filter(
			(user) => user.settings.newsletter === true
		);

		console.log(newsletterUsers);
	}, [userData]);

	return (
		<AdminPage title={"Playground"} emptyContent={true}>
			<p>Playground</p>
			<div className="flex row gap-md">
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

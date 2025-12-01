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
				find_User(where: { projects: { _in: "EgRR0prozh" } }) {
					results {
						objectId
						username
						data
					}
				}
			}
		}
	`);

	const { updateData, createData } = useDataHandler(true, false);

	const updateUsers = useCallback(async () => {
		const users = userData?.objects.find_User.results;

		console.log(users);

		const updateArray = [];

		users.forEach((user) => {
			const userResult = aerzte_bcd.find(
				(aerzte) => aerzte.login === user.username
			);
			if (!userResult) {
				return;
			}
			const updateObject = {
				data: {
					...user.data,
					bcd: {
						...user.data.bcd,
						spezialist:
							userResult.spezialist === "1" ? true : false,
						publish_specialist:
							userResult.publish_specialist === "1" ? true : false
					}
				}
			};

			console.log(userResult);

			console.log(updateObject);

			updateArray.push(
				updateData({
					className: "_User",
					objectId: user.objectId,
					updateObject
				})
			);
		});

		await Promise.all(updateArray);
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

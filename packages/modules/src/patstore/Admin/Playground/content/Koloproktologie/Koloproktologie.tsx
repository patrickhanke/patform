"use client";

import { useDataHandler, useFindData } from "@repo/provider";
import { useCallback } from "react";
import data from "./constants/data.json";
import { PatstoreUser } from "@repo/types";
import usersJson from "./constants/users.json";

const Koloproktologen = () => {
	const { data: userData } = useFindData({
		objectName: "User",
		fields: [
			"label",
			"first_name",
			"last_name",
			"objectId",
			"username",
			"data",
			"settings",
			"address",
			"title",
			"salutation",
			"salut",
			"emails",
			"type"
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

	const updateUsers = useCallback(async () => {
		const users = userData;
		users.forEach((user) => {
			const jsonUser = usersJson.find(
				(u) => u.username === user.username
			);
			console.log(jsonUser);
			updateData({
				className: "_User",
				objectId: user.objectId,
				updateObject: {
					pre_title: jsonUser?.title || null
				}
			});
		});
	}, [userData]);

	const updateSalutation = useCallback(async () => {
		const users = userData;
		const updatedUsers = users.map((user) =>
			updateData({
				className: "_User",
				objectId: user.objectId,
				updateObject: {
					salutation: user.address
				}
			})
		);

		await Promise.all(updatedUsers);
	}, [userData]);

	return (
		<div className="flex row gap-md">
			<button
				className="full_button secondary"
				disabled={!data}
				onClick={() => updateUsers()}
			>
				Update Users
			</button>
		</div>
	);
};

export default Koloproktologen;

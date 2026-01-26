"use client";

import { useDataHandler, useFindData } from "@repo/provider";
import { useCallback } from "react";
import data from "./constants/data.json";
import usersJson from "./constants/users.json";
import aerzteBcd from "./26_01_2026/data_bcd.json";
import aerzteDgk from "./26_01_2026/data_dgk.json";

const Koloproktologen = () => {
	const { data: userData } = useFindData({
		objectName: "User",
		fields: [
			"first_name",
			"last_name",
			"objectId",
			"username",
			"data",
			"settings",
			"address",
			"title",
			"emails",
			"type",
			"lists"
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
		// const users = userData;
		console.log(aerzteBcd.length);
		console.log(aerzteDgk.length);

		const dublicates = aerzteBcd.filter((bcd) =>
			aerzteDgk.some(
				(dgk) =>
					dgk.Vorname === bcd.Vorname && dgk.Nachname === bcd.Nachname
			)
		);

		console.log(dublicates);
		console.log(dublicates.length);
	}, [userData]);

	return (
		<div className="flex row gap-md">
			{/* <button
				className="full_button secondary"
				disabled={!data}
				onClick={() => updateUsers()}
			>
				Update Users
			</button> */}
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

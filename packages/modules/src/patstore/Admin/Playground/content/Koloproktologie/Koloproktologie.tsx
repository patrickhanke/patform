"use client";

import { useDataHandler, useFindData } from "@repo/provider";
import { useCallback } from "react";
import data from "./constants/data.json";
import { PatstoreUser } from "@repo/types";
import usersJson from "./constants/users.json";
import aerzteBcd from "./constants/aerzte_bcd.json";
import aerzteDgk from "./constants/aerzte_dgk.json";

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
			"emails",
			"type",
			"lists",
			"emails"
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

	const filterUsers = useCallback(async () => {
		// const users = userData;
		console.log(aerzteBcd.length);
		const bcdWithNewsletter = aerzteBcd.filter((aerzte) => {
			return aerzte.newsletter_optin === "1";
		});
		const bcdWithNewsletterLogin = aerzteBcd.filter((aerzte) => {
			return aerzte.newsletter === "0";
		});

		console.log(bcdWithNewsletter);
		console.log(bcdWithNewsletterLogin);

		const allBcd = [];

		aerzteBcd.forEach((aerzte) => {
			if (bcdWithNewsletter.find((bcd) => bcd.login === aerzte.login)) {
				allBcd.push(aerzte);
			} else if (
				bcdWithNewsletterLogin.find((bcd) => bcd.login === aerzte.login)
			) {
				allBcd.push(aerzte);
			}
		});

		console.log(allBcd);

		const bcdNewsletter = userData.filter((user) => {
			return user.lists?.includes("JaTGOQX4pZ");
		});
		console.log(bcdNewsletter);
		const bcdNewsletterMissing = bcdWithNewsletter.filter((user) => {
			return !bcdNewsletter.find(
				(aerzte) => aerzte.username === user.login
			);
		});

		console.log(bcdNewsletterMissing);

		const holchinIserData = bcdNewsletterMissing.find(
			(user) => user.login === "philipp.holch"
		);
		console.log(holchinIserData);
		const missingUserData = aerzteBcd.filter((arzt) => {
			return !userData.find((user) => user.last_name === arzt.nachname);
		});
		console.log(missingUserData);
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

"use client";

import { useDataHandler, useFindData } from "@repo/provider";
import { useCallback } from "react";
import data from "./constants/data.json";
import { PatstoreUser } from "@repo/types";

const Koloproktologen = () => {
	const { data: userData } = useFindData({
		objectName: "User",
		fields: [
			"label",
			"objectId",
			"username",
			"data",
			"settings",
			"address",
			"title",
			"salutation",
			"salut",
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
			const userSettings = user.settings;
			const updateObject: Partial<PatstoreUser> = {
				title: user.address,
				pre_title: user.title,
				post_title: undefined
			};

			if (
				userSettings.newsletter_optin === true &&
				userSettings.newsletter_email
			) {
				if (user.type === "dgk") {
					updateObject.lists = ["QY2tNfkk0L"];
					const userEmails = user.emails || {};
					userEmails["email"] = userSettings.newsletter_email;
					userEmails["name"] = user.name;
					userEmails["QY2tNfkk0L"] = {
						email: userSettings.newsletter_email,
						name: `${user.first_name} ${user.last_name}`,
						optinDate: userSettings.newsletter_optin_date,
						optoutDate: userSettings.newsletter_optout_date
					};
					updateObject.emails = userEmails;
				} else if (user.type === "bcd") {
					updateObject.lists = ["JaTGOQX4pZ"];
					const userEmails = user.emails || {};
					userEmails["email"] = userSettings.newsletter_email;
					userEmails["name"] = user.name;
					userEmails["JaTGOQX4pZ"] = {
						email: userSettings.newsletter_email,
						name: `${user.first_name} ${user.last_name}`,
						optinDate: userSettings.newsletter_optin_date,
						optoutDate: userSettings.newsletter_optout_date
					};
					updateObject.emails = userEmails;
				} else {
					updateObject.lists = ["QY2tNfkk0L", "JaTGOQX4pZ"];
					const userEmails = user.emails || {};
					userEmails["email"] = userSettings.newsletter_email;
					userEmails["name"] = user.name;
					userEmails["QY2tNfkk0L"] = {
						email: userSettings.newsletter_email,
						name: `${user.first_name} ${user.last_name}`,
						optinDate: userSettings.newsletter_optin_date,
						optoutDate: userSettings.newsletter_optout_date
					};
					userEmails["JaTGOQX4pZ"] = {
						email: userSettings.newsletter_email,
						name: `${user.first_name} ${user.last_name}`,
						optinDate: userSettings.newsletter_optin_date,
						optoutDate: userSettings.newsletter_optout_date
					};
					updateObject.emails = userEmails;
				}
			}
			console.log(updateObject);
			updateData({
				className: "_User",
				objectId: user.objectId,
				updateObject: updateObject
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

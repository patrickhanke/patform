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
			"salut"
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
			let updateObject: Partial<PatstoreUser> = {
				title: user.address,
				pre_title: user.title,
				post_title: undefined
			};

			if (
				userSettings.newsletter_optin === true &&
				userSettings.newsletter_email
			) {
				updateObject = {
					...updateObject,
					newsletter_optin: true,
					newsletter_email: userSettings.newsletter_email,
					newsletter_optin_date: {
						__type: "Date",
						iso: userSettings.newsletter_optin_date
							? new Date(
									userSettings.newsletter_optin_date
								).toISOString()
							: new Date().toISOString()
					},
					newsletter_optout_date: userSettings.newsletter_optout_date
						? {
								__type: "Date",
								iso: new Date(
									userSettings.newsletter_optout_date
								).toISOString()
							}
						: null
				};
				console.log(updateObject);
			} else if (userSettings.newsletter_optin === false) {
				updateObject = {
					...updateObject,
					newsletter_optin: false,
					newsletter_optin_date: {
						__type: "Date",
						iso: userSettings.newsletter_optin_date
							? new Date(
									userSettings.newsletter_optin_date
								).toISOString()
							: null
					},
					newsletter_optout_date: {
						__type: "Date",
						iso: userSettings.newsletter_optout_date
							? new Date(
									userSettings.newsletter_optout_date
								).toISOString()
							: null
					}
				};
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

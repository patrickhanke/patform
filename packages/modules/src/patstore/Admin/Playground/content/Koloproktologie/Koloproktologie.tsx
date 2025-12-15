"use client";

import { AdminPage } from "@repo/modules";
import { gql, useQuery } from "@apollo/client";
import { convertDateToString, useDataHandler } from "@repo/provider";
import { useCallback } from "react";
import data from "./constants/data.json";
import aerzte_bcd from "./constants/aerzte_bcd.json";
import aerzte_dgk from "./constants/aerzte_dgk.json";
import aerzte from "./constants/aerzte.json";

const Koloproktologen = () => {
	const aerzteDgK = aerzte_dgk.filter(
		(aerzt) => aerzt.newsletter_optin === 1
	);

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
						address
					}
				}
			}
		}
	`);

	console.log(userData);

	const { updateData, createData } = useDataHandler(true, false);

	const updateUsers = useCallback(async () => {
		console.log(aerzte);

		const users = userData?.objects.find_User.results;

		const isEmail = (email: string) => {
			if (!email) return false;
			return email.includes("@") && email.includes(".");
		};
		const newsletterUsers = aerzte_bcd.filter(
			(user) =>
				user.newsletter_optin?.toString() === "1" && isEmail(user.email)
		);

		console.log({ newsletterUsers });

		const updatedUsers = users.map((user) => {
			const optin =
				user.settings.newsletter === true ||
				user.settings.newsletter_optin === true;

			const getEmail = () => {
				if (user.settings.newsletter_email === "existing") {
					if (user.email) {
						return user.email;
					} else if (
						user.settings.newsletter_email_address &&
						isEmail(user.settings.newsletter_email_address)
					) {
						return user.settings.newsletter_email_address;
					} else {
						return "";
					}
				} else if (user.settings.newsletter_email === "other") {
					if (isEmail(user.settings.newsletter_email_address)) {
						return user.settings.newsletter_email_address;
					} else if (isEmail(user.email)) {
						return user.email;
					} else {
						return "";
					}
				} else if (isEmail(user.settings.newsletter_email)) {
					return user.settings.newsletter_email;
				} else {
					return "";
				}
			};

			return {
				...user,
				settings: {
					dgk: {
						...user.settings.dgk
					},
					bcd: {
						...user.settings.bcd
					},
					newsletter_optin: optin,
					newsletter_email: optin ? getEmail() : "",
					newsletter_optin_date:
						user.settings.newsletter_optin_date || "",
					newsletter_optout_date:
						user.settings.newsletter_optout_date || ""
				}
			};
		});

		console.log(
			updatedUsers.filter(
				(user) =>
					user.settings.newsletter_optin === true &&
					user.settings.newsletter_email !== ""
			)
		);
		console.log(
			updatedUsers.filter(
				(user) => user.settings.newsletter_optin === false
			)
		);
		const updateArray = updatedUsers.map(async (user) => {
			return await updateData({
				className: "_User",
				objectId: user.objectId,
				updateObject: {
					settings: user.settings
				}
			});
		});

		await Promise.all(updateArray);
	}, [userData]);

	const updateSalutation = useCallback(async () => {
		const users = userData?.objects.find_User.results;
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
				onClick={() => updateSalutation()}
			>
				Update Users
			</button>
		</div>
	);
};

export default Koloproktologen;

"use client";

import { FC, useEffect } from "react";
import styles from "./UserMessage.module.scss";
import clsx from "clsx";
import { Notification } from "@repo/types";
import RenderNotification from "./components/RenderNotification";
import { UserMessagesProps } from "./types";

const UserMessages: FC<UserMessagesProps> = ({
	notifications,
	setNotificationsToRead,
	deleteNotification
}) => {
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (
				document.visibilityState === "visible" &&
				!!setNotificationsToRead
			) {
				setNotificationsToRead();
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			document.removeEventListener(
				"visibilitychange",
				handleVisibilityChange
			);
		};
	}, []);

	if (!notifications || notifications.length === 0) {
		return (
			<div>
				<p>Gegenwärtig keine neuen Nachrichten vorhanden</p>
			</div>
		);
	}

	return (
		<>
			<h3>Nachrichten</h3>
			<div
				className={clsx(
					"content_element",
					"no_padding",
					styles.user_messages_container
				)}
			>
				{notifications &&
					notifications.map(
						(
							notification: Notification & { divider?: boolean }
						) => (
							<RenderNotification
								key={notification.id}
								title={notification.title}
								body={notification.body}
								timestamp={notification.timestamp}
								read={notification.read}
								image={notification.image}
								id={notification.id}
								deleteNotification={deleteNotification}
								data={notification.data}
							/>
						)
					)}
			</div>
		</>
	);
};

export default UserMessages;

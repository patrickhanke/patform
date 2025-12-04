"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import UserContext from "./UserContext";
import { axiosclient, generateGraphQLQuery } from "@repo/provider";
import Cookies from "js-cookie";
import useStorage from "./hooks/useStorage";
import { PatflowProject, PatflowUser } from "@repo/types";
import { useQuery } from "@apollo/client";
import find_user_messages from "./constants/find_user_messages";

const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
	const token = Cookies.get(process.env.SESSION_TOKEN as string);
	// const [project, setProject] = useState('');
	const { getItem, setItem } = useStorage();

	const [user, setUser] = useState<PatflowUser | null>(
		getItem("user", "session", "object") || null
	);

	const { data: messageData, refetch } = useQuery(find_user_messages, {
		variables: {
			params: {
				user: { _eq: getItem("user", "session", "object")?.objectId }
			}
		},
		pollInterval: 10000,
		skip: !getItem("user", "session", "object")
	});

	const userMessages = useMemo(() => {
		if (messageData) {
			return messageData.objects.findMessage.results;
		}
		return [];
	}, [messageData]);

	// get user

	const getUserData = useCallback(async () => {
		axiosclient()
			.get("/users/me")
			.then((response) => {
				setItem("user", response.data, "session");
				setItem("project", response.data.project.objectId, "session");
				setUser(response.data);
			})
			.catch((error) => console.error(error.message));
	}, [getItem("user", "session", "object")]);

	const { data: projectData } = useQuery(
		generateGraphQLQuery({
			type: "get",
			objectName: "_User",
			fields: [
				"objectId",
				"project {name objectId path time_settings record_settings}"
			]
		}),
		{
			skip: !user,
			variables: {
				id: user?.objectId
			}
		}
	);

	const userContextObject = useMemo(
		() => ({
			user: getItem("user", "session", "object") || ({} as PatflowUser),
			projectId: "B2vfHKzxqE",
			project:
				projectData?.objects.get_User.project || ({} as PatflowProject),
			getUserData,
			userMessages,
			refetchMessages: refetch
		}),
		[token, user, projectData, messageData]
	);

	useEffect(() => {
		if (token && !user) {
			getUserData();
		}
	}, []);

	return (
		<UserContext.Provider value={userContextObject}>
			{children}
		</UserContext.Provider>
	);
};

export default UserContextProvider;

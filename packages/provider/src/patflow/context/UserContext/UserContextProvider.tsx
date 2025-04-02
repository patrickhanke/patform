"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import UserContext from "./UserContext";
import { axiosclient, generateGraphQLQuery } from "@repo/provider";
import Cookies from "js-cookie";
import useStorage from "./hooks/useStorage";
import { PatflowProject, PatflowUser } from "@repo/types";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import find_user_messages from "./constants/find_user_messages";

const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
	const token = Cookies.get(process.env.SESSION_TOKEN as string);
	// const [project, setProject] = useState('');
	const { getItem, setItem } = useStorage();

	const { data: messageData, refetch } = useQuery(find_user_messages, {
		variables: {
			params: {
				user: { _eq: getItem("user", "session", "object")?.objectId }
			}
		},
		pollInterval: 10000,
		skip: !getItem("user", "session", "object")
	});

	const router = useRouter();

	const userMessages = useMemo(() => {
		if (messageData) {
			return messageData.objects.findMessage.results;
		}
		return [];
	}, [messageData]);

	// get user
	const loginUser = async ({
		username,
		password
	}: {
		username: string;
		password: string;
	}) => {
		await axiosclient()
			.post("login", {
				username: username,
				password: password
			})
			.then((response) => {
				Cookies.set("patstore_token", response.data.sessionToken, {
					expires: 90
				});
				setItem("user", response.data, "session", "object");
				setItem("project", response.data.project.objectId, "session");
				router.push("/");
			})

			.catch((error) => {
				if (error.message === "Invalid username/password.") {
					window.alert("Falsche E-Mail / Passwort Kombination");
				} else {
					window.alert("Das Einloggen ist leider fehlgeschlagen");
				}
			});
	};

	const getUserData = useCallback(async () => {
		axiosclient()
			.get("/users/me")
			.then((response) => {
				setItem("user", response.data, "session");
				setItem("project", response.data.project.objectId, "session");
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
			skip: !getItem("user", "session", "object")?.objectId,
			variables: {
				id: getItem("user", "session", "object")?.objectId
			}
		}
	);

    console.log("projectData", projectData);
    

	const userContextObject = useMemo(
		() => ({
			user: getItem("user", "session", "object") || ({} as PatflowUser),
			loginUser,
			projectId: "B2vfHKzxqE",
			project:
				projectData?.objects.get_User.project || ({} as PatflowProject),
			getUserData,
			userMessages,
			refetchMessages: refetch
		}),
		[token, getItem("user", "session", "object"), projectData, messageData]
	);

	useEffect(() => {
		if (token && !getItem("user", "session", "object")) {
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

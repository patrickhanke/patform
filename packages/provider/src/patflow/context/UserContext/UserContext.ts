"use client";

import React from "react";
import { Message, PatflowProject, PatflowUser } from "@repo/types";

interface ContextValues {
	user: PatflowUser;
	loginUser: ({
		username,
		password
	}: {
		username: string;
		password: string;
	}) => Promise<void>;
	projectId: string;
	project: PatflowProject;
	getUserData: () => void;
	userMessages: Message[];
	refetchMessages: () => void;
}

const UserContext = React.createContext({} as ContextValues);

export default UserContext;

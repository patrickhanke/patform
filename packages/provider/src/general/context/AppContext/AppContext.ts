"use client";

import React from "react";
import { AppEnvironment, ContextValues } from "./types";

export const AppContext = React.createContext(
	{} as ContextValues<AppEnvironment>
);

"use client";

import React from "react";
import { Response } from "@repo/types";

export interface DataContextProps {
	feedbackHandler: (response: Response) => void;
	loadingHandler: (loadingValue: boolean) => void;
}

const DataContext = React.createContext<DataContextProps | undefined>({
	feedbackHandler: () => {},
	loadingHandler: () => {}
});

export default DataContext;

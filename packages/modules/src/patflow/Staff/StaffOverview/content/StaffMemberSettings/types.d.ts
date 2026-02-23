import { PatflowUser } from "@repo/types";
import { Dispatch, SetStateAction } from "react";

export type ChangeUserSettingsProps = {
	data: PatflowUser["data"];
	setData: Dispatch<SetStateAction<PatflowUser["data"]>>;
};

import { PatflowUser } from "@repo/types";
import { Dispatch, SetStateAction } from "react";

export type ChangeUserSettingsProps = {
	data: Partial<PatflowUser>;
	setData: Dispatch<SetStateAction<Partial<PatflowUser> | undefined>>;
};

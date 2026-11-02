import { PatflowUser } from "@repo/types";
import { Dispatch, SetStateAction } from "react";

export type UserOverviewProps = {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export type StaffMemberContactData = {
	first_name: string;
	last_name: string;
	data: PatflowUser["data"] & { email?: string; phone?: string };
};

export type ChangeUserSettingsProps = {
	data: StaffMemberContactData;
	setData: Dispatch<SetStateAction<StaffMemberContactData>>;
};

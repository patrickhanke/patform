import { PatflowUser } from "@repo/types";
import { Dispatch, SetStateAction } from "react";

export type ChangeUserSettingsProps = {
	data: StaffMemberData;
	setData: Dispatch<SetStateAction<StaffMemberData>>;
};

export type StaffMemberSettingsProps = {
	initialData: StaffMemberData;
	userId: string;
	refetch: ApolloRefetch;
};

export type StaffMemberData = {
	first_name: string;
	last_name: string;
	data: PatflowUser["data"];
};

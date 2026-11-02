import { PatflowUser } from "@repo/types";
import { StaffMemberContactData } from "../types";

const defaultDataFields = (): StaffMemberContactData["data"] => ({
	street: "",
	zip: "",
	city: "",
	email: "",
	phone: ""
});

export const normalizeStaffContactData = (
	user: Pick<
		PatflowUser,
		"first_name" | "last_name" | "email" | "data"
	>
): StaffMemberContactData => {
	const rawData =
		typeof user.data === "string"
			? (JSON.parse(user.data) as Record<string, string>)
			: user.data;

	const nested = (rawData ?? {}) as StaffMemberContactData["data"] & {
		email?: string;
		phone?: string;
	};

	return {
		first_name: user.first_name ?? "",
		last_name: user.last_name ?? "",
		data: {
			...defaultDataFields(),
			...nested,
			email: nested.email ?? user.email ?? ""
		}
	};
};

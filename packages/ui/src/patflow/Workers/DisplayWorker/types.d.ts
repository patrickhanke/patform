import { StaffMember } from "@repo/types";

export type DisplayWorkersProps = {
	workerId: StaffMember["objectId"];
	nextDate?: string;
	showState?: boolean;
	showAvailability?: boolean;
	onlyImage?: boolean;
	propertyId?: string;
};

import { ReactNode } from "react";

export type WorkerOption = {
	value: string;
	id: string;
	label: string;
	element: ReactNode;
};

export type DisplayWorkersProps = {
	propertyId: string;
	assignedStaff: string[];
	refetch: () => void;
};

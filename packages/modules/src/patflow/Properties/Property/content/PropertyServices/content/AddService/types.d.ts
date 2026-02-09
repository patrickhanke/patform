import { CreateService } from "@repo/types";
import { Dispatch, SetStateAction } from "react";

export type AddServiceProps = {
	addService: boolean;
	setAddService: Dispatch<SetStateAction<boolean>>;
	propertyId: string;
};

export type SelectWorkerProps = {
	setService: Dispatch<SetStateAction<CreateService>>;
	service: CreateService;
	propertyId: string;
};

export type PropertyOptions = {
	value: string;
	id: string;
	label: string;
	element: ReactNode;
};

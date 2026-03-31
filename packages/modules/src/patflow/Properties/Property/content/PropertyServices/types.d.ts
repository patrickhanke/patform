import { Dispatch, SetStateAction } from "react";
import { PropertyService } from "@repo/types";

export type PropertyServicesProps = {
	objectId: string;
	addService: boolean;
	propertyServices: PropertyService[];
	setAddService: Dispatch<SetStateAction<boolean>>;
};

export type PropertyServiceChangeHandler = (id: string, key: string, value: any) => void;

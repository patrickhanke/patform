"use client";

import { createContext, useContext } from "react";
import {
	ApolloRefetch,
	BookingClass,
	LedgerBooking,
	ModuleForPath,
	PersonClass,
	SavingRule,
	SavingsGroupMember,
	SavingsGroupModuleData
} from "@repo/types";
import { CreateParseObject } from "../functions/bookingApi";

export type DisplayMember = SavingsGroupMember & {
	personName?: string;
};

export type SavingsGroupContextValue = {
	module: ModuleForPath<"/savings-group">;
	moduleData: SavingsGroupModuleData;
	savingRule: SavingRule;
	currency: string;
	members: DisplayMember[];
	activeMembers: DisplayMember[];
	people: PersonClass[];
	bookings: LedgerBooking[];
	bookingRows: BookingClass[];
	loading: boolean;
	refetch: ApolloRefetch;
	createData: CreateParseObject;
	updateData: (params: {
		className: string;
		objectId: string;
		updateObject: Record<string, unknown>;
		feedback?: string;
	}) => Promise<unknown>;
	deleteData: (params: {
		className: string;
		objectId: string;
		feedback?: string;
	}) => Promise<unknown>;
	peopleModuleId?: string;
};

const SavingsGroupContext = createContext<SavingsGroupContextValue | null>(
	null
);

export const SavingsGroupProvider = SavingsGroupContext.Provider;

export const useSavingsGroup = () => {
	const value = useContext(SavingsGroupContext);
	if (!value) {
		throw new Error("useSavingsGroup must be used within SavingsGroup");
	}
	return value;
};

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
	ApolloRefetch,
	BookingClass,
	Module,
	ModuleForPath,
	PersonClass
} from "@repo/types";
import {
	useAppContext,
	useDataHandlerSecure,
	useFindData,
	useGetData
} from "@repo/provider";
import { BOOKING_FIELDS } from "../constants/defaults";
import { pocketSort } from "../functions/calc";
import {
	toLedgerBooking,
	moduleDataFromSettings
} from "../functions/normalize";
import {
	fetchBookingsRest,
	personNameFromClass
} from "../functions/bookingApi";
import { DisplayMember, SavingsGroupContextValue } from "./SavingsGroupContext";

const useSavingsGroupData = (
	module: ModuleForPath<"/savings-group">
): SavingsGroupContextValue => {
	const { project } = useAppContext();
	const { createData, updateData, deleteData } = useDataHandlerSecure();
	const [restBookings, setRestBookings] = useState<BookingClass[]>([]);

	const peopleModuleId = (project?.modules || []).find(
		(item: Module) => item.path === "/people"
	)?.objectId;

	const { data: moduleRow, refetch: refetchModule } = useGetData({
		objectName: "Module",
		fields: ["objectId", "settings", "name"],
		id: module.objectId
	});

	const {
		data: bookingRowsFromGraphQl,
		refetch: refetchBookings,
		loading: bookingsLoading,
		error: bookingsError
	} = useFindData<BookingClass>({
		objectName: "Booking",
		fields: BOOKING_FIELDS,
		moduleId: module.objectId,
		projectId: project?.objectId,
		limit: 10000,
		skipQuery: !module.objectId
	});

	const { data: people, refetch: refetchPeople } = useFindData<PersonClass>({
		objectName: "Person",
		fields: ["objectId", "name", "email", "label", "data"],
		projectId: project?.objectId,
		limit: 1000,
		skipQuery: !project?.objectId
	});

	const loadRestBookings = useCallback(async () => {
		if (!module.objectId) return [];
		const rows = await fetchBookingsRest(module.objectId);
		setRestBookings(rows);
		return rows;
	}, [module.objectId]);

	useEffect(() => {
		if (!bookingsError) return;
		void loadRestBookings();
	}, [bookingsError, loadRestBookings]);

	const moduleRecord = (moduleRow as Module | null) || module;
	const resolvedModule = {
		...module,
		settings: {
			...module.settings,
			...(moduleRecord.settings || {})
		}
	};

	const moduleData = useMemo(
		() =>
			moduleDataFromSettings(
				{
					...module.settings,
					...(moduleRecord.settings || {})
				} as Record<string, unknown>,
				"data" in moduleRecord
					? (moduleRecord.data as Record<string, unknown>)
					: undefined
			),
		[module.settings, moduleRecord]
	);

	const peopleById = useMemo(() => {
		const map = new Map<string, PersonClass>();
		(people || []).forEach((person) => {
			map.set(person.objectId, person);
		});
		return map;
	}, [people]);

	const members: DisplayMember[] = useMemo(
		() =>
			[...moduleData.members]
				.map((member) => {
					const person = peopleById.get(member.personId);
					return {
						...member,
						personName: personNameFromClass(person),
						email: member.email || person?.email || "",
						firstName:
							member.firstName ||
							(person?.name || "").split(" ")[0] ||
							"",
						lastName:
							member.lastName ||
							(person?.name || "").split(" ").slice(1).join(" ")
					};
				})
				.sort((a, b) => pocketSort(a.sparfach, b.sparfach)),
		[moduleData.members, peopleById]
	);

	const activeMembers = useMemo(
		() => members.filter((member) => member.status >= 1),
		[members]
	);

	const bookingRows = bookingsError
		? restBookings
		: bookingRowsFromGraphQl || [];

	const bookings = useMemo(
		() => bookingRows.map(toLedgerBooking),
		[bookingRows]
	);

	const savingRule = moduleData.savingRules[0] ?? {
		id: 1,
		name: "Sparregeln 1",
		einwurf_min: 0,
		strafgeld: 0,
		sparclub: 0,
		sparclub_min: 0,
		sparclub_vg: 0,
		lotto: 0,
		lotto_min: 0,
		lotto_vg: 0
	};

	const refetch: ApolloRefetch = useCallback(async () => {
		try {
			const [bookingResult] = await Promise.all([
				refetchBookings(),
				refetchPeople(),
				refetchModule()
			]);
			if (bookingsError) {
				await loadRestBookings();
			}
			return bookingResult;
		} catch {
			await Promise.all([
				loadRestBookings(),
				refetchPeople(),
				refetchModule()
			]);
			return {
				data: undefined,
				loading: false,
				networkStatus: 7,
				stale: false
			} as Awaited<ReturnType<ApolloRefetch>>;
		}
	}, [
		bookingsError,
		loadRestBookings,
		refetchBookings,
		refetchModule,
		refetchPeople
	]);

	return {
		module: resolvedModule,
		moduleData,
		savingRule,
		currency: moduleData.settings.currency || "EUR",
		members,
		activeMembers,
		people: people || [],
		bookings,
		bookingRows,
		loading: bookingsLoading && !bookingsError,
		refetch,
		createData: createData as SavingsGroupContextValue["createData"],
		updateData: updateData as SavingsGroupContextValue["updateData"],
		deleteData: deleteData as SavingsGroupContextValue["deleteData"],
		peopleModuleId
	};
};

export default useSavingsGroupData;

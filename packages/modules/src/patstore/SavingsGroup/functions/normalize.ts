import {
	BookingClass,
	BookingData,
	BookingType,
	LedgerBooking,
	PersonClass,
	PersonPointer,
	SavingRule,
	SavingsGroupClubSettings,
	SavingsGroupMember,
	SavingsGroupModuleData
} from "@repo/types";
import {
	DEFAULT_CLUB_SETTINGS,
	DEFAULT_SAVING_RULE,
	DEFAULT_SAVINGS_GROUP_DATA
} from "../constants/defaults";

const num = (value: unknown): number => {
	if (value == null || value === "") return 0;
	const parsed = Number(value);
	return Number.isNaN(parsed) ? 0 : parsed;
};

const str = (value: unknown): string => (value == null ? "" : String(value));

export const personPointer = (objectId: string): PersonPointer => ({
	__type: "Pointer",
	className: "Person",
	objectId
});

export const resolvePersonId = (
	person?: PersonClass | PersonPointer | null,
	fallback?: string | null
): string | null => {
	if (person && typeof person === "object" && "objectId" in person) {
		return person.objectId || null;
	}
	return fallback ?? null;
};

export const bookingPersonId = (row: BookingClass): string | null =>
	resolvePersonId(row.person, row.data?.personId);

export const toLedgerBooking = (row: BookingClass): LedgerBooking => {
	const data = (row.data || {}) as BookingData;
	const type = (row.type || "G") as BookingType;
	return {
		objectId: row.objectId,
		type,
		personId: bookingPersonId(row),
		wert: num(data.wert),
		text: data.text ?? null,
		hauptbuch: data.hauptbuch == null ? null : num(data.hauptbuch),
		sparer: data.sparer == null ? null : num(data.sparer),
		einwurf: data.einwurf == null ? null : num(data.einwurf),
		sparclub: data.sparclub == null ? null : num(data.sparclub),
		lotto: data.lotto == null ? null : num(data.lotto),
		strafgeld: data.strafgeld == null ? null : num(data.strafgeld),
		vg: data.vg == null ? null : num(data.vg)
	};
};

export const emptyBookingData = (
	partial: Partial<BookingData> & { wert: number }
): BookingData => ({
	wert: partial.wert,
	text: partial.text ?? null,
	hauptbuch: partial.hauptbuch ?? null,
	sparer: partial.sparer ?? null,
	einwurf: partial.einwurf ?? null,
	sparclub: partial.sparclub ?? null,
	lotto: partial.lotto ?? null,
	strafgeld: partial.strafgeld ?? null,
	vg: partial.vg ?? null,
	personId: partial.personId ?? null,
	legacyId: partial.legacyId,
	legacyMemberId: partial.legacyMemberId
});

export const normalizeClubSettings = (
	raw?: Partial<SavingsGroupClubSettings> | Record<string, unknown>
): SavingsGroupClubSettings => ({
	...DEFAULT_CLUB_SETTINGS,
	name: str(raw?.name ?? (raw as { NAME?: string })?.NAME),
	street: str(raw?.street ?? (raw as { STRASSE?: string })?.STRASSE),
	houseNumber: str(
		raw?.houseNumber ?? (raw as { HAUSNUMMER?: string })?.HAUSNUMMER
	),
	zip: str(raw?.zip ?? (raw as { PLZ?: string })?.PLZ),
	city: str(raw?.city ?? (raw as { ORT?: string })?.ORT),
	country: str(raw?.country ?? (raw as { LAND?: string })?.LAND) || "DE",
	currency:
		str(raw?.currency ?? (raw as { WAEHRUNG?: string })?.WAEHRUNG) || "EUR",
	email: str(raw?.email ?? (raw as { ["E-MAIL"]?: string })?.["E-MAIL"]),
	version:
		str(raw?.version ?? (raw as { VERSION?: string })?.VERSION) ||
		undefined,
	created:
		str(raw?.created ?? (raw as { CREATE?: string })?.CREATE) || undefined,
	denominationMax:
		str(
			raw?.denominationMax ??
				(raw as { STUECKELUNG_MAX?: string })?.STUECKELUNG_MAX
		) || undefined
});

export const normalizeSavingRule = (raw?: Partial<SavingRule>): SavingRule => ({
	id: num(raw?.id) || 1,
	name: str(raw?.name) || DEFAULT_SAVING_RULE.name,
	einwurf_min: num(raw?.einwurf_min),
	strafgeld: num(raw?.strafgeld),
	sparclub: num(raw?.sparclub),
	sparclub_min: num(raw?.sparclub_min),
	sparclub_vg: num(raw?.sparclub_vg),
	lotto: num(raw?.lotto),
	lotto_min: num(raw?.lotto_min),
	lotto_vg: num(raw?.lotto_vg)
});

export const normalizeMember = (
	raw?: Partial<SavingsGroupMember>
): SavingsGroupMember => ({
	personId: str(raw?.personId),
	legacyId: raw?.legacyId == null ? undefined : num(raw.legacyId),
	status: num(raw?.status),
	sparregeln: num(raw?.sparregeln) || 1,
	sparfach: str(raw?.sparfach),
	lottozahl: str(raw?.lottozahl),
	salutation: str(raw?.salutation) || "0",
	firstName: str(raw?.firstName),
	lastName: str(raw?.lastName),
	street: str(raw?.street),
	houseNumber: str(raw?.houseNumber),
	zip: str(raw?.zip),
	city: str(raw?.city),
	country: str(raw?.country) || "DE",
	email: str(raw?.email),
	phone: str(raw?.phone),
	mobile: str(raw?.mobile),
	fax: str(raw?.fax),
	birthday: str(raw?.birthday).startsWith("0000") ? "" : str(raw?.birthday),
	birthplace: str(raw?.birthplace),
	nationality: str(raw?.nationality),
	occupation: str(raw?.occupation),
	note: str(raw?.note)
});

export const normalizeModuleData = (
	raw?: Partial<SavingsGroupModuleData> | Record<string, unknown> | null
): SavingsGroupModuleData => {
	if (!raw || typeof raw !== "object") {
		return {
			settings: { ...DEFAULT_CLUB_SETTINGS },
			savingRules: [{ ...DEFAULT_SAVING_RULE }],
			members: [],
			seedImported: false
		};
	}

	const source = raw as Partial<SavingsGroupModuleData>;
	const rules = Array.isArray(source.savingRules)
		? source.savingRules.map(normalizeSavingRule)
		: [{ ...DEFAULT_SAVING_RULE }];

	return {
		settings: normalizeClubSettings(source.settings),
		savingRules: rules.length > 0 ? rules : [{ ...DEFAULT_SAVING_RULE }],
		members: Array.isArray(source.members)
			? source.members.map(normalizeMember)
			: [],
		seedImported: Boolean(source.seedImported)
	};
};

export const moduleDataFromSettings = (
	settings: Record<string, unknown> | undefined,
	data?: Record<string, unknown> | SavingsGroupModuleData | null
): SavingsGroupModuleData => {
	if (data && typeof data === "object" && "settings" in data) {
		return normalizeModuleData(data as SavingsGroupModuleData);
	}
	if (settings?.savingsGroup && typeof settings.savingsGroup === "object") {
		return normalizeModuleData(
			settings.savingsGroup as SavingsGroupModuleData
		);
	}
	return { ...DEFAULT_SAVINGS_GROUP_DATA };
};

export const emptyMember = (): SavingsGroupMember =>
	normalizeMember({
		personId: "",
		status: 1,
		sparregeln: 1,
		sparfach: "",
		lottozahl: "",
		salutation: "0",
		country: "DE"
	});

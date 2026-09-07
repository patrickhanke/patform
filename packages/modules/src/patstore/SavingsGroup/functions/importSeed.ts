import {
	BookingData,
	BookingType,
	SavingRule,
	SavingsGroupClubSettings,
	SavingsGroupMember,
	SavingsGroupModuleData
} from "@repo/types";
import { emptyBookingData, personPointer } from "./normalize";
import {
	createParseObject,
	CreateParseObject,
	runInBatches
} from "./bookingApi";
import { memberDisplayName } from "./format";

type SeedSetting = { key: string; value: string };
type SeedMember = Record<string, unknown>;
type SeedBooking = Record<string, unknown>;

const str = (value: unknown) => (value == null ? "" : String(value));
const num = (value: unknown) => {
	if (value == null || value === "") return 0;
	const parsed = Number(value);
	return Number.isNaN(parsed) ? 0 : parsed;
};

const settingsFromSeed = (rows: SeedSetting[]): SavingsGroupClubSettings => {
	const map: Record<string, string> = {};
	rows.forEach((row) => {
		map[row.key] = str(row.value);
	});
	return {
		name: map.NAME || "",
		street: map.STRASSE || "",
		houseNumber: map.HAUSNUMMER || "",
		zip: map.PLZ || "",
		city: map.ORT || "",
		country: map.LAND || "DE",
		currency: map.WAEHRUNG || "EUR",
		email: map["E-MAIL"] || "",
		version: map.VERSION,
		created: map.CREATE,
		denominationMax: map.STUECKELUNG_MAX
	};
};

const memberFromSeed = (
	raw: SeedMember,
	personId: string
): SavingsGroupMember => ({
	personId,
	legacyId: num(raw.id),
	status: num(raw.status),
	sparregeln: num(raw.sparregeln) || 1,
	sparfach: str(raw.sparfach),
	lottozahl: str(raw.lottozahl),
	salutation: str(raw.anrede) || "0",
	firstName: str(raw.vorname),
	lastName: str(raw.nachname),
	street: str(raw.strasse),
	houseNumber: str(raw.hn),
	zip: str(raw.plz),
	city: str(raw.ort),
	country: str(raw.land) || "DE",
	email: str(raw.email),
	phone: str(raw.telefon),
	mobile: str(raw.mobil),
	fax: str(raw.fax),
	birthday: str(raw.geburtstag).startsWith("0000") ? "" : str(raw.geburtstag),
	birthplace: str(raw.geburtsort),
	nationality: str(raw.nationalitaet),
	occupation: str(raw.beruf),
	note: str(raw.bemerkung)
});

const bookingFromSeed = (
	raw: SeedBooking,
	personId: string | null
): { type: BookingType; data: BookingData; personId: string | null } => {
	const type = (str(raw.typ) || "G") as BookingType;
	return {
		type,
		personId,
		data: emptyBookingData({
			wert: num(raw.wert),
			text: raw.text == null ? null : str(raw.text),
			hauptbuch: raw.hauptbuch == null ? null : num(raw.hauptbuch),
			sparer: raw.sparer == null ? null : num(raw.sparer),
			einwurf: raw.einwurf == null ? null : num(raw.einwurf),
			sparclub: raw.sparclub == null ? null : num(raw.sparclub),
			lotto: raw.lotto == null ? null : num(raw.lotto),
			strafgeld: raw.strafgeld == null ? null : num(raw.strafgeld),
			vg: raw.vg == null ? null : num(raw.vg),
			personId,
			legacyId: num(raw.id),
			legacyMemberId: raw.mitglied == null ? null : num(raw.mitglied)
		})
	};
};

export async function importSavingsGroupSeed({
	createData,
	moduleId,
	peopleModuleId,
	onProgress
}: {
	createData: CreateParseObject;
	moduleId: string;
	peopleModuleId?: string;
	onProgress?: (message: string) => void;
}): Promise<SavingsGroupModuleData> {
	onProgress?.("Lade Beispieldaten…");
	const [einstellungen, sparregeln, mitglieder, buchungen] =
		await Promise.all([
			import("../seed/einstellungen.json"),
			import("../seed/sparregeln.json"),
			import("../seed/mitglieder.json"),
			import("../seed/buchungen.json")
		]);

	const settings = settingsFromSeed(
		(einstellungen.default || einstellungen) as SeedSetting[]
	);
	const rules = ((sparregeln.default || sparregeln) as SavingRule[]).map(
		(rule) => ({
			id: num(rule.id) || 1,
			name: str(rule.name) || "Sparregeln 1",
			einwurf_min: num(rule.einwurf_min),
			strafgeld: num(rule.strafgeld),
			sparclub: num(rule.sparclub),
			sparclub_min: num(rule.sparclub_min),
			sparclub_vg: num(rule.sparclub_vg),
			lotto: num(rule.lotto),
			lotto_min: num(rule.lotto_min),
			lotto_vg: num(rule.lotto_vg)
		})
	);

	const seedMembers = (mitglieder.default || mitglieder) as SeedMember[];
	const seedBookings = (buchungen.default || buchungen) as SeedBooking[];
	const personModuleId = peopleModuleId || moduleId;
	const legacyToPerson = new Map<number, string>();
	const members: SavingsGroupMember[] = [];

	onProgress?.(`Lege ${seedMembers.length} Personen an…`);
	await runInBatches(seedMembers, 8, async (raw) => {
		const memberDraft = memberFromSeed(raw, "");
		const name = memberDisplayName(memberDraft) || "Mitglied";
		const created = await createParseObject(createData, {
			className: "Person",
			updateObject: {
				name,
				label: name,
				email: memberDraft.email || "",
				module: {
					__type: "Pointer",
					className: "Module",
					objectId: personModuleId
				},
				categories: []
			}
		});
		if (!created?.objectId) return;
		const member = { ...memberDraft, personId: created.objectId };
		members.push(member);
		if (member.legacyId) {
			legacyToPerson.set(member.legacyId, created.objectId);
		}
	});

	onProgress?.(`Lege ${seedBookings.length} Buchungen an…`);
	let createdBookings = 0;
	await runInBatches(seedBookings, 12, async (raw) => {
		const legacyMemberId = raw.mitglied == null ? null : num(raw.mitglied);
		const personId =
			legacyMemberId == null
				? null
				: (legacyToPerson.get(legacyMemberId) ?? null);
		const booking = bookingFromSeed(raw, personId);
		await createParseObject(createData, {
			className: "Booking",
			updateObject: {
				type: booking.type,
				label: booking.data.text || booking.type,
				data: booking.data,
				person: personId ? personPointer(personId) : null,
				module: {
					__type: "Pointer",
					className: "Module",
					objectId: moduleId
				},
				categories: []
			}
		});
		createdBookings += 1;
		if (createdBookings % 50 === 0) {
			onProgress?.(
				`Buchungen ${createdBookings}/${seedBookings.length}…`
			);
		}
	});

	onProgress?.("Stammdaten speichern…");
	return {
		settings,
		savingRules: rules.length > 0 ? rules : [],
		members,
		seedImported: true
	};
}

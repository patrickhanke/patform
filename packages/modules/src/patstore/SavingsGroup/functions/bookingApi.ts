import {
	BookingClass,
	BookingData,
	BookingType,
	PersonClass,
	SavingsGroupMember
} from "@repo/types";
import { memberDisplayName } from "./format";

export type CreateParseObject = (params: {
	className: string;
	updateObject?: Record<string, unknown>;
	afterSaveHandler?: (result: { objectId: string }) => void;
	feedback?: string;
}) => Promise<unknown>;

export async function createParseObject(
	createData: CreateParseObject,
	params: {
		className: string;
		updateObject: Record<string, unknown>;
		feedback?: string;
	}
): Promise<{ objectId: string } | null> {
	let created: { objectId: string } | null = null;
	await createData({
		className: params.className,
		updateObject: params.updateObject,
		feedback: params.feedback,
		afterSaveHandler: (result) => {
			const objectId =
				result &&
				typeof result === "object" &&
				"objectId" in result &&
				result.objectId
					? String(result.objectId)
					: "";
			if (objectId) {
				created = { objectId };
			}
		}
	});
	return created;
}

export function bookingCreatePayload({
	type,
	data,
	moduleId,
	personId,
	label
}: {
	type: BookingType;
	data: BookingData;
	moduleId: string;
	personId?: string | null;
	label?: string;
}) {
	return {
		type,
		label: label || data.text || type,
		data: {
			...data,
			personId: personId ?? data.personId ?? null
		},
		person: personId
			? {
					__type: "Pointer",
					className: "Person",
					objectId: personId
				}
			: null,
		module: {
			__type: "Pointer",
			className: "Module",
			objectId: moduleId
		},
		categories: []
	};
}

export function personCreatePayload({
	member,
	moduleId
}: {
	member: Pick<SavingsGroupMember, "firstName" | "lastName" | "email">;
	moduleId: string;
}) {
	const name = memberDisplayName(member) || "Mitglied";
	return {
		name,
		label: name,
		email: member.email || "",
		module: {
			__type: "Pointer",
			className: "Module",
			objectId: moduleId
		},
		categories: []
	};
}

export function personNameFromClass(person?: PersonClass | null): string {
	if (!person) return "";
	return person.name || person.label || person.email || person.objectId;
}

export function mergeMemberWithPerson(
	member: SavingsGroupMember,
	person?: PersonClass | null
): SavingsGroupMember {
	if (!person) return member;
	const [firstName, ...rest] = (person.name || "").split(" ");
	return {
		...member,
		personId: person.objectId,
		firstName: member.firstName || firstName || "",
		lastName: member.lastName || rest.join(" "),
		email: member.email || person.email || "",
		personName: person.name
	} as SavingsGroupMember & { personName?: string };
}

export async function runInBatches<T>(
	items: T[],
	size: number,
	worker: (item: T, index: number) => Promise<void>
) {
	for (let index = 0; index < items.length; index += size) {
		const batch = items.slice(index, index + size);
		await Promise.all(
			batch.map((item, batchIndex) => worker(item, index + batchIndex))
		);
	}
}

export async function fetchBookingsRest(
	moduleId: string
): Promise<BookingClass[]> {
	try {
		const params = new URLSearchParams({
			className: "Booking",
			query: `"module":{"__type":"Pointer","className":"Module","objectId":"${moduleId}"}`,
			limit: "10000"
		});
		const response = await fetch(`/api/data?${params.toString()}`);
		if (!response.ok) return [];
		const result = await response.json();
		return (result.results || []) as BookingClass[];
	} catch {
		return [];
	}
}

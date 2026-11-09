import { describe, expect, it } from "vitest";
import {
	canDeleteRecord,
	canEnterModule,
	canEnterRecord,
	canReadField,
	canWriteField,
	effectiveFieldRoleIds,
	pageGrantRecords
} from "./fieldAccess";

const club = {
	objectId: "moduleClub",
	connected_class: "Club",
	fields: [
		{ id: "title" },
		{ id: "internalNotes", permission: { read: ["admin"], write: [] as string[] } }
	]
};

const editor = { objectId: "editor", modules: ["moduleClub"], access: [] };
const outsider = { objectId: "outsider", modules: [], access: [] };
const clubGrant = {
	objectId: "clubRole",
	modules: [] as string[],
	access: [{ id: "DhAcIEbDpV", className: "Club" as const, expires_at: null }]
};

describe("field access", () => {
	it("keeps today's module membership until a module permission is saved", () => {
		expect(canEnterModule([editor], club)).toBe(true);
		expect(canEnterModule([outsider], club)).toBe(false);
		expect(canReadField([editor], club, { id: "title" })).toBe(true);
		expect(canWriteField([editor], club, { id: "title" }, "DhAcIEbDpV")).toBe(
			true
		);
		expect(canDeleteRecord([editor], club, "DhAcIEbDpV")).toBe(true);
		expect(canDeleteRecord([clubGrant], club, "DhAcIEbDpV")).toBe(false);
		expect(canEnterRecord([clubGrant], "Club", "DhAcIEbDpV")).toBe(true);
		expect(canReadField([clubGrant], club, { id: "title" }, "DhAcIEbDpV")).toBe(
			true
		);
		expect(canReadField([clubGrant], club, { id: "title" })).toBe(false);
	});

	it("inherits field permissions and treats an empty array as deny", () => {
		const configured = {
			...club,
			settings: {
				permission: {
					access: ["admin", "editor"],
					read: ["admin", "editor", "author"],
					write: ["admin", "editor"],
					create: ["admin", "editor", "author"],
					update: ["admin", "editor"],
					delete: ["admin"]
				}
			}
		};
		const author = { objectId: "author", modules: [] as string[] };
		const admin = { objectId: "admin", modules: [] as string[] };

		expect(effectiveFieldRoleIds(configured, { id: "title" }, "read", [])).toEqual(
			["admin", "editor", "author"]
		);
		expect(effectiveFieldRoleIds(configured, { id: "title" }, "write", [])).toEqual(
			["admin", "editor"]
		);
		expect(
			effectiveFieldRoleIds(
				configured,
				configured.fields[1],
				"write",
				[]
			)
		).toEqual([]);
		expect(canReadField([author], configured, { id: "title" }, "DhAcIEbDpV")).toBe(
			false
		);
		expect(
			canReadField([author], configured, { id: "title" })
		).toBe(false);
		expect(canEnterModule([author], configured)).toBe(false);
		expect(canReadField([admin], configured, configured.fields[1])).toBe(true);
		expect(canWriteField([admin], configured, configured.fields[1])).toBe(false);
		expect(canWriteField([author], configured, { id: "title" }, undefined, true)).toBe(
			false
		);
		expect(canDeleteRecord([admin], configured, "DhAcIEbDpV")).toBe(true);
		expect(canDeleteRecord([{ objectId: "editor", modules: [] }], configured)).toBe(
			false
		);
	});

	it("lets a role open one record without granting the module or unread fields", () => {
		const configured = {
			...club,
			permission: {
				access: ["editor"],
				read: ["editor", "reader"],
				write: ["editor", "reader"],
				update: ["editor", "reader"]
			}
		};
		expect(canEnterModule([clubGrant], configured)).toBe(false);
		expect(canEnterRecord([clubGrant], "Club", "DhAcIEbDpV")).toBe(true);
		expect(
			canReadField([clubGrant], configured, { id: "title" }, "DhAcIEbDpV")
		).toBe(false);

		const grantedReader = {
			...clubGrant,
			objectId: "reader"
		};
		expect(
			canReadField([grantedReader], configured, { id: "title" }, "DhAcIEbDpV")
		).toBe(true);
		expect(canReadField([grantedReader], configured, { id: "title" })).toBe(false);
		expect(
			canWriteField([grantedReader], configured, { id: "title" }, "DhAcIEbDpV")
		).toBe(true);
	});

	it("keeps role access when the permission object only lists subpage grants", () => {
		const pagesOnly = {
			...club,
			settings: {
				permission: {
					pages: [
						{
							className: "Club",
							userId: "userA",
							id: "DhAcIEbDpV"
						}
					]
				}
			}
		};
		expect(canEnterModule([editor], pagesOnly)).toBe(true);
		expect(canEnterModule([outsider], pagesOnly)).toBe(false);
		expect(canReadField([editor], pagesOnly, { id: "title" })).toBe(true);
		expect(canDeleteRecord([editor], pagesOnly, "DhAcIEbDpV")).toBe(true);

		const denied = {
			...club,
			permission: {
				access: [] as string[],
				pages: pagesOnly.settings.permission.pages
			}
		};
		expect(canEnterModule([editor], denied)).toBe(false);
	});

	it("builds the record path for a user's subpage grant", () => {
		const paths = pageGrantRecords(
			[
				{
					path: "/clubs",
					connected_class: "Club",
					settings: {
						permission: {
							pages: [
								{ className: "Club", userId: "userA", id: "DhAcIEbDpV" },
								{ className: "Club", userId: "userB", id: "AAAAAAAAAA" }
							]
						}
					}
				}
			],
			"userA"
		);
		expect(paths).toEqual([
			{ className: "Club", id: "DhAcIEbDpV", path: "/clubs/DhAcIEbDpV" }
		]);
	});
});

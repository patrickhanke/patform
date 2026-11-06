import { describe, expect, it } from "vitest";
import {
	isActiveAccessGrant,
	modulesForAccessClass,
	recordAccessPath
} from "./userAccess";

const grant = {
	id: "DhAcIEbDpV",
	className: "Club" as const,
	expires_at: null
};

describe("user access grants", () => {
	it("accepts an open grant and rejects expired or malformed ones", () => {
		const now = Date.parse("2026-01-01T00:00:00.000Z");
		expect(isActiveAccessGrant(grant, now)).toBe(true);
		expect(
			isActiveAccessGrant({ ...grant, expires_at: "2099-01-01T00:00:00.000Z" }, now)
		).toBe(true);
		expect(
			isActiveAccessGrant({ ...grant, expires_at: "2000-01-01T00:00:00.000Z" }, now)
		).toBe(false);
		expect(isActiveAccessGrant({ ...grant, id: "../admin" })).toBe(false);
		expect(isActiveAccessGrant({ ...grant, className: "Club/../User" as "Club" })).toBe(
			false
		);
	});

	it("builds the record path and keeps every module of that class", () => {
		expect(recordAccessPath("/vereine/", "DhAcIEbDpV")).toBe("/vereine/DhAcIEbDpV");
		expect(recordAccessPath("/vereine/../admin", "DhAcIEbDpV")).toBeNull();

		const modules = modulesForAccessClass(
			[
				{ path: "/vereine", connected_class: "Club", position: 2, name: "Vereine" },
				{ path: "/clubs", connected_class: "Club", position: 1, name: "Clubs" },
				{ path: "/articles", connected_class: "Article", position: 0, name: "Artikel" }
			],
			"Club"
		);
		expect(modules.map((module) => module.path)).toEqual(["/clubs", "/vereine"]);
	});
});

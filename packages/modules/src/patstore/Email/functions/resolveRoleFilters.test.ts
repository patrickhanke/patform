import { describe, expect, it } from "vitest";
import {
	filtersWithRoleMembership,
	memberIdsFromRoles,
	roleIdsFromFilters
} from "./resolveRoleFilters";
import { Filter } from "@repo/types";

const filters: Filter[] = [
	{ key: "projects", operator: "in", value: ["projA"] },
	{ key: "roles", operator: "in", value: ["role1", "role2"] },
	{ key: "is_superuser", operator: "notEqualTo", value: true }
];

describe("role list filters", () => {
	it("reads role ids from a roles filter", () => {
		expect(roleIdsFromFilters(filters)).toEqual(["role1", "role2"]);
		expect(roleIdsFromFilters([{ key: "name", operator: "equalTo", value: "a" }])).toEqual(
			[]
		);
	});

	it("collects member ids from the role relation", () => {
		expect(
			memberIdsFromRoles([
				{ users: { edges: [{ node: { objectId: "u1" } }, { node: { objectId: "u2" } }] } },
				{ users: [{ objectId: "u2" }, { objectId: "u3" }] }
			])
		).toEqual(["u1", "u2", "u3"]);
	});

	it("replaces the roles filter with the member ids", () => {
		expect(filtersWithRoleMembership(filters, ["u1", "u2"])).toEqual([
			{ key: "projects", operator: "in", value: ["projA"] },
			{ key: "is_superuser", operator: "notEqualTo", value: true },
			{ key: "objectId", operator: "in", value: ["u1", "u2"] }
		]);
	});

	it("matches nobody when the roles have no members", () => {
		const resolved = filtersWithRoleMembership(filters, []);
		expect(resolved.find((filter) => filter.key === "objectId")?.value).toEqual([
			"__none__"
		]);
	});

	it("intersects an existing user id filter", () => {
		const resolved = filtersWithRoleMembership(
			[...filters, { key: "objectId", operator: "in", value: ["u2", "u9"] }],
			["u1", "u2"]
		);
		expect(resolved.find((filter) => filter.key === "objectId")?.value).toEqual(["u2"]);
		expect(resolved.filter((filter) => filter.key === "roles")).toEqual([]);
	});
});

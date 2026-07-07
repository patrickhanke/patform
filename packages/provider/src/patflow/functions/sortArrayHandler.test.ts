import { describe, expect, it } from "vitest";
import sortArrayHandler from "./sortArrayHandler";

describe("sortArrayHandler", () => {
	it("sorts objects by the given key in ascending order", () => {
		const items = [
			{ name: "charlie", order: 3 },
			{ name: "alpha", order: 1 },
			{ name: "bravo", order: 2 },
		];

		const sorted = sortArrayHandler([...items], "order");

		expect(sorted.map((item) => item.order)).toEqual([1, 2, 3]);
	});

	it("returns 0 for equal keys", () => {
		const items = [
			{ label: "a", value: 1 },
			{ label: "b", value: 1 },
		];

		const sorted = sortArrayHandler([...items], "value");

		expect(sorted).toHaveLength(2);
		expect(sorted.every((item) => item.value === 1)).toBe(true);
	});
});

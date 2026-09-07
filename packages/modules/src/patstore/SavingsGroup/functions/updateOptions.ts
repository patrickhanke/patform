import { Module, SavingsGroupModuleData } from "@repo/types";
import { PageDataUpdateOptions } from "@repo/ui";

export const savingsGroupUpdateOptions = (
	module: Module
): PageDataUpdateOptions<SavingsGroupModuleData> => ({
	className: "Module",
	updateObject: (data) => ({
		data,
		settings: {
			...module.settings,
			savingsGroup: data
		}
	}),
	message: "Sparclub gespeichert"
});

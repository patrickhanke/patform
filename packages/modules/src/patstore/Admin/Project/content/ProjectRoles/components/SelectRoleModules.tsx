import React, { FC, useCallback, useMemo, useState } from "react";
import { ElementSelectInterface, SelectElement, SlideIn } from "@repo/ui";
import { Module } from "@repo/types";
import { useDataHandler } from "@repo/provider";
import { SelectRoleModulesProps } from "../types";

const SelectRoleModules: FC<SelectRoleModulesProps> = ({
	roleId,
	modules,
	initialModules
}) => {
	const [selectedModules, setSelectedMosules] = useState<string[]>(
		initialModules || []
	);
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const { updateData } = useDataHandler(true);

	const elements = useMemo(() => {
		const personOptionsArray: SelectElement[] = [];
		if (modules) {
			modules.forEach((module: Module) => {
				personOptionsArray.push({
					value: module.objectId,
					id: module.objectId,
					label: `${module.name}`
				});
			});
		}
		personOptionsArray.sort((a, b) => a.label?.localeCompare(b.label));

		return personOptionsArray;
	}, [modules]);

	const selectModule = useMemo(
		() => (
			<ElementSelectInterface
				elements={elements}
				selectedElements={elements.filter((element) =>
					selectedModules.includes(element.id)
				)}
				onSelect={(selectValue) => {
					if (!selectValue || selectValue.length === 0) {
						setSelectedMosules([]);
					} else if (selectValue.length > 0) {
						setSelectedMosules(
							selectValue.map((value) => value.id)
						);
					}
				}}
				max={6}
				isSearchable
			/>
		),
		[elements, selectedModules, modules]
	);

	const updateHandler = useCallback(async () => {
		setLoading(true);
		await updateData({
			className: "_Role",
			objectId: roleId,
			updateObject: {
				modules: selectedModules
				// modules: {
				// 	__op: "AddRelation",
				// 	objects: selectedModules.map((moduleId) => ({
				// 		__type: "Pointer",
				// 		className: "Module",
				// 		objectId: moduleId
				// 	}))
				// }
			},
			feedback: "Rolle aktualisiert"
		});
		setIsOpen(false);
		setLoading(false);
	}, [selectedModules, roleId, updateData]);

	return (
		<>
			<button
				className="full_button sm light"
				onClick={() => setIsOpen(true)}
				type="button"
			>
				{selectedModules.length === 0
					? "Module auswählen"
					: `(${selectedModules.length}) Module`}
			</button>
			<SlideIn
				isOpen={isOpen}
				cancel={() => setIsOpen(false)}
				confirm={async () => {
					setLoading(true);
					await updateHandler();
					setIsOpen(false);
					setLoading(false);
				}}
				disabled={[loading, loading]}
				header="Personen auswählen"
			>
				{selectModule}
			</SlideIn>
		</>
	);
};

export default SelectRoleModules;

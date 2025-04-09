import React, { FC, useCallback, useMemo, useState } from "react";
import { ElementSelectInterface, SelectElement, SlideIn } from "@repo/ui";
import { PatstoreRoleClass } from "@repo/types";
import { useDataHandler } from "@repo/provider";
import { SelectUserRoleProps } from "../types";

const findRoleFromUserId = (userId: string, roles: PatstoreRoleClass[]) => {
	const role = roles.find((role) =>
		role.users.results.some((user) => user.objectId === userId)
	);
	return role ? role : undefined;
};

const SelectUserRole: FC<SelectUserRoleProps> = ({ userId, roles }) => {
	const [initialRole] = useState<string | undefined>(
		findRoleFromUserId(userId, roles)
			? findRoleFromUserId(userId, roles)?.objectId
			: undefined
	);
	const [selectedRole, setSelectedRole] = useState<string | undefined>(
		initialRole
	);
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const { updateData } = useDataHandler(true);

	const elements = useMemo(() => {
		const personOptionsArray: SelectElement[] = [];
		if (roles) {
			roles.forEach((role: PatstoreRoleClass) => {
				personOptionsArray.push({
					value: role.objectId,
					id: role.objectId,
					label: `${role.name}`
				});
			});
		}
		personOptionsArray.sort((a, b) => a.label?.localeCompare(b.label));

		return personOptionsArray;
	}, [roles]);

	const selectRole = useMemo(
		() => (
			<ElementSelectInterface
				elements={elements}
				selectedElements={elements.filter(
					(element) => selectedRole === element.id
				)}
				onSelect={(selectValue) => {
					if (!selectValue || selectValue.length === 0) {
						setSelectedRole(undefined);
					} else if (selectValue.length > 0) {
						setSelectedRole(selectValue[0]?.id);
					}
				}}
				max={6}
				isSearchable
			/>
		),
		[elements, selectedRole, roles]
	);

	const updateHandler = useCallback(async () => {
		setLoading(true);
		if (initialRole && selectedRole) {
			await updateData({
				className: "_Role",
				objectId: initialRole,
				updateObject: {
					users: {
						__op: "RemoveRelation",
						objects: [
							{
								__type: "Pointer",
								className: "_User",
								objectId: userId
							}
						]
					}
				}
			});
			await updateData({
				className: "_Role",
				objectId: selectedRole,
				updateObject: {
					users: {
						__op: "AddRelation",
						objects: [
							{
								__type: "Pointer",
								className: "_User",
								objectId: userId
							}
						]
					}
				},
				feedback: "Rolle aktualisiert"
			});
		}
		setIsOpen(false);
		setLoading(false);
	}, [selectedRole, initialRole, updateData]);

	return (
		<>
			<button
				className="full_button sm light"
				onClick={() => setIsOpen(true)}
				type="button"
			>
				<span>
					{initialRole
						? elements.find((element) => element.id === initialRole)
								?.label
						: "Rolle auswählen"}
				</span>
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
				header="Rolle auswählen"
			>
				{selectRole}
			</SlideIn>
		</>
	);
};

export default SelectUserRole;

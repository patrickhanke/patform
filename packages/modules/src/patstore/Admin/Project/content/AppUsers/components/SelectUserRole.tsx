import { FC, useMemo, useState } from "react";
import { ElementSelectInterface, SelectElement, SlideIn } from "@repo/ui";
import { PatstoreRoleClass } from "@repo/types";
import { axiosclient } from "@repo/provider";
import { SelectUserRoleProps } from "../types";

const findRoleFromUserId = (userId: string, roles: PatstoreRoleClass[]) => {
	const role = roles.find((role) =>
		role.users.results.some((user) => user.objectId === userId)
	);
	return role ? role : undefined;
};

const SelectUserRole: FC<SelectUserRoleProps> = ({ user, roles, refetch }) => {
	const [initialRole, setInitialRole] = useState<string | undefined>(
		findRoleFromUserId(user.objectId, roles)
			? findRoleFromUserId(user.objectId, roles)?.objectId
			: undefined
	);

	const [selectedRole, setSelectedRole] = useState<string | undefined>(
		initialRole
	);

	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);

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
						if (!initialRole) {
							setInitialRole(selectValue[0]?.id);
							setSelectedRole(selectValue[0]?.id);
						} else {
							setSelectedRole(selectValue[0]?.id);
						}
					}
				}}
				max={6}
				isSearchable
			/>
		),
		[elements, selectedRole, roles]
	);

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
					await axiosclient().post("functions/update_user_role", {
						user_id: user.objectId,
						former_role_id: initialRole,
						new_role_id: selectedRole
					});
					await refetch();
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

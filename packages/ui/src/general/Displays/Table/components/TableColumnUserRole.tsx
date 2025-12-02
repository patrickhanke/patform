import { axiosclient, useAppContext } from "@repo/provider";
import {
	ElementSelectInterface,
	SelectElement,
	SlideIn,
	StateDisplay
} from "@repo/ui";
import { useState, useMemo, useEffect } from "react";
import { ApolloRefetch, PatstoreRoleClass, PatstoreUser } from "@repo/types";

const findRoleFromUserId = (
	userRoles: string[],
	roles: PatstoreRoleClass[]
) => {
	if (!userRoles || userRoles.length === 0) {
		return undefined;
	}
	const role = roles.find((role) => userRoles.includes(role.objectId));
	return role ? role : undefined;
};

const TableColumnUserRole = ({
	user,
	refetch
}: {
	user: PatstoreUser;
	refetch: ApolloRefetch;
}) => {
	const { roles } = useAppContext();
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [initialRole, setInitialRole] = useState<string | undefined>(
		findRoleFromUserId(user.roles, roles)?.objectId
	);

	const [selectedRole, setSelectedRole] = useState<string | undefined>(
		initialRole
	);

	const userRole = roles.find((role) => user?.roles?.includes(role.objectId));
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

	useEffect(() => {
		if (initialRole && !selectedRole) {
			setSelectedRole(initialRole);
		}
	}, [initialRole]);

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
				max={1}
				isSearchable
			/>
		),
		[elements, selectedRole, initialRole, roles]
	);

	return (
		<>
			{userRole ? (
				<StateDisplay
					color={userRole.color || "blue"}
					label={userRole.name}
					onClick={() => setIsOpen(true)}
				/>
			) : (
				<button
					className="full_button light md"
					onClick={() => setIsOpen(true)}
				>
					<span>Rolle hinzufügen</span>
				</button>
			)}
			<SlideIn
				isOpen={isOpen}
				cancel={() => setIsOpen(false)}
				confirm={async () => {
					setLoading(true);
					await axiosclient().post("functions/update-user-role", {
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

export default TableColumnUserRole;

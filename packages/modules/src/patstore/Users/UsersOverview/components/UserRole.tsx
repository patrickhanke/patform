import { axiosclient, useAppContext } from "@repo/provider";
import {
	ElementSelectInterface,
	SelectElement,
	SlideIn,
	StateDisplay
} from "@repo/ui";
import { useState, useMemo } from "react";
import { ApolloRefetch, PatstoreRoleClass, PatstoreUser } from "@repo/types";

const findRoleFromUserId = (userId: string, roles: PatstoreRoleClass[]) => {
	const role = roles.find((role) =>
		role.users.results.some((user) => user.objectId === userId)
	);
	return role ? role : undefined;
};

const UserRole = ({
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
		findRoleFromUserId(user.objectId, roles)
			? findRoleFromUserId(user.objectId, roles)?.objectId
			: undefined
	);

	const [selectedRole, setSelectedRole] = useState<string | undefined>(
		initialRole
	);

	const userRole = roles.find((role) => user.roles.includes(role.objectId));
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

export default UserRole;

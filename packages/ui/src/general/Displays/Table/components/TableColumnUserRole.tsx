import { axiosclient, findRoleForUser, useAppContext } from "@repo/provider";
import {
	ElementSelectInterface,
	SelectElement,
	SlideIn,
	StateDisplay
} from "@repo/ui";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ApolloRefetch, PatstoreRoleClass, PatstoreUser } from "@repo/types";

const TableColumnUserRole = ({
	user,
	refetch
}: {
	user: PatstoreUser;
	refetch: ApolloRefetch;
}) => {
	// `AppContext` is shared with patflow (whose roles have a different
	// shape), so `useAppContext()` types `roles` loosely. This component is
	// patstore-only and relies on the concrete PatstoreRoleClass shape.
	const { roles: contextRoles } = useAppContext();
	const roles = contextRoles as PatstoreRoleClass[];
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const matchedRole = findRoleForUser(roles, user.objectId);
	const [initialRole, setInitialRole] = useState<string | undefined>(
		matchedRole?.objectId
	);

	const [selectedRole, setSelectedRole] = useState<string | undefined>(
		initialRole
	);

	const userRole =
		roles.find((role) => role.objectId === initialRole) || matchedRole;
	const elements = useMemo(() => {
		const personOptionsArray: SelectElement[] = [];
		if (roles) {
			roles.forEach((role: PatstoreRoleClass) => {
				personOptionsArray.push({
					value: role.objectId,
					id: role.objectId,
					label: `${role.title}`
				});
			});
		}
		personOptionsArray.sort((a, b) => a.label?.localeCompare(b.label));

		return personOptionsArray;
	}, [roles]);

	useEffect(() => {
		setInitialRole(matchedRole?.objectId);
		setSelectedRole(matchedRole?.objectId);
	}, [matchedRole?.objectId]);

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
					label={userRole.title}
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
					await axiosclient().post("functions/update_user_role", {
						user_id: user.objectId,
						former_role_id: initialRole,
						new_role_id: selectedRole
					});
					setInitialRole(selectedRole);
					await refetch();
					router.refresh();
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

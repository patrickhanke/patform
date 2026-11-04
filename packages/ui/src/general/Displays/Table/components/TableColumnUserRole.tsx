import { axiosclient, useAppContext, useRoleForUser } from "@repo/provider";
import {
	ElementSelectInterface,
	SelectElement,
	SlideIn,
	StateDisplay
} from "@repo/ui";
import { useState, useMemo, useEffect } from "react";
import { PatstoreRoleClass, PatstoreUser } from "@repo/types";

const TableColumnUserRole = ({ user }: { user: PatstoreUser }) => {
	// `AppContext` is shared with patflow (whose roles have a different
	// shape), so `useAppContext()` types `roles` loosely. This component is
	// patstore-only and relies on the concrete PatstoreRoleClass shape.
	const { roles: contextRoles, project } = useAppContext();
	const roles = contextRoles as PatstoreRoleClass[];
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [initialRole, setInitialRole] = useState<string | undefined>(
		undefined
	);
	const [selectedRole, setSelectedRole] = useState<string | undefined>(
		undefined
	);

	const { role, refetch: refetchRole } = useRoleForUser(
		user.objectId,
		project?.objectId
	);

	const userRole = roles.find((role) => role.objectId === initialRole);
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
		if (role?.objectId && initialRole !== role.objectId) {
			setInitialRole(role.objectId);
		}
	}, [role?.objectId, initialRole]);

	const selectRole = useMemo(
		() => (
			<ElementSelectInterface
				elements={elements}
				selectedElements={elements.filter((element) =>
					selectedRole
						? selectedRole === element.id
						: initialRole === element.id
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
					await refetchRole();
					setIsOpen(false);
					setLoading(false);
				}}
				disabled={[loading, loading || !initialRole || !selectedRole]}
				header="Rolle auswählen"
			>
				{selectRole}
			</SlideIn>
		</>
	);
};

export default TableColumnUserRole;

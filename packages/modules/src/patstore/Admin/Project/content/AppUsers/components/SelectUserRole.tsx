import { FC, useEffect, useMemo, useState } from "react";
import { ElementSelectInterface, SelectElement, SlideIn } from "@repo/ui";
import { PatstoreRoleClass } from "@repo/types";
import { axiosclient, useAppContext, useRoleForUser } from "@repo/provider";
import { SelectUserRoleProps } from "../types";

const SelectUserRole: FC<SelectUserRoleProps> = ({ user, roles, refetch }) => {
	const { project } = useAppContext<"patstore">();
	const { role, refetch: refetchRole } = useRoleForUser(
		user.objectId,
		project?.objectId
	);
	const [initialRole, setInitialRole] = useState<string | undefined>();
	const [selectedRole, setSelectedRole] = useState<string | undefined>();

	useEffect(() => {
		if (role?.objectId && initialRole !== role.objectId) {
			setInitialRole(role.objectId);
			setSelectedRole(role.objectId);
		}
	}, [role?.objectId, initialRole]);

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
					await Promise.all([refetch(), refetchRole()]);
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

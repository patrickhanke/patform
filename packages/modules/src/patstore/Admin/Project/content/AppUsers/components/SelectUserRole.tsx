import { FC, useEffect, useMemo, useState } from "react";
import { ElementSelectInterface, SelectElement, SlideIn } from "@repo/ui";
import { PatstoreRoleClass } from "@repo/types";
import { axiosclient, useAppContext, useRoleForUser } from "@repo/provider";
import { SelectUserRoleProps } from "../types";

const isAbortError = (error: unknown) =>
	error instanceof Error && error.name === "AbortError";

const refreshAfterSave = async (request: Promise<unknown>) => {
	try {
		await request;
	} catch (error) {
		if (isAbortError(error)) return;
		console.error(error);
	}
};

const SelectUserRole: FC<SelectUserRoleProps> = ({ user, roles, refetch }) => {
	const { project } = useAppContext<"patstore">();
	const { role, refetch: refetchRole } = useRoleForUser(
		user.objectId,
		project?.objectId
	);
	const [initialRole, setInitialRole] = useState<string | undefined>();
	const [selectedRole, setSelectedRole] = useState<string | undefined>();

	useEffect(() => {
		if (role?.objectId && !initialRole) {
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
				selectedElements={elements.filter((element) =>
					selectedRole
						? selectedRole === element.id
						: initialRole === element.id
				)}
				onSelect={(selectValue) => {
					const nextRole = selectValue?.[0]?.value;
					setSelectedRole(nextRole || undefined);
				}}
				max={1}
				isSearchable
			/>
		),
		[elements, selectedRole, initialRole]
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
					try {
						await axiosclient().post("functions/update_user_role", {
							user_id: user.objectId,
							former_role_id: initialRole,
							new_role_id: selectedRole
						});
						setInitialRole(selectedRole);
						setIsOpen(false);
					} finally {
						setLoading(false);
					}
					await Promise.all([
						refreshAfterSave(refetch()),
						refreshAfterSave(refetchRole())
					]);
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

import { FC, useCallback } from "react";
import { AdminRoleProps } from "../types";
import { StatelessToggle } from "@repo/ui";
import { axiosclient, useDataHandler } from "@repo/provider";

const AdminRole: FC<AdminRoleProps> = ({
	roleId,
	roles,
	refetch,
	projectId
}) => {
	const { updateData } = useDataHandler(true);
	const isSelected = roles.find((role) => role.objectId === roleId)?.admin;
	const chageDefaultHandler = useCallback(
		async (value: boolean) => {
			const roleUpdateArray = roles.map((role) => {
				if (role.objectId === roleId) {
					updateData({
						className: "_Role",
						objectId: role.objectId,
						updateObject: {
							admin: value
						}
					});

					axiosclient().post("functions/update-user-acl", {
						admin_role_id: role.objectId,
						project_id: projectId
					});

					return null;
				}
				return updateData({
					className: "_Role",
					objectId: role.objectId,
					updateObject: {
						admin: false
					}
				});
			});

			await Promise.all(roleUpdateArray);
			await refetch();
		},
		[isSelected, roles, projectId]
	);

	return (
		<div>
			<StatelessToggle
				label=""
				value={isSelected || false}
				onChange={(value) => chageDefaultHandler(value)}
				disabled={isSelected}
			/>
		</div>
	);
};

export default AdminRole;

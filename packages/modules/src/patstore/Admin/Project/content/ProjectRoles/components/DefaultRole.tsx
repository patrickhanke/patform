import React, { FC, useCallback } from "react";
import { DefaultRoleProps } from "../types";
import { StatelessToggle } from "@repo/ui";
import { useDataHandler } from "@repo/provider";

const DefaultRole: FC<DefaultRoleProps> = ({ roleId, roles, refetch }) => {
	const { updateData } = useDataHandler(true);
	const isSelected = roles.find((role) => role.objectId === roleId)?.default;
	const chageDefaultHandler = useCallback(
		async (value: boolean) => {
			const roleUpdateArray = roles.map((role) => {
				if (role.objectId === roleId) {
					return updateData({
						className: "_Role",
						objectId: role.objectId,
						updateObject: {
							default: value
						}
					});
				}
				return updateData({
					className: "_Role",
					objectId: role.objectId,
					updateObject: {
						default: false
					}
				});
			});

			await Promise.all(roleUpdateArray);
			await refetch();
		},
		[isSelected, roles]
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

export default DefaultRole;

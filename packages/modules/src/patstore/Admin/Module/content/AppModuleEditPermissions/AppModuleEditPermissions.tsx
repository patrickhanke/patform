"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@repo/ui";
import {
	ModulePermission,
	ModuleSettings,
	PatstoreRoleClass
} from "@repo/types";
import { useDataHandler, useFindData } from "@repo/provider";
import { ModulePermissionEditor } from "./components/PermissionEditors";

const roleLabel = (role: PatstoreRoleClass) =>
	role.title || role.name || role.objectId;

const AppModuleEditPermissions = ({
	objectId,
	moduleId,
	initialSettings,
	refetch
}: {
	objectId: string;
	moduleId: string;
	initialSettings?: ModuleSettings;
	refetch: () => void;
}) => {
	const { project_id: projectId } = useParams<{ project_id: string }>();
	const { updateData } = useDataHandler(true, false);
	const { data: roles } = useFindData({
		objectName: "Role",
		fields: [
			"objectId",
			"name",
			"title",
			"modules {...on Element {value}}"
		],
		projectId
	});
	const [permission, setPermission] = useState<ModulePermission | undefined>(
		initialSettings?.permission
	);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		setPermission(initialSettings?.permission);
	}, [initialSettings]);

	const roleOptions = useMemo(
		() =>
			((roles || []) as PatstoreRoleClass[]).map((role) => ({
				objectId: role.objectId,
				label: roleLabel(role)
			})),
		[roles]
	);

	const save = async (next: ModulePermission | undefined) => {
		setSaving(true);
		const pages = initialSettings?.permission?.pages;
		const settings: ModuleSettings = {
			...(initialSettings || ({} as ModuleSettings))
		};
		const withPages = (permission: ModulePermission | undefined) => {
			if (!pages?.length) return permission;
			return { ...(permission || {}), pages };
		};
		const stored = withPages(next);
		if (stored && Object.keys(stored).length > 0)
			settings.permission = stored;
		else delete settings.permission;
		await updateData({
			className: "Module",
			objectId,
			updateObject: { settings },
			feedback: "Berechtigungen gespeichert"
		});
		setPermission(stored);
		await refetch();
		setSaving(false);
	};

	const roleActions = [
		"access",
		"read",
		"write",
		"create",
		"update",
		"delete"
	] as const;
	const roleConfigured = roleActions.some(
		(action) => permission?.[action] !== undefined
	);

	const adoptLegacy = () => {
		const ids = ((roles || []) as PatstoreRoleClass[])
			.filter((role) => (role.modules || []).includes(moduleId))
			.map((role) => role.objectId);
		setPermission({
			access: ids,
			read: ids,
			write: ids,
			create: ids,
			update: ids,
			delete: ids
		});
	};

	return (
		<div className="content_element flex col gap-sm">
			{!roleConfigured ? (
				<>
					<p>
						Solange hier nichts gespeichert ist, gilt der
						Modulzugriff auf der Rolle für das ganze Modul und alle
						Felder.
					</p>
					<Button
						text="Berechtigungen aus den Rollen übernehmen"
						onClick={adoptLegacy}
						disabled={saving}
					/>
				</>
			) : (
				<>
					{permission && (
						<ModulePermissionEditor
							roles={roleOptions}
							permission={permission}
							onChange={setPermission}
						/>
					)}
					<div className="flex row gap-sm">
						<Button
							text="Speichern"
							onClick={() => save(permission)}
							disabled={saving}
						/>
						<Button
							text="Wieder den Rollen-Modulzugriff verwenden"
							onClick={() => save(undefined)}
							disabled={saving}
						/>
					</div>
				</>
			)}
		</div>
	);
};

export default AppModuleEditPermissions;

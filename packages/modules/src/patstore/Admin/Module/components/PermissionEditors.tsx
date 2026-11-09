"use client";

import { useEffect, useState } from "react";
import { SlideIn } from "@repo/ui";
import type { FieldPermission, ModulePermission } from "@repo/types";

export type PermissionRole = {
	objectId: string;
	label: string;
};

const MODULE_ACTIONS: { action: keyof ModulePermission; label: string }[] = [
	{ action: "access", label: "Modul öffnen" },
	{ action: "read", label: "Lesen" },
	{ action: "write", label: "Schreiben" },
	{ action: "create", label: "Anlegen" },
	{ action: "update", label: "Bearbeiten" },
	{ action: "delete", label: "Löschen" }
];

const toggleId = (ids: string[] | undefined, roleId: string, checked: boolean) => {
	const current = ids || [];
	if (checked) return current.includes(roleId) ? current : [...current, roleId];
	return current.filter((id) => id !== roleId);
};

export const ModulePermissionEditor = ({
	roles,
	permission,
	onChange
}: {
	roles: PermissionRole[];
	permission: ModulePermission;
	onChange: (permission: ModulePermission) => void;
}) => (
	<div className="flex col gap-sm">
		{MODULE_ACTIONS.map(({ action, label }) => (
			<div key={action}>
				<h3>{label}</h3>
				<div className="flex col gap-xs">
					{roles.map((role) => (
						<label key={role.objectId} className="flex row a-ce gap-xs">
							<input
								type="checkbox"
								checked={(permission[action] || []).includes(role.objectId)}
								onChange={(event) =>
									onChange({
										...permission,
										[action]: toggleId(
											permission[action],
											role.objectId,
											event.target.checked
										)
									})
								}
							/>
							<span>{role.label}</span>
						</label>
					))}
				</div>
			</div>
		))}
	</div>
);

const FIELD_ACTIONS: { action: keyof FieldPermission; label: string }[] = [
	{ action: "read", label: "Lesen" },
	{ action: "write", label: "Schreiben" }
];

const FieldPermissionFields = ({
	roles,
	modulePermission,
	permission,
	onChange
}: {
	roles: PermissionRole[];
	modulePermission?: ModulePermission;
	permission?: FieldPermission;
	onChange: (permission: FieldPermission | undefined) => void;
}) => (
	<div className="flex col gap-sm">
		{FIELD_ACTIONS.map(({ action, label }) => {
			const inherited = permission?.[action] === undefined;
			const selected = permission?.[action] ?? modulePermission?.[action] ?? [];
			return (
				<div key={action}>
					<label className="flex row a-ce gap-xs">
						<input
							type="checkbox"
							checked={inherited}
							onChange={(event) => {
								const next: FieldPermission = { ...(permission || {}) };
								if (event.target.checked) {
									delete next[action];
								} else {
									next[action] = [
										...(modulePermission?.[action] ??
											roles.map((role) => role.objectId))
									];
								}
								onChange(
									next.read === undefined && next.write === undefined
										? undefined
										: next
								);
							}}
						/>
						<span>{label} vom Modul erben</span>
					</label>
					{inherited && !modulePermission && (
						<p>Übernimmt den Modulzugriff der Rolle.</p>
					)}
					{inherited && modulePermission && (
						<ul>
							{roles.map((role) => (
								<li key={role.objectId}>
									{role.label}:{" "}
									{selected.includes(role.objectId) ? "erlaubt" : "verweigert"}
								</li>
							))}
						</ul>
					)}
					{!inherited && (
						<div className="flex col gap-xs">
							{roles.map((role) => (
								<label key={role.objectId} className="flex row a-ce gap-xs">
									<input
										type="checkbox"
										checked={(permission?.[action] || []).includes(role.objectId)}
										onChange={(event) =>
											onChange({
												...(permission || {}),
												[action]: toggleId(
													permission?.[action],
													role.objectId,
													event.target.checked
												)
											})
										}
									/>
									<span>{role.label}</span>
								</label>
							))}
						</div>
					)}
				</div>
			);
		})}
	</div>
);

export const fieldPermissionIsEdited = (permission?: FieldPermission) =>
	permission?.read !== undefined || permission?.write !== undefined;

export const FieldPermissionEditor = ({
	roles,
	modulePermission,
	permission,
	onChange,
	onOpenChange
}: {
	roles: PermissionRole[];
	modulePermission?: ModulePermission;
	permission?: FieldPermission;
	onChange: (permission: FieldPermission | undefined) => void;
	onOpenChange?: (isOpen: boolean) => void;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [draft, setDraft] = useState<FieldPermission | undefined>(permission);
	const edited = fieldPermissionIsEdited(permission);

	useEffect(() => () => onOpenChange?.(false), [onOpenChange]);

	const close = () => {
		setIsOpen(false);
		onOpenChange?.(false);
	};

	return (
		<>
			<button
				type="button"
				className="full_button sm light"
				onClick={() => {
					setDraft(permission);
					setIsOpen(true);
					onOpenChange?.(true);
				}}
			>
				Berechtigungen bearbeiten{edited ? " (bearbeitet)" : ""}
			</button>
			<SlideIn
				header="Berechtigungen"
				isOpen={isOpen}
				cancel={close}
				confirm={() => {
					onChange(draft);
					close();
				}}
			>
				<FieldPermissionFields
					roles={roles}
					modulePermission={modulePermission}
					permission={draft}
					onChange={setDraft}
				/>
			</SlideIn>
		</>
	);
};

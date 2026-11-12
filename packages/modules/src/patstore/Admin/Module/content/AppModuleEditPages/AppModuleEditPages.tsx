"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Select, SlideIn } from "@repo/ui";
import {
	ModuleClass,
	ModulePageAccess,
	ModuleSettings,
	PatstoreUser
} from "@repo/types";
import { useDataHandler, useFindData } from "@repo/provider";

type RecordOption = {
	objectId: string;
	title?: string;
	name?: string;
	label?: string;
};

const recordLabel = (record: RecordOption) =>
	record.title || record.label || record.name || record.objectId;

const AppModuleEditPages = ({
	objectId,
	pages,
	initialSettings,
	refetch
}: {
	objectId: string;
	pages: ModuleClass[];
	initialSettings?: ModuleSettings;
	refetch: () => void;
}) => {
	const { project_id: projectId } = useParams<{ project_id: string }>();
	const { updateData } = useDataHandler(true, false);
	const [grants, setGrants] = useState<ModulePageAccess[]>(
		initialSettings?.permission?.pages || []
	);
	const [isOpen, setIsOpen] = useState(false);
	const [saving, setSaving] = useState(false);
	const [className, setClassName] = useState<ModuleClass | undefined>(
		pages[0]
	);
	const [userId, setUserId] = useState("");
	const [recordId, setRecordId] = useState("");

	useEffect(() => {
		setGrants(initialSettings?.permission?.pages || []);
	}, [initialSettings]);

	const { data: users } = useFindData({
		objectName: "User",
		fields: ["objectId", "name", "username"],
		filters: [
			{
				key: "projects",
				value: projectId,
				operator: "contains"
			},
			{
				key: "is_superuser",
				value: true,
				operator: "notEqualTo"
			}
		]
	});

	console.log(users);

	const { data: records } = useFindData({
		objectName: className || "",
		fields: ["objectId", "title", "label"],
		projectId,
		limit: 1000,
		skipQuery: !className
	});

	const userName = useMemo(() => {
		const names = new Map<string, string>();
		((users || []) as PatstoreUser[]).forEach((user) => {
			names.set(
				user.objectId,
				user.name || user.username || user.objectId
			);
		});
		return names;
	}, [users]);

	const recordName = useMemo(() => {
		const names = new Map<string, string>();
		((records || []) as RecordOption[]).forEach((record) => {
			names.set(record.objectId, recordLabel(record));
		});
		grants.forEach((grant) => {
			if (!names.has(grant.id)) names.set(grant.id, grant.id);
		});
		return names;
	}, [records, grants]);

	const saveGrants = async (next: ModulePageAccess[]) => {
		setSaving(true);
		const settings: ModuleSettings = {
			...(initialSettings || ({} as ModuleSettings))
		};
		const permission = { ...(settings.permission || {}) };
		if (next.length > 0) permission.pages = next;
		else delete permission.pages;
		if (Object.keys(permission).length > 0)
			settings.permission = permission;
		else delete settings.permission;
		await updateData({
			className: "Module",
			objectId,
			updateObject: { settings },
			feedback: "Unterseiten gespeichert"
		});
		setGrants(next);
		await refetch();
		setSaving(false);
	};

	const addGrant = async () => {
		if (!className || !userId || !recordId) return;
		const exists = grants.some(
			(grant) =>
				grant.className === className &&
				grant.userId === userId &&
				grant.id === recordId
		);
		setIsOpen(false);
		if (exists) return;
		await saveGrants([...grants, { className, userId, id: recordId }]);
	};

	return (
		<div className="content_element flex col gap-sm">
			<button
				type="button"
				className="full_button sm"
				onClick={() => {
					setClassName(pages[0]);
					setUserId("");
					setRecordId("");
					setIsOpen(true);
				}}
			>
				Zugang hinzufügen
			</button>
			{grants.length === 0 ? (
				<p>Noch keine Unterseiten-Zugänge.</p>
			) : (
				<div className="flex col gap-xs">
					{grants.map((grant) => (
						<div
							key={`${grant.className}-${grant.userId}-${grant.id}`}
							className="flex row a-ce j-sb gap-sm"
						>
							<span>
								{grant.className}:{" "}
								{userName.get(grant.userId) || grant.userId}
								{" · "}
								{recordName.get(grant.id) || grant.id}
							</span>
							<button
								type="button"
								className="full_button sm light"
								disabled={saving}
								onClick={() =>
									saveGrants(
										grants.filter(
											(item) =>
												!(
													item.className ===
														grant.className &&
													item.userId ===
														grant.userId &&
													item.id === grant.id
												)
										)
									)
								}
							>
								Entfernen
							</button>
						</div>
					))}
				</div>
			)}
			<SlideIn
				header="Unterseite"
				isOpen={isOpen}
				cancel={() => setIsOpen(false)}
				confirm={addGrant}
				disabled={[saving, saving || !userId || !recordId]}
				confirmText="Hinzufügen"
			>
				<div className="flex col gap-sm">
					<div className="flex row a-ce j-sb gap-sm">
						<label>Klasse</label>
						<Select
							options={pages.map((page) => ({
								label: page,
								value: page
							}))}
							value={className}
							onChange={(option) => {
								setClassName(option.value as ModuleClass);
								setRecordId("");
							}}
						/>
					</div>
					<div className="flex row a-ce j-sb gap-sm">
						<label>Nutzer</label>
						<Select
							options={((users || []) as PatstoreUser[]).map(
								(user) => ({
									label: user.name || user.username,
									value: user.objectId
								})
							)}
							value={userId}
							placeholder="Nutzer wählen"
							onChange={(option) =>
								setUserId(String(option.value || ""))
							}
						/>
					</div>
					<div className="flex row a-ce j-sb gap-sm">
						<label>Datensatz</label>
						<Select
							options={((records || []) as RecordOption[]).map(
								(record) => ({
									label: recordLabel(record),
									value: record.objectId
								})
							)}
							value={recordId}
							placeholder="Datensatz wählen"
							onChange={(option) =>
								setRecordId(String(option.value || ""))
							}
						/>
					</div>
				</div>
			</SlideIn>
		</div>
	);
};

export default AppModuleEditPages;

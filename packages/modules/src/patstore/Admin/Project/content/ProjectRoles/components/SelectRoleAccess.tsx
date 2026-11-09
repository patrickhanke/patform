"use client";

import { useCallback, useState } from "react";
import { Module, PatstoreRoleAccess } from "@repo/types";
import { SlideIn } from "@repo/ui";
import { isActiveAccessGrant, useDataHandler } from "@repo/provider";

const emptyGrant = (): PatstoreRoleAccess => ({
	id: "",
	className: "Club",
	expires_at: null
});

const SelectRoleAccess = ({
	roleId,
	projectId,
	modules
}: {
	roleId: string;
	projectId: string;
	modules: Module[];
}) => {
	const { updateData } = useDataHandler(true, false);
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [grants, setGrants] = useState<PatstoreRoleAccess[]>([]);
	const classes = [...new Set(modules.map((module) => module.connected_class).filter(Boolean))];

	const load = useCallback(async () => {
		const params = new URLSearchParams({
			className: "_Role",
			useMasterKey: "true",
			projectId,
			query: `"objectId":"${roleId}"`
		});
		const response = await fetch(`/api/data?${params}`);
		const body = await response.json();
		setGrants(body?.results?.[0]?.access || []);
	}, [projectId, roleId]);

	const open = async () => {
		setLoading(true);
		await load();
		setIsOpen(true);
		setLoading(false);
	};

	const save = async () => {
		const valid = grants.flatMap((grant) => {
			const next = {
				...grant,
				expires_at: grant.expires_at || null
			};
			return isActiveAccessGrant(next) ? [next] : [];
		});
		setLoading(true);
		await updateData({
			className: "_Role",
			objectId: roleId,
			updateObject: { access: valid },
			feedback: "Zugänge gespeichert"
		});
		setGrants(valid);
		setIsOpen(false);
		setLoading(false);
	};

	return (
		<>
			<button className="full_button sm light" type="button" onClick={open}>
				Zugänge
			</button>
			<SlideIn
				isOpen={isOpen}
				header="Einzelzugänge"
				cancel={() => setIsOpen(false)}
				confirm={save}
				disabled={[loading, loading]}
			>
				<div className="flex col gap-sm">
					<p>Diese Rolle darf einzelne Datensätze öffnen, ohne das ganze Modul zu sehen.</p>
					{grants.map((grant, index) => (
						<div key={`${grant.id}-${index}`} className="flex col gap-xs">
							<label>
								Klasse
								<select
									value={grant.className}
									onChange={(event) =>
										setGrants((current) =>
											current.map((item, itemIndex) =>
												itemIndex === index
													? {
															...item,
															className: event.target
																.value as PatstoreRoleAccess["className"]
														}
													: item
											)
										)
									}
								>
									{classes.map((className) => (
										<option key={className} value={className}>
											{className}
										</option>
									))}
								</select>
							</label>
							<label>
								Datensatz-ID
								<input
									value={grant.id}
									onChange={(event) =>
										setGrants((current) =>
											current.map((item, itemIndex) =>
												itemIndex === index
													? { ...item, id: event.target.value.trim() }
													: item
											)
										)
									}
								/>
							</label>
							<label>
								Gültig bis
								<input
									type="date"
									value={grant.expires_at ? grant.expires_at.slice(0, 10) : ""}
									onChange={(event) =>
										setGrants((current) =>
											current.map((item, itemIndex) =>
												itemIndex === index
													? {
															...item,
															expires_at: event.target.value
																? new Date(
																		`${event.target.value}T23:59:59.000Z`
																	).toISOString()
																: null
														}
													: item
											)
										)
									}
								/>
							</label>
							<button
								type="button"
								className="full_button sm light"
								onClick={() =>
									setGrants((current) =>
										current.filter((_, itemIndex) => itemIndex !== index)
									)
								}
							>
								Entfernen
							</button>
						</div>
					))}
					<button
						type="button"
						className="full_button sm"
						onClick={() =>
							setGrants((current) => [
								...current,
								{
									...emptyGrant(),
									className: (classes[0] ||
										"Club") as PatstoreRoleAccess["className"]
								}
							])
						}
					>
						Zugang hinzufügen
					</button>
				</div>
			</SlideIn>
		</>
	);
};

export default SelectRoleAccess;

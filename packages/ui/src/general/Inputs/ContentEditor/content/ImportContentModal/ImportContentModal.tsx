"use client";

import { useContext, useMemo, useState } from "react";
import { ContentClass } from "@repo/types";
import { PatstoreAppContext, useFindData } from "@repo/provider";
import { Modal } from "@repo/ui";
import "./ImportContentModal.scss";

export type ImportedContentRef = {
	objectId: string;
	title: string;
	type: string;
	content_id: string;
};

type ImportContentModalProps = {
	isOpen: boolean;
	onClose: () => void;
	onImport: (content: ImportedContentRef) => void;
};

const ImportContentModal = ({
	isOpen,
	onClose,
	onImport
}: ImportContentModalProps) => {
	const { currentModule } = useContext(PatstoreAppContext);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [search, setSearch] = useState("");

	const { data: contentItems, loading } = useFindData({
		objectName: "Content",
		fields: [
			"objectId",
			"title",
			"content_id",
			"type",
			"active",
			"createdAt"
		],
		moduleId: currentModule?.objectId,
		filters: [],
		limit: 100,
		skip: 0,
		skipQuery: !isOpen || !currentModule?.objectId
	});

	const items = useMemo(() => {
		const list = (contentItems || []) as ContentClass[];
		const q = search.trim().toLowerCase();
		if (!q) return list;
		return list.filter(
			(item) =>
				item.title?.toLowerCase().includes(q) ||
				item.content_id?.toLowerCase().includes(q) ||
				item.type?.toLowerCase().includes(q)
		);
	}, [contentItems, search]);

	const selected = items.find((item) => item.objectId === selectedId);

	const handleClose = () => {
		setSelectedId(null);
		setSearch("");
		onClose();
	};

	return (
		<Modal
			header="Inhaltselement importieren"
			isOpen={isOpen}
			cancelButtonHandler={handleClose}
			confirmButtonHandler={() => {
				if (!selected) return;
				onImport({
					objectId: selected.objectId,
					title: selected.title,
					type: selected.type,
					content_id: selected.content_id
				});
				handleClose();
			}}
			confirmButtonText="Einfügen"
			cancelButtonText="Abbrechen"
			buttonDisabled={[false, !selected]}
			styles={{ minHeight: "360px", maxHeight: "70vh" }}
		>
			<div className="import-content-modal">
				<p className="import-content-modal-hint">
					Wähle ein vordefiniertes Inhaltselement. Es wird als
					Referenz (objectId) in die Seite geschrieben und auf der
					Website nachgeladen.
				</p>
				<input
					type="search"
					className="import-content-modal-search"
					placeholder="Suchen nach Titel, ID oder Typ…"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				{loading && (
					<p className="import-content-modal-status">Lädt …</p>
				)}
				{!loading && items.length === 0 && (
					<p className="import-content-modal-status">
						Keine aktiven Inhaltselemente gefunden.
					</p>
				)}
				<ul className="import-content-modal-list">
					{items.map((item) => (
						<li key={item.objectId}>
							<button
								type="button"
								className={`import-content-modal-item ${
									selectedId === item.objectId
										? "selected"
										: ""
								}`}
								onClick={() => setSelectedId(item.objectId)}
							>
								<span className="import-content-modal-item-title">
									{item.title || "Ohne Titel"}
								</span>
								<span className="import-content-modal-item-meta">
									{item.type}
									{item.content_id
										? ` · ${item.content_id}`
										: ""}
									{item.active === false ? " · inaktiv" : ""}
								</span>
							</button>
						</li>
					))}
				</ul>
			</div>
		</Modal>
	);
};

export default ImportContentModal;

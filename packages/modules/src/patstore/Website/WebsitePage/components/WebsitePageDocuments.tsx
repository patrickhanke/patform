"use client";

import { FC, useContext } from "react";
import { PatstoreAppContext } from "@repo/provider";
import "../styles.scss";
import { useMemo, useState } from "react";
import { useFindData } from "@repo/provider";
import {
	ElementSelectInterface,
	SelectElement,
	SlideIn,
	StateDisplay
} from "@repo/ui";
import { DownloadClass } from "@repo/types";
import { WebsitePageDocumentsProps } from "../types";

const WebsitePageDocuments: FC<WebsitePageDocumentsProps> = ({
	documents = [],
	isEditable,
	onChange
}) => {
	const { modules } = useContext(PatstoreAppContext);
	const [newDocuments, setNewDocuments] = useState<string[]>(documents);

	const downloadModule = modules.find(
		(module) => module.path === "/downloads"
	);
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const { data } = useFindData({
		objectName: "Download",
		fields: [
			"objectId",
			"title",
			"info",
			"image",
			"file { name url }",
			"categories"
		],
		moduleId: downloadModule?.objectId,
		skipQuery: !downloadModule?.objectId
	});

	const elements = useMemo(() => {
		const documentOptionsArray: SelectElement[] = [];
		if (data) {
			data.forEach((doc: DownloadClass) => {
				if (doc) {
					documentOptionsArray.push({
						value: doc.objectId,
						id: doc.objectId,
						label: `${doc.title}`,
						element: (
							<div className="flex row gap-sm">
								<span>{doc.title}</span>
							</div>
						)
					});
				}
			});
		}
		documentOptionsArray.sort((a, b) => a.label?.localeCompare(b.label));

		return documentOptionsArray;
	}, [data]);

	const selectCategory = useMemo(
		() => (
			<ElementSelectInterface
				elements={elements}
				selectedElements={elements.filter((element) =>
					newDocuments?.includes(element.id)
				)}
				onSelect={(selectValue) => {
					if (!selectValue || selectValue.length === 0) {
						const newDocumentsArray = [...documents].filter(
							(category) =>
								!elements.find(
									(element) => element.id === category
								)
						);

						setNewDocuments(newDocumentsArray);
					} else if (selectValue.length > 0) {
						const newDocumentsArray: string[] = [
							...documents
						].filter(
							(category) =>
								!elements.find(
									(element) => element.id === category
								)
						);

						const newIds: string[] = selectValue.map(
							(value: SelectElement) => value.id
						) as string[];

						setNewDocuments([...newDocumentsArray, ...newIds]);
					}
				}}
				max={10}
				isSearchable
			/>
		),
		[elements, documents, newDocuments, data, onChange]
	);

	return (
		<>
			<div style={{ width: "180px" }}>
				{!documents ||
				documents?.length === 0 ||
				!documents.some((docId: string) =>
					elements.some((element) => element.id === docId)
				) ? (
					<button
						type="button"
						onClick={() => setIsOpen(true)}
						className="full_button sm grey"
						disabled={!isEditable}
					>
						<span>+ Dokumente hinzufügen</span>
					</button>
				) : (
					<div
						onClick={() => setIsOpen(true)}
						className="flex row gap-sm"
					>
						<span>
							{documents.map((docId: string) => {
								const document = elements.find(
									(element) => element.id === docId
								);
								if (document) {
									return (
										<StateDisplay
											key={docId}
											label={document.label}
											color={document.color}
										/>
									);
								}
								return null;
							})}
						</span>
					</div>
				)}
			</div>
			<SlideIn
				isOpen={isOpen}
				cancel={() => setIsOpen(false)}
				confirm={async () => {
					setLoading(true);
					await onChange(newDocuments);
					setIsOpen(false);
					setLoading(false);
				}}
				disabled={[loading, loading]}
				header="Kategorie auswählen"
			>
				{selectCategory}
			</SlideIn>
		</>
	);
};

export default WebsitePageDocuments;

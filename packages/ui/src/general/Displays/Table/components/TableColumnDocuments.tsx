import { TableColumnDocumentsProps } from "../types";
import { ElementSelectInterface, SelectElement, SlideIn } from "@repo/ui";
import { useContext, useMemo, useState } from "react";
import { PatstoreAppContext, useFindData } from "@repo/provider";
import { DownloadClass } from "@repo/types";

const TableColumnDocuments = ({
	value,
	isEditable = true,
	onChange
}: TableColumnDocumentsProps) => {
	const { modules } = useContext(PatstoreAppContext);
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [newDownloads, setNewDownloads] = useState<string[]>(value || []);

	const { data: downloadData } = useFindData({
		objectName: "Download",
		fields: ["objectId", "label"],
		moduleId: modules.find((module) => module.path === "/downloads")
			?.objectId
	});

	const elements = useMemo(() => {
		const downloadOptionsArray: SelectElement[] = [];
		if (downloadData) {
			downloadData.forEach((download: DownloadClass) => {
				if (download) {
					downloadOptionsArray.push({
						value: download.objectId,
						id: download.objectId,
						label: `${download.label}`
					});
				}
			});
		}
		downloadOptionsArray.sort((a, b) => a.label?.localeCompare(b.label));

		return downloadOptionsArray;
	}, [downloadData]);

	const currentDownloads: SelectElement[] = useMemo(() => {
		const elementData: SelectElement[] = [];
		const invalidIds: string[] = [];

		if (elements.length === 0) {
			return [];
		}

		newDownloads.forEach((vl) => {
			const download = elements.find((element) => element.id === vl);
			if (download) {
				elementData.push(download);
			} else {
				invalidIds.push(vl);
			}
		});
		if (invalidIds.length > 0) {
			onChange(elementData.map((element) => element.id));
		}

		return elementData || [];
	}, [elements, newDownloads]);

	const selectDownload = useMemo(
		() => (
			<ElementSelectInterface
				elements={elements}
				selectedElements={currentDownloads}
				onSelect={(selectValue) => {
					if (!selectValue || selectValue.length === 0) {
						setNewDownloads([]);
					} else if (selectValue.length > 0) {
						setNewDownloads(selectValue.map((value) => value.id));
					}
				}}
				max={20}
				isSearchable
			/>
		),
		[elements, value, currentDownloads]
	);

	return (
		<div>
			{!value || value?.length === 0 ? (
				<button
					type="button"
					onClick={() => setIsOpen(true)}
					className="full_button sm grey"
					disabled={!isEditable}
				>
					<span>+ Dokument hinzufügen</span>
				</button>
			) : (
				<button
					type="button"
					onClick={() => setIsOpen(true)}
					className="full_button sm light"
					disabled={!isEditable}
				>
					<div className="person_display_container">
						<span>{value.length} Dokumente</span>
					</div>
				</button>
			)}
			<SlideIn
				isOpen={isOpen}
				cancel={() => setIsOpen(false)}
				confirm={async () => {
					setLoading(true);
					await onChange(newDownloads);
					setIsOpen(false);
					setLoading(false);
				}}
				disabled={[loading, loading]}
				header="Downloaden auswählen"
			>
				{selectDownload}
			</SlideIn>
		</div>
	);
};

export default TableColumnDocuments;

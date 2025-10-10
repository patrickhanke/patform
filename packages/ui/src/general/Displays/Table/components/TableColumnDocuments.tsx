import { TableColumnDocumentsProps } from "../types";
import { ElementSelectInterface, SelectElement, SlideIn } from "@repo/ui";
import { useContext, useMemo, useState } from "react";
import { PatstoreAppContext, generateGraphQLQuery } from "@repo/provider";
import { useQuery } from "@apollo/client";
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

	const { data: personData } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Download",
			fields: ["objectId", "label"]
		}),
		{
			variables: {
				params: {
					module: {
						_eq: modules.find(
							(module) => module.path === "/downloads"
						)?.objectId
					}
				}
			}
		}
	);

	const elements = useMemo(() => {
		const personOptionsArray: SelectElement[] = [];
		if (personData) {
			personData.objects.findDownload.results.forEach(
				(person: DownloadClass) => {
					if (person) {
						personOptionsArray.push({
							value: person.objectId,
							id: person.objectId,
							label: `${person.label}`
						});
					}
				}
			);
		}
		personOptionsArray.sort((a, b) => a.label?.localeCompare(b.label));

		return personOptionsArray;
	}, [personData]);

	const currentDownloads: SelectElement[] = useMemo(() => {
		const elementData: SelectElement[] = [];
		const invalidIds: string[] = [];

		if (elements.length === 0) {
			return [];
		}

		newDownloads.forEach((vl) => {
			const person = elements.find((element) => element.id === vl);
			if (person) {
				elementData.push(person);
			} else {
				console.log(vl);
				invalidIds.push(vl);
			}
		});
		if (invalidIds.length > 0) {
			console.log(invalidIds);
			onChange(elementData.map((element) => element.id));
		}

		return elementData || [];
	}, [elements, newDownloads]);

	console.log(currentDownloads);

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
				max={6}
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

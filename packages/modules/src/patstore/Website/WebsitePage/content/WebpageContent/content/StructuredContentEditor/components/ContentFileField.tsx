"use client";

import { Button } from "@chakra-ui/react";
import { PatstoreAppContext, useFindData } from "@repo/provider";
import { DownloadClass } from "@repo/types";
import { ElementSelectInterface, Modal, SelectElement } from "@repo/ui";
import {
	FC,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState
} from "react";

type ContentFileFieldProps = {
	value?: string;
	onChange: (value: string) => void;
};

/**
 * Single Download picker — stores the Download `objectId` as the field value.
 */
const ContentFileField: FC<ContentFileFieldProps> = ({ value, onChange }) => {
	const { modules, project } = useContext(PatstoreAppContext);
	const [isOpen, setIsOpen] = useState(false);
	const [selectedId, setSelectedId] = useState<string | undefined>(
		value || undefined
	);

	const downloadsModuleId = modules.find(
		(module) => module.path === "/downloads"
	)?.objectId;

	const { data: downloadData } = useFindData({
		objectName: "Download",
		fields: ["objectId", "label"],
		moduleId: downloadsModuleId,
		projectId: project?.objectId
	});

	useEffect(() => {
		setSelectedId(value || undefined);
	}, [value]);

	const options: SelectElement[] = useMemo(() => {
		if (!downloadData) {
			return [];
		}

		return downloadData
			.filter((download): download is DownloadClass => !!download)
			.map((download) => ({
				id: download.objectId,
				value: download.objectId,
				label: download.label || download.objectId
			}))
			.sort((a, b) => (a.label || "").localeCompare(b.label || ""));
	}, [downloadData]);

	const selectedElements = useMemo(() => {
		if (!selectedId) {
			return [];
		}

		const match = options.find((option) => option.value === selectedId);
		return match ? [match] : [];
	}, [options, selectedId]);

	const currentLabel = useMemo(() => {
		if (!value) {
			return "+ Datei hinzufügen";
		}

		return (
			options.find((option) => option.value === value)?.label ||
			"Datei ausgewählt"
		);
	}, [options, value]);

	const openHandler = useCallback(() => {
		setSelectedId(value || undefined);
		setIsOpen(true);
	}, [value]);

	return (
		<>
			<Button
				type="button"
				size="xs"
				colorPalette={value ? "gray" : "blue"}
				variant={value ? "outline" : "solid"}
				onClick={openHandler}
			>
				{currentLabel}
			</Button>
			<Modal
				isOpen={isOpen}
				cancelButtonHandler={() => setIsOpen(false)}
				confirmButtonHandler={() => {
					onChange(selectedId || "");
					setIsOpen(false);
				}}
				header="Download wählen"
				buttonDisabled={[false, !selectedId]}
				styles={{ width: "360px", height: "480px" }}
			>
				<ElementSelectInterface
					elements={options}
					selectedElements={selectedElements}
					onSelect={(elements) => {
						setSelectedId(
							(elements[0]?.value as string | null) || undefined
						);
					}}
					max={1}
					isSearchable
				/>
			</Modal>
		</>
	);
};

export default ContentFileField;

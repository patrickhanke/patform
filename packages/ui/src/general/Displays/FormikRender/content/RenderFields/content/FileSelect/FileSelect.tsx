import React, {
	Dispatch,
	SetStateAction,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState
} from "react";
import { PatstoreAppContext } from "@repo/provider";
import { useFindDownload } from "@repo/provider";
import { DownloadClass, Module, Filter } from "@repo/types";
import { Modal } from "@repo/ui";
import { isArray } from "lodash";
import DownloadSelect from "./components/DownloadSelect";
import { DownloadOption } from "./types";

interface FileSelectProps {
	onChange: (value: string | string[]) => void;
	values: string | string[] | undefined;
	isMulti?: boolean;
	setSecondaryContent?: Dispatch<SetStateAction<React.ReactNode | null>>;
}

const FileSelect: React.FC<FileSelectProps> = ({
	onChange,
	values,
	isMulti = false,
	setSecondaryContent
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [fieldValue, setFieldValue] = useState<string | string[] | undefined>(
		values ? values : isMulti ? [] : undefined
	);
	const { modules } = useContext(PatstoreAppContext);
	const { downloads: downloadData, refetch } = useFindDownload({
		module: modules.find(
			(module) => module.path === "/downloads"
		) as Module,
		filters: [] as Filter[],
		limit: 0,
		skip: 0
	});

	useEffect(() => {
		refetch();
	}, [isOpen]);

	const options: DownloadOption[] = useMemo(() => {
		const optionsArray: DownloadOption[] = [];
		if (downloadData) {
			downloadData.forEach((download: DownloadClass) => {
				optionsArray.push({
					value: download.objectId,
					label: download.label
				});
			});
		}
		return optionsArray;
	}, [downloadData]);

	const elementSelect = useMemo(
		() => (
			<DownloadSelect
				isMulti={isMulti}
				setFieldValue={(values) => {
					setFieldValue(values);
					onChange(values);
				}}
				options={options}
				values={fieldValue}
				refetch={refetch}
			/>
		),
		[options, values, onChange, isMulti, downloadData, fieldValue]
	);

	const buttonClickHandler = useCallback(() => {
		setIsOpen(!isOpen);
	}, [isOpen, setSecondaryContent, values, fieldValue]);

	const currentValues = useMemo(() => {
		if (fieldValue) {
			if (isArray(fieldValue)) {
				return `${fieldValue.length} Dateien`;
			} else {
				return options.find((option) => option.value === fieldValue)
					?.label;
			}
		}
		return "+ Dateien hinzufügen";
	}, [fieldValue, options]);

	return (
		<>
			<div>
				<button
					className="full_button sm primary"
					onClick={() => buttonClickHandler()}
				>
					{currentValues}
				</button>
			</div>
			<Modal
				isOpen={isOpen}
				cancelButtonHandler={() => setIsOpen(false)}
				confirmButtonHandler={() => {
					onChange(fieldValue as string | string[]);
					setIsOpen(false);
				}}
				header={isMulti ? "Dateien wählen" : "Datei wählen"}
				buttonDisabled={[false, !fieldValue]}
				styles={{ width: "360px", height: "480px" }}
			>
				{elementSelect}
			</Modal>
		</>
	);
};

export default FileSelect;

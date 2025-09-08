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
import { useFindDownload } from "@repo/modules";
import { DownloadClass } from "@repo/types";
import { Modal } from "@repo/ui";
import { isArray } from "lodash";
import DownloadSelect from "./components/DownloadSelect";
import { DownloadOption } from "./types";

interface FileSelectProps {
	name: string;
	onChange: (value: string | string[]) => void;
	values: { [key: string]: string | string[] | undefined };
	isMulti?: boolean;
	setSecondaryContent?: Dispatch<SetStateAction<React.ReactNode | null>>;
}

const FileSelect: React.FC<FileSelectProps> = ({
	name,
	onChange,
	values,
	isMulti = false,
	setSecondaryContent
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [fieldValue, setFieldValue] = useState<string | string[] | undefined>(
		values[name]
	);
	const { modules } = useContext(PatstoreAppContext);
	const { downloads: downloadData, refetch } = useFindDownload({
		moduleId: modules.find((module) => module.path === "/downloads")
			?.objectId,
		filters: []
	});

	console.log(downloadData);

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

	console.log({ values });
	console.log({ options });

	const elementSelect = useMemo(
		() => (
			<DownloadSelect
				isMulti={isMulti}
				setFieldValue={setFieldValue}
				options={options}
				values={values[name] ? values[name] : isMulti ? [] : undefined}
				refetch={refetch}
			/>
		),
		[
			options,
			values,
			onChange,
			isMulti,
			values,
			downloadData,
			setFieldValue
		]
	);

	const buttonClickHandler = useCallback(() => {
		if (setSecondaryContent) {
			setSecondaryContent(elementSelect);
		} else {
			setIsOpen(!isOpen);
		}
	}, [isOpen, setSecondaryContent, values]);

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
			>
				{elementSelect}
			</Modal>
		</>
	);
};

export default FileSelect;

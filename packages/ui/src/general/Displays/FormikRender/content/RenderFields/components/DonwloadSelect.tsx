import React, {
	Dispatch,
	SetStateAction,
	useCallback,
	useContext,
	useMemo,
	useState
} from "react";
import { PatstoreAppContext } from "@repo/provider";
import { useFindDownload } from "@repo/modules";
import { DownloadClass } from "@repo/types";
import { ElementSelectInterface, Modal } from "@repo/ui";
import { isArray } from "lodash";

type DownloadOption = {
	value: string;
	label: string;
};

interface DownloadSelectProps {
	name: string;
	label?: string;
	onChange: (value: string | string[]) => void;
	values: { [key: string]: any };
	isHorizontal?: boolean;
	isMulti?: boolean;
	setSecondaryContent?: Dispatch<SetStateAction<React.ReactNode | null>>;
}

const DownloadSelect: React.FC<DownloadSelectProps> = ({
	name,
	label,
	onChange,
	values,
	isMulti = false,
	isHorizontal,
	setSecondaryContent
}) => {
	console.log(name, values);
	const [isOpen, setIsOpen] = useState(false);
	const [fieldValue, setFieldValue] = useState<
		string | string[] | undefined
	>();
	const { modules } = useContext(PatstoreAppContext);
	const { downloads: downloadData, refetch } = useFindDownload({
		moduleId: modules.find((module) => module.path === "/downloads")
			?.objectId,
		filters: []
	});

	console.log(downloadData);

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

	const getSelectedElements = useCallback(() => {
		if (values[name]) {
			if (typeof values[name] === "string") {
				const element = options.find(
					(option) => option.value === values[name]
				);
				return element ? [element] : [];
			} else {
				return values[name].map((value: string) =>
					options.find((option) => option.value === value)
				);
			}
		} else {
			return [];
		}
	}, [values]);

	const elementSelect = useMemo(
		() => (
			<ElementSelectInterface
				elements={options}
				onSelect={(elements) => {
					if (isMulti) {
						setFieldValue(elements.map((el) => el.value));
					} else {
						if (elements.length > 0 && elements[0]) {
							setFieldValue(elements[0].value);
						}
					}
				}}
				max={isMulti ? 1 : 10}
				selectedElements={getSelectedElements()}
			/>
		),
		[options, onChange, isMulti, values]
	);

	const buttonClickHandler = useCallback(() => {
		if (setSecondaryContent) {
			setSecondaryContent(elementSelect);
		} else {
			setIsOpen(!isOpen);
		}
	}, [isOpen, setSecondaryContent]);

	const currentValues = useMemo(() => {
		if (fieldValue) {
			if (isArray(fieldValue)) {
				return (
					<div>
						{fieldValue.map(
							(value: string) =>
								options.find((option) => option.value === value)
									?.label
						)}
					</div>
				);
			} else {
				return (
					<div className="label">
						{
							options.find(
								(option) => option.value === fieldValue
							)?.label
						}
					</div>
				);
			}
		}
		return undefined;
	}, [fieldValue, options]);

	return (
		<>
			<div className={isHorizontal ? "form_horizontal_container" : ""}>
				<label htmlFor={name}>{label || name} </label>
				{currentValues ? (
					<p>{currentValues}</p>
				) : (
					<button
						className="full_button sm primary"
						onClick={() => buttonClickHandler()}
					>
						Elemente auswählen
					</button>
				)}
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

export default DownloadSelect;

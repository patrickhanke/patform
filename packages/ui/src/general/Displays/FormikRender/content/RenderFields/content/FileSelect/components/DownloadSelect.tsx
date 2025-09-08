import {
	SwitchButtons,
	ElementSelectInterface,
	FileUploader,
	Divider
} from "@repo/ui";
import { FC, useCallback, useState } from "react";
import site_states from "../constants/site_states";
import { DownloadOption, DownloadSelectProps } from "../types";

const DownloadSelect: FC<DownloadSelectProps> = ({
	isMulti,
	setFieldValue,
	options,
	values,
	refetch,
	name
}) => {
	const [siteState, setSiteState] = useState<(typeof site_states)[number]>({
		...site_states[0]
	});

	const getSelectedElements = useCallback(() => {
		if (values) {
			if (typeof values === "string") {
				const element = options.find(
					(option) => option.value === values
				);
				return element ? [element] : [];
			} else {
				const returnArray: Array<DownloadOption> = [];
				values.forEach((value: string) => {
					const element = options.find(
						(option) => option.value === value
					);
					if (element) {
						returnArray.push(element);
					}
				});

				return returnArray;
			}
		} else {
			return [];
		}
	}, [values, options]);

	return (
		<div>
			<SwitchButtons
				buttonStates={[...site_states]}
				changeHandler={(value: (typeof site_states)[number]) =>
					setSiteState(value)
				}
				currentStates={siteState}
			/>
			<Divider />
			{siteState.value === "select" && (
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
					max={isMulti ? 10 : 1}
					selectedElements={getSelectedElements() || []}
				/>
			)}
			{siteState.value === "upload" && (
				<FileUploader
					type="file"
					name={name}
					onComplete={() => {
						refetch();
						setSiteState({ ...site_states[0] });
					}}
					afterUploadHandler={async (imageArray: string[]) => {
						await refetch();
						setFieldValue(imageArray);
					}}
					maxFileCount={1}
					classKey="file"
					className="Download"
					existingFiles={values ? values.length : 0}
					inline
				/>
			)}
		</div>
	);
};

export default DownloadSelect;

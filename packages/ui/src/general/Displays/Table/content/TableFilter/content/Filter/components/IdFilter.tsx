import { FC, useCallback, useMemo, useState } from "react";
import { useAppContext, useFindData, useFindDataSecure } from "@repo/provider";
import {
	Button,
	ElementSelectInterface,
	IconButton,
	Modal,
	SelectElement
} from "@repo/ui";
import { IdFilterProps } from "../types";
import { get, isArray } from "lodash-es";

const IdFilter: FC<IdFilterProps> = ({
	label,
	isMulti = false,
	className,
	value,
	onValueChange,
	type
}) => {
	const { project } = useAppContext();
	const [isOpen, setIsOpen] = useState(false);

	const { data, loading } = useFindData({
		objectName: className || "",
		fields: ["objectId", "label"],
		filters:
			className === "User"
				? [
						{
							key: "projects",
							value: [project?.objectId],
							operator: "in"
						}
					]
				: [],
		limit: 1000,
		order: "label_ASC",
		skipQuery: !className,
		projectId: className !== "User" ? project?.objectId : undefined
	});

	console.log({ data });

	const selectElements = useMemo(() => {
		if (!data) {
			return [];
		}
		const dataElements = data.map((element) => ({
			label: element.label,
			value: element.objectId
		}));

		return dataElements.filter((element) => element.label);
	}, [data]);

	const getElementsFromValue = useCallback((): SelectElement[] => {
		if (isMulti && isArray(value)) {
			if (value && value.length === 0) {
				return [];
			}
			return selectElements.filter((element) =>
				value.includes(element.value)
			);
		}
		if (value && !isArray(value)) {
			const element = selectElements.find(
				(element) => element.value === getValue()
			);
			return element ? [element] : [];
		}
		return [];
	}, [value, isMulti, selectElements]);

	const getValue = useCallback(() => {
		if (type === "pointer") {
			return get(value, "id.equalTo");
		}
		return value;
	}, [value, type]);

	if (!className) {
		return null;
	}

	return (
		<>
			<div className="filter-row-content">
				<div
					className="w-100 flex a-st gap-md col"
					style={{ marginTop: 12 }}
				>
					{isMulti && Array.isArray(value) ? (
						value.map((element_value) => (
							<div
								key={element_value}
								className="content_element flex row a-ce j-sb w-100"
							>
								<p>
									{
										selectElements.find(
											(element) =>
												element.value === element_value
										)?.label
									}
								</p>
								<IconButton
									icon="delete"
									onClick={() => {
										const newValues = value.filter(
											(v) => v !== element_value
										);
										if (newValues.length === 0) {
											onValueChange("");
										} else {
											onValueChange(newValues);
										}
									}}
								/>
							</div>
						))
					) : value ? (
						<div className="content_element flex row a-ce j-sb w-100">
							<p>
								{
									selectElements.find(
										(element) =>
											element.value === getValue()
									)?.label
								}
							</p>
							<IconButton
								icon="delete"
								onClick={() => onValueChange("")}
							/>
						</div>
					) : null}
				</div>
				<div className="flex a-st w-100">
					<Button
						text={`${label} auswählen`}
						onClick={() => setIsOpen(true)}
						loading={loading}
						disabled={loading || !data || data.length === 0}
						size={12}
						styles={{ width: "100%", maxWidth: "100%" }}
					/>
				</div>
			</div>

			<Modal
				isOpen={isOpen}
				cancelButtonHandler={() => {
					setIsOpen(false);
					onValueChange("");
				}}
				confirmButtonHandler={() => setIsOpen(false)}
				header="Wert auswählen"
				confirmButtonText="Auswählen"
				cancelButtonText="Abbrechen"
				styles={{ width: 500, height: 600 }}
			>
				<ElementSelectInterface
					elements={selectElements}
					selectedElements={getElementsFromValue()}
					onSelect={(elements) => {
						console.log(elements);
						if (type === "pointer") {
							const value = elements[0]?.value;
							if (value) {
								const pointerValue = {
									id: { equalTo: `${value}` }
								};
								onValueChange(pointerValue);
							} else {
								onValueChange("");
							}
						} else {
							if (isMulti) {
								const values = elements.map(
									(element) => element.value
								);
								if (values) {
									onValueChange(values as string[]);
								} else {
									onValueChange("");
								}
							} else {
								const value = elements[0]?.value;
								if (value) {
									onValueChange(value as string);
								} else {
									onValueChange("");
								}
							}
						}
					}}
					isSearchable
					max={isMulti ? 8 : 1}
					isClearable
				/>
			</Modal>
		</>
	);
};

export default IdFilter;

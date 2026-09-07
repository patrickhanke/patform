"use client";

import { FC, useEffect, useMemo, useState } from "react";
import {
	BooleanFilter,
	Button,
	CreateButton,
	IconButton,
	IdFilter,
	NumberFilter,
	Select,
	SelectFilter,
	SlideIn,
	StringFilter,
	SearchFilter
} from "@repo/ui";
import { ErrorMessage, Filter, FilterOperator, Module } from "@repo/types";
import { cloneDeep } from "lodash-es";
import { Check } from "lucide-react";
import { generateUUID } from "../../../functions/generateUUID";
import filterOperators, { ARRAY_OPERATORS } from "../constants/filterOperators";
import {
	FilterFieldOption,
	FilterFieldType,
	decodeSearchValue,
	encodeSearchValue,
	getFilterFieldOptions,
	getOperatorTemplateOptions,
	getQueryKey,
	getSearchFilterInputType,
	getUiFieldKey,
	OperatorTemplateOption
} from "../functions/getFilterFieldOptions";
import validateEditFilters from "../functions/validateEditFilters";
import { EditFilterProps } from "../types";

type FilterRowProps = {
	filter: Filter;
	onChange: (filter: Filter) => void;
	onDelete: () => void;
	userModule: Module;
	fieldOptions: FilterFieldOption[];
	errors: ErrorMessage[];
};

const CLASS_FIELD_TYPES: FilterFieldType[] = ["id", "ids", "pointer"];

const createEmptyFilter = (): Filter => ({
	id: generateUUID(),
	key: "",
	operator: "equalTo",
	value: ""
});

const getDefaultValue = (
	fieldType: FilterFieldType | undefined,
	operator: FilterOperator,
	template?: OperatorTemplateOption
): Filter["value"] => {
	if (operator === "exists") {
		return true;
	}

	if (ARRAY_OPERATORS.includes(operator) || fieldType === "ids") {
		return [];
	}

	if (
		fieldType === "boolean" ||
		template?.type === "toggle" ||
		template?.type === "select_toggle" ||
		template?.type === "checkbox"
	) {
		return false;
	}

	if (fieldType === "number" || template?.type === "number") {
		return 0;
	}

	return "";
};

const toListFilterValue = (value: unknown, asList = false): Filter["value"] => {
	if (typeof value === "boolean" || typeof value === "number") {
		return value;
	}

	if (Array.isArray(value)) {
		return value.map((item) =>
			typeof item === "number" ? item : String(item)
		);
	}

	if (typeof value === "string") {
		if (asList) {
			return value
				.split(",")
				.map((item) => item.trim())
				.filter(Boolean);
		}
		return value;
	}

	return asList ? [] : "";
};

const FilterValueInput: FC<{
	filter: Filter;
	fieldOption?: FilterFieldOption;
	template?: OperatorTemplateOption | null;
	onChange: (filter: Filter) => void;
}> = ({ filter, fieldOption, template, onChange }) => {
	const fieldType = fieldOption?.type;
	const isArrayValue =
		ARRAY_OPERATORS.includes(filter.operator) || fieldType === "ids";
	const className = fieldOption?.className || template?.className;
	const isClassValue =
		(fieldType && CLASS_FIELD_TYPES.includes(fieldType)) ||
		template?.type === "pointer_select";
	const isBooleanValue =
		fieldType === "boolean" ||
		filter.operator === "exists" ||
		template?.type === "toggle" ||
		template?.type === "select_toggle" ||
		template?.type === "checkbox";
	const isNumberValue = fieldType === "number" || template?.type === "number";
	const selectOptions = template?.select_options;
	const needsSearchTemplate = fieldType === "search";
	const searchPath = template?.value || "";

	const setValue = (value: unknown, asList = false) => {
		const nextValue =
			needsSearchTemplate && searchPath
				? encodeSearchValue(
						searchPath,
						toListFilterValue(value, asList)
					)
				: toListFilterValue(value, asList);

		onChange({
			...filter,
			value: nextValue
		});
	};

	if (!filter.key) {
		return null;
	}

	if (needsSearchTemplate && !filter.operatorTemplate) {
		return <p>Bitte zuerst ein Operator-Template wählen.</p>;
	}

	if (needsSearchTemplate && template && template.type !== "pointer_select") {
		return (
			<SearchFilter
				label="Wert"
				path={searchPath}
				type={getSearchFilterInputType(template.type)}
				value={typeof filter.value === "string" ? filter.value : ""}
				onValueChange={(value) =>
					onChange({
						...filter,
						value: typeof value === "string" ? value : ""
					})
				}
				selectOptions={template.select_options}
			/>
		);
	}

	if (isBooleanValue) {
		return (
			<BooleanFilter
				label="Wert"
				value={Boolean(filter.value)}
				onChange={(value) => setValue(value)}
			/>
		);
	}

	if (isClassValue && className) {
		const rawValue = needsSearchTemplate
			? decodeSearchValue(searchPath, filter.value)
			: filter.value;
		const selectedIds = Array.isArray(rawValue)
			? rawValue.map(String)
			: rawValue
				? [String(rawValue)]
				: [];

		return (
			<IdFilter
				label="Wert"
				className={className}
				value={isArrayValue ? selectedIds : selectedIds[0] || ""}
				onValueChange={(value) => setValue(value)}
				type={isArrayValue ? "ids" : "id"}
				isMulti={isArrayValue}
			/>
		);
	}

	if (selectOptions?.length) {
		return (
			<SelectFilter
				label="Wert"
				selectOptions={selectOptions}
				value={
					isArrayValue
						? Array.isArray(filter.value)
							? filter.value.map(String)
							: []
						: String(filter.value ?? "")
				}
				isMulti={isArrayValue}
				onChange={(value) => setValue(value)}
			/>
		);
	}

	if (isNumberValue) {
		return (
			<NumberFilter
				key={`${filter.id}-${filter.key}-${filter.operator}`}
				label="Wert"
				value={typeof filter.value === "number" ? filter.value : ""}
				onValueChange={(value) => setValue(value)}
			/>
		);
	}

	return (
		<StringFilter
			key={`${filter.id}-${filter.key}-${filter.operator}-${filter.operatorTemplate || ""}`}
			label="Wert"
			value={
				Array.isArray(filter.value)
					? filter.value.join(", ")
					: filter.value == null
						? ""
						: String(filter.value)
			}
			onValueChange={(value) => setValue(value, isArrayValue)}
		/>
	);
};

const FilterRow: FC<FilterRowProps> = ({
	filter,
	onChange,
	onDelete,
	userModule,
	fieldOptions,
	errors
}) => {
	const [isExpanded, setIsExpanded] = useState(!filter.key);
	const [uiFieldKey, setUiFieldKey] = useState(() =>
		getUiFieldKey(filter, userModule)
	);
	const rowId = filter.id || filter.key;
	const fieldOption = fieldOptions.find(
		(option) => option.value === uiFieldKey
	);
	const fieldType = fieldOption?.type;
	const operatorOptions = useMemo(
		() => filterOperators(fieldType || ""),
		[fieldType]
	);
	const templateOptions = useMemo(
		() => getOperatorTemplateOptions(userModule, uiFieldKey, fieldType),
		[userModule, uiFieldKey, fieldType]
	);
	const selectedField =
		fieldOptions.find((option) => option.value === uiFieldKey) || null;
	const selectedOperator =
		operatorOptions.find((option) => option.value === filter.operator) ||
		null;
	const selectedTemplate =
		templateOptions.find(
			(option) => option.value === filter.operatorTemplate
		) || null;
	const needsTemplate = fieldType === "search" || fieldType === "pointer";
	const headerLabel = selectedField?.label || "Neuer Filter";
	const headerType = [fieldType, selectedOperator?.label]
		.filter(Boolean)
		.join(" • ");

	const handleFieldChange = (option: FilterFieldOption | null) => {
		const nextType = option?.type;
		const nextOperators = filterOperators(nextType || "");
		const nextOperator = nextOperators[0]?.value || "equalTo";
		const nextUiFieldKey = option?.value || "";
		const nextTemplates = option
			? getOperatorTemplateOptions(userModule, nextUiFieldKey, nextType)
			: [];

		setUiFieldKey(nextUiFieldKey);
		onChange({
			...filter,
			key: getQueryKey(option),
			operator: nextOperator,
			operatorTemplate:
				nextTemplates.length === 1
					? nextTemplates[0]?.value
					: undefined,
			value:
				nextType === "search" && nextTemplates[0]?.value
					? encodeSearchValue(
							nextTemplates[0].value,
							getDefaultValue(
								nextType,
								nextOperator,
								nextTemplates[0]
							)
						)
					: getDefaultValue(nextType, nextOperator, nextTemplates[0])
		});
	};

	const handleOperatorChange = (operator: FilterOperator) => {
		onChange({
			...filter,
			operator,
			value: getDefaultValue(
				fieldType,
				operator,
				selectedTemplate || undefined
			)
		});
	};

	const handleTemplateChange = (option: OperatorTemplateOption | null) => {
		const nextValue = getDefaultValue(
			fieldType,
			filter.operator,
			option || undefined
		);

		onChange({
			...filter,
			operatorTemplate: option?.value,
			value:
				fieldType === "search" && option?.value
					? encodeSearchValue(option.value, nextValue)
					: nextValue
		});
	};

	return (
		<div className="filter-select-item" data-selected={isExpanded}>
			<div className="flex row a-ce">
				<button
					type="button"
					className="filter-select-button"
					onClick={() => setIsExpanded((current) => !current)}
					data-selected={isExpanded}
				>
					<div className="filter-select-checkbox">
						{isExpanded && <Check size={14} />}
					</div>
					<div className="filter-select-info">
						<span className="filter-select-label">
							{headerLabel}
						</span>
						{headerType ? (
							<span className="filter-select-type">
								{headerType}
							</span>
						) : null}
					</div>
				</button>
				<IconButton icon="delete" onClick={onDelete} />
			</div>
			{isExpanded ? (
				<div className="filter-input-section">
					<div className="flex col gap-md">
						<Select
							label="Feld"
							id={`${rowId}-key`}
							options={fieldOptions}
							value={selectedField}
							errors={errors}
							onChange={handleFieldChange}
							width="100%"
						/>
						<Select
							label="Operator"
							id={`${rowId}-operator`}
							options={operatorOptions}
							value={selectedOperator}
							errors={errors}
							onChange={(option) =>
								handleOperatorChange(
									(option?.value as FilterOperator) ||
										"equalTo"
								)
							}
							isDisabled={!uiFieldKey}
							width="100%"
						/>
						{needsTemplate ? (
							<Select
								label="Operator-Template"
								id={`${rowId}-operatorTemplate`}
								options={templateOptions}
								value={selectedTemplate}
								errors={errors}
								onChange={handleTemplateChange}
								isDisabled={
									!uiFieldKey || templateOptions.length === 0
								}
								width="100%"
							/>
						) : null}
						<FilterValueInput
							filter={filter}
							fieldOption={fieldOption}
							template={selectedTemplate}
							onChange={onChange}
						/>
					</div>
				</div>
			) : null}
		</div>
	);
};

const EditFilter: FC<EditFilterProps> = ({ filters, onSave, userModule }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [draftFilters, setDraftFilters] = useState<Filter[]>([]);
	const [errors, setErrors] = useState<ErrorMessage[]>([]);

	const fieldOptions = useMemo(
		() => getFilterFieldOptions(userModule),
		[userModule]
	);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		setErrors(validateEditFilters(draftFilters, userModule));
	}, [draftFilters, isOpen, userModule]);

	const openModal = () => {
		setDraftFilters(
			cloneDeep(filters).map((filter) => ({
				...filter,
				id: filter.id || generateUUID()
			}))
		);
		setErrors([]);
		setIsOpen(true);
	};

	const closeModal = () => {
		setIsOpen(false);
		setErrors([]);
		setDraftFilters([]);
	};

	const handleSave = () => {
		const nextErrors = validateEditFilters(draftFilters, userModule);
		setErrors(nextErrors);
		if (nextErrors.length > 0) {
			return;
		}

		onSave(draftFilters);
		closeModal();
	};

	const updateFilter = (nextFilter: Filter) => {
		setDraftFilters((current) =>
			current.map((filter) =>
				filter.id === nextFilter.id ? nextFilter : filter
			)
		);
	};

	return (
		<>
			<Button text="Filter bearbeiten" onClick={openModal} />
			<SlideIn
				header="Filter bearbeiten"
				isOpen={isOpen}
				cancel={closeModal}
				confirm={handleSave}
				confirmText="Speichern"
				disabled={[false, errors.length > 0]}
				errors={errors}
				preventClickOutside
			>
				<div className="filter-container">
					<CreateButton
						text="Filter hinzufügen"
						size="medium"
						onClick={() =>
							setDraftFilters((current) => [
								...current,
								createEmptyFilter()
							])
						}
					/>
					{draftFilters.length === 0 ? (
						<div className="empty-filter-state">
							<p className="empty-filter-text">
								Noch keine Filter vorhanden.
							</p>
						</div>
					) : (
						<div className="filter-select-list">
							{draftFilters.map((filter) => (
								<FilterRow
									key={filter.id}
									filter={filter}
									onChange={updateFilter}
									onDelete={() =>
										setDraftFilters((current) =>
											current.filter(
												(item) => item.id !== filter.id
											)
										)
									}
									userModule={userModule}
									fieldOptions={fieldOptions}
									errors={errors}
								/>
							))}
						</div>
					)}
				</div>
			</SlideIn>
		</>
	);
};

export default EditFilter;

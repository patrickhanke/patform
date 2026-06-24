"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { Select, SlideIn, StatelessToggle, TextInput } from "@repo/ui";
import { ErrorMessage } from "@repo/types";
import {
	FilterFieldDefinition,
	ListFilterItem,
	ListFilterValue
} from "../types";
import { generateUUID } from "../../../functions/generateUUID";
import validateListFilter from "../functions/validateListFilter";

export type AddListFilterSlideInProps = {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
	fieldDefinitions: FilterFieldDefinition[];
	existingFilters: ListFilterItem[];
	onAdd: (filter: ListFilterItem) => void;
	disabled?: boolean;
};

const defaultFormState = {
	key: "",
	value: "" as ListFilterValue | ""
};

const AddListFilterSlideIn: FC<AddListFilterSlideInProps> = ({
	isOpen,
	setIsOpen,
	fieldDefinitions,
	existingFilters,
	onAdd,
	disabled = false
}) => {
	const [form, setForm] = useState(defaultFormState);
	const [errors, setErrors] = useState<ErrorMessage[]>([]);

	const keyOptions = useMemo(
		() =>
			fieldDefinitions.map((definition) => ({
				label: definition.label,
				value: definition.key
			})),
		[fieldDefinitions]
	);

	const selectedDefinition = useMemo(
		() =>
			fieldDefinitions.find((definition) => definition.key === form.key),
		[fieldDefinitions, form.key]
	);

	useEffect(() => {
		setErrors(
			validateListFilter({
				key: form.key,
				value: form.value,
				existingFilters
			})
		);
	}, [form, existingFilters]);

	const reset = () => {
		setForm(defaultFormState);
		setErrors([]);
		setIsOpen(false);
	};

	const handleConfirm = () => {
		if (errors.length > 0) {
			return;
		}

		onAdd({
			key: form.key,
			value: form.value as ListFilterValue,
			id: generateUUID()
		});
		reset();
	};

	return (
		<SlideIn
			header="Filter hinzufügen"
			isOpen={isOpen}
			cancel={reset}
			confirm={handleConfirm}
			errors={errors}
			disabled={[disabled, errors.length > 0 || disabled]}
			confirmText="Hinzufügen"
			preventClickOutside
		>
			<div className="flex col gap-md">
				<Select
					label="Feld"
					id="key"
					options={keyOptions}
					value={
						keyOptions.find(
							(option) => option.value === form.key
						) || null
					}
					errors={errors}
					onChange={(option) => {
						const key = option?.value ? String(option.value) : "";
						const definition = fieldDefinitions.find(
							(field) => field.key === key
						);

						setForm({
							key,
							value:
								definition?.inputType === "boolean" ? false : ""
						});
					}}
					isDisabled={disabled || keyOptions.length === 0}
					width="100%"
				/>

				{selectedDefinition?.inputType === "boolean" && (
					<div className="flex row a-ce j-sb gap-sm">
						<label htmlFor="filter-value">Wert</label>
						<StatelessToggle
							value={
								typeof form.value === "boolean"
									? form.value
									: false
							}
							onChange={(value) =>
								setForm((prev) => ({ ...prev, value }))
							}
							disabled={disabled || !form.key}
						/>
					</div>
				)}

				{selectedDefinition?.inputType === "select" &&
					selectedDefinition.options?.length && (
						<Select
							label="Wert"
							id="value"
							options={selectedDefinition.options}
							value={
								typeof form.value === "string"
									? selectedDefinition.options.find(
											(option) =>
												option.value === form.value
										) || null
									: null
							}
							errors={errors}
							onChange={(option) =>
								setForm((prev) => ({
									...prev,
									value: option?.value
										? String(option.value)
										: ""
								}))
							}
							isDisabled={disabled || !form.key}
							width="100%"
						/>
					)}

				{selectedDefinition?.inputType === "text" && (
					<TextInput
						label="Wert"
						id="value"
						defaultValue={
							typeof form.value === "string" ? form.value : ""
						}
						errors={errors}
						onChange={(value) =>
							setForm((prev) => ({
								...prev,
								value: String(value)
							}))
						}
						disabled={disabled || !form.key}
						placeholder="Wert eingeben..."
					/>
				)}

				{form.key && !selectedDefinition && (
					<p>Kein gültiges Feld ausgewählt.</p>
				)}
			</div>
		</SlideIn>
	);
};

export default AddListFilterSlideIn;

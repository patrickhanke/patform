import { useCallback, useEffect, useState } from "react";
import { AppModuleEditFieldProps } from "../types";
import { CreateButton, InfoBox, Select, StatelessToggle } from "@repo/ui";
import fieldTypes from "../constants/fieldTypes";
import { Field } from "@repo/types";
import { cloneDeep, set } from "lodash-es";
import styles from "../AppModuleEditDataFields.module.scss";

type EditableField = Field & {
	select_options?: { label: string; value: string }[];
	options?: {
		number_start_value?: number;
		number_end_value?: number;
	};
};

const AppModuleEditField = ({ field, onChange }: AppModuleEditFieldProps) => {
	const [localField, setLocalField] = useState<EditableField>(() =>
		cloneDeep(field)
	);

	useEffect(() => {
		onChange(localField);
	}, [localField, onChange]);

	const changeHandler = useCallback((key: string, value: unknown) => {
		setLocalField((current) => {
			const next = cloneDeep(current);
			set(next, key, value);
			return next;
		});
	}, []);

	const selectOptions = localField.select_options || [];

	return (
		<div>
			<h3>
				{typeof localField.label === "string"
					? localField.label
					: "Neues Feld"}
			</h3>
			<div>
				<label>Label</label>
				<input
					type="text"
					defaultValue={
						typeof field.label === "string" ? field.label : ""
					}
					onChange={(e) => changeHandler("label", e.target.value)}
				/>
			</div>
			<div>
				<label>Name</label>
				<input
					type="text"
					defaultValue={field.name}
					onChange={(e) => changeHandler("name", e.target.value)}
				/>
				<InfoBox text="Pfadname des Felds" />
			</div>
			<div>
				<Select
					label="Typ auswählen"
					options={fieldTypes}
					value={localField.type}
					onChange={(e) => changeHandler("type", e.value)}
				/>
			</div>

			<div>
				<label>Pflichfeld</label>
				<StatelessToggle
					value={!!localField.validation?.validate || false}
					onChange={(e) => {
						changeHandler("validation.validate", e);
					}}
				/>
			</div>
			<div>
				<label>Fehlermeldung</label>
				<input
					disabled={!localField.validation?.validate}
					type="text"
					defaultValue={field.validation?.required}
					onChange={(e) =>
						changeHandler("validation.required", e.target.value)
					}
				/>
			</div>
			{localField.type === "select" && (
				<div>
					<label>Optionen</label>
					<CreateButton
						text="Neue Option hinzufügen"
						size="small"
						onClick={() => {
							changeHandler("select_options", [
								...selectOptions,
								{
									label: "",
									value: ""
								}
							]);
						}}
					/>
					<div>
						{selectOptions.map((option, index) => (
							<div
								key={`option-${index}`}
								className={styles.app_module_option_container}
							>
								<div className={styles.app_module_option}>
									<label>Label</label>
									<input
										defaultValue={option.label}
										type="text"
										placeholder="Label"
										onChange={(e) =>
											changeHandler(
												`select_options[${index}].label`,
												e.target.value
											)
										}
									/>
								</div>
								<div className={styles.app_module_option}>
									<label>Wert</label>
									<input
										defaultValue={option.value}
										type="text"
										placeholder="Value"
										onChange={(e) =>
											changeHandler(
												`select_options[${index}].value`,
												e.target.value
											)
										}
									/>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{localField.type === "number" && (
				<div>
					<label>Startwert</label>
					<input
						disabled={!localField.validation?.validate}
						type="number"
						defaultValue={localField.options?.number_start_value}
						onChange={(e) => {
							changeHandler("options", {
								number_start_value: parseInt(e.target.value),
								number_end_value:
									localField.options?.number_end_value
							});
							changeHandler(
								"validation.start_value",
								Number(e.target.value)
							);
						}}
					/>
					<label>Endwert</label>
					<input
						disabled={!localField.validation?.validate}
						type="number"
						defaultValue={localField.options?.number_end_value}
						onChange={(e) => {
							changeHandler("options", {
								number_start_value:
									localField.options?.number_start_value,
								number_end_value: parseInt(e.target.value)
							});
							changeHandler(
								"validation.end_value",
								Number(e.target.value)
							);
						}}
					/>
				</div>
			)}
		</div>
	);
};

export default AppModuleEditField;

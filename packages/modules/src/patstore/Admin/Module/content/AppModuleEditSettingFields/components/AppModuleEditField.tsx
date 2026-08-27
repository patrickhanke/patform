import { useCallback } from "react";
import { AppModuleEditFieldProps } from "../types";
import { CreateButton, InfoBox, Select, StatelessToggle } from "@repo/ui";
import fieldTypes from "../constants/fieldTypes";
import { Field } from "@repo/ui";
import { useDebounceCallback } from "usehooks-ts";
import { cloneDeep, set, get } from "lodash-es";
import "../styles.scss";

const AppModuleEditField = ({ field, setFields }: AppModuleEditFieldProps) => {
	if (!field) {
		return null;
	}

	const fieldChangeHandler = useCallback(
		(key: string, value: Field[keyof Field]) => {
			setFields((draft) => {
				const index: number = draft.findIndex(
					(fieldToFind: Field) => fieldToFind.id === field.id
				);
				const fieldCopy: typeof field = cloneDeep(field);
				if (index !== -1) {
					console.log({ fieldCopy, key, value });

					set(fieldCopy, key, value);
					draft[index] = { ...fieldCopy };
				}
			});
		},
		[field, setFields]
	);

	console.log({ field });

	const changeHandler = useDebounceCallback(fieldChangeHandler, 1000);

	return (
		<div>
			<h3>{field.label}</h3>
			<div>
				<label>Label</label>
				<input
					key={field.label}
					type="text"
					defaultValue={field.label}
					onChange={(e) => changeHandler("label", e.target.value)}
				/>
			</div>
			<div>
				<label>Name</label>
				<input
					key={field.name}
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
					value={field.type}
					onChange={(e) => changeHandler("type", e.value)}
				/>
			</div>

			<div>
				<label>Pflichfeld</label>
				<StatelessToggle
					value={!!field.validation?.validate || false}
					onChange={(e) => {
						changeHandler("validation.validate", e);
					}}
				/>
			</div>
			<div>
				<label>Fehlermeldung</label>
				<input
					disabled={!field.validation?.validate}
					key={field.validation?.required}
					type="text"
					defaultValue={field.validation?.required}
					onChange={(e) =>
						changeHandler("validation.required", e.target.value)
					}
				/>
			</div>
			{field.type === "select" && (
				<div>
					<label>Optionen</label>
					<CreateButton
						text="Neue Option hinzufügen"
						size="small"
						onClick={() => {
							const newOption = {
								label: "",
								value: ""
							};
							changeHandler("select_options", [
								...(field.select_options || []),
								newOption
							]);
						}}
					/>
					<div>
						{field.select_options.map(
							(
								option: { value: string; label: string },
								index: number
							) => (
								<div
									key={option.value}
									className="app_module_option_container"
								>
									<div className="app_module_option">
										<label>Label</label>
										<input
											key={get(
												field,
												`select_options[${index}].label`
											)}
											defaultValue={get(
												field,
												`select_options[${index}].label`,
												""
											)}
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
									<div className="app_module_option">
										<label>Wert</label>
										<input
											key={get(
												field,
												`select_options[${index}].value`
											)}
											defaultValue={get(
												field,
												`select_options[${index}].value`,
												""
											)}
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
							)
						)}
					</div>
				</div>
			)}

			{field.type === "number" && (
				<div>
					<label>Startwert</label>
					<input
						disabled={!field.validation?.validate}
						type="number"
						key={field.options?.number_start_value}
						defaultValue={field.options?.number_start_value}
						onChange={(e) => {
							changeHandler("options", {
								number_start_value: parseInt(e.target.value),
								number_end_value:
									field.options?.number_end_value
							});
							changeHandler(
								"validation.start_value",
								Number(e.target.value)
							);
						}}
					/>
					<label>Endwert</label>
					<input
						disabled={!field.validation?.validate}
						type="number"
						defaultValue={field.options?.number_end_value}
						key={field.options?.number_end_value}
						onChange={(e) => {
							changeHandler("options", {
								number_start_value:
									field.options?.number_start_value,
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

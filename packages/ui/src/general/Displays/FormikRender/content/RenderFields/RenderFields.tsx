import { FC } from "react";
import { FastField, FastFieldProps } from "formik";
import getSelectValue from "./functions/getSelectValue";
import { RenderFieldsType } from "./types";
import "./styles.scss";
import { FileUploader, Select } from "@repo/ui";
import { Field } from "../../types";
import ColorPicker from "./components/ColorPicker";
import ImageUpload from "./components/ImageUpload";
import TextEditor from "./components/TextEditor";
import getPointerValue from "./functions/getPointerValue";
import PersonSelect from "./components/PersonSelect";
import { get } from "lodash-es";
import SelectToggle from "./components/SelectToggle";
import DatePickerField from "./components/DatePickerField";
import { FileSelect } from "./content";

const fieldDisabledHandler = (
	field: Field,
	values: RenderFieldsType["values"]
) => {
	console.log(field);
	if (field.disabled) {
		if (typeof field.disabled === "boolean") {
			return field.disabled;
		}
		return field.disabled(values);
	}
	return false;
};

const RenderFields: FC<RenderFieldsType> = ({
	fields,
	getFieldMeta,
	handleChange,
	values,
	handleBlur,
	setFieldValue,
	isHorizontal,
	setSecondaryContent,
	highlightChanges
}) => (
	<>
		{fields.map((field: Field) => {
			console.log(field);
			return (
				<div
					key={field.id ? field.id : field.name}
					className={isHorizontal ? "form_horizontal_container" : ""}
				>
					<label
						htmlFor={field.name}
						className={
							highlightChanges &&
							getFieldMeta(field.name).initialValue !==
								field.value
								? "highlight"
								: ""
						}
					>
						{field.label || field.name}
						{field?.validation?.validate &&
							field.validation?.required && <span>*</span>}
					</label>
					{(field.type === "input" ||
						field.type === "url" ||
						field.type === "password" ||
						field.type === "number") && (
						<>
							<input
								name={field.name}
								type={
									field.dataType === "number"
										? "number"
										: field.type
								}
								onChange={(e) => {
									setFieldValue(
										field.name,
										e.target.value,
										true
									);
								}}
								value={get(values, field.name, "")}
								onBlur={(e) => handleBlur(e)}
								placeholder={field.placeholder}
								key={field.name}
								min={
									field.type === "number"
										? field?.options?.number_start_value
										: undefined
								}
								max={
									field.type === "number"
										? field?.options?.number_end_value
										: undefined
								}
								disabled={fieldDisabledHandler(field, values)}
								style={{
									width: field?.width
										? field.width
										: "inherit",
									textAlign: field?.textAlign
										? field.textAlign
										: "left"
								}}
							/>
						</>
					)}
					{field.type === "textarea" && (
						<textarea
							name={field.name}
							onChange={(e) => handleChange(e)}
							value={values[field.name] || ""}
							onBlur={(e) => handleBlur(e)}
							placeholder={field.placeholder}
							key={field.name}
							style={{ minWidth: "240px", minHeight: "80px" }}
						/>
					)}
					{field.type === "image" && (
						<div>
							<FastField name={field.name}>
								{({ field: fieldValues }: FastFieldProps) => (
									<ImageUpload
										fieldValues={fieldValues}
										field={field}
										setFieldValue={setFieldValue}
										isHorizontal={isHorizontal}
									/>
								)}
							</FastField>
						</div>
					)}
					{field.type === "file" && (
						<FileUploader
							type={field.type}
							value={values[field.name]}
							returnType={
								field.type === "file" ? "string" : "array"
							}
							onChange={(newValues) =>
								setFieldValue(field.name, newValues, true)
							}
							setSecondaryContent={setSecondaryContent}
						/>
					)}
					{field.type === "toggle" && (
						<FastField name={field.name}>
							{({
								field: fieldValues // { name, value, onChange, onBlur }
								// form: { touched, errors },  also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
								// meta
							}: FastFieldProps) => (
								<SelectToggle
									value={fieldValues.value}
									valueChangeHandler={(value: boolean) =>
										setFieldValue(field.name, value, true)
									}
									disabled={fieldDisabledHandler(
										field,
										values
									)}
									labelBefore={false}
								/>
							)}
						</FastField>
					)}
					{field.type === "select" && (
						<Select
							onChange={(value) =>
								setFieldValue(
									field.name,
									field.dataType === "string"
										? value.value
										: value,
									true
								)
							}
							value={getSelectValue(values, field)}
							options={field.select_options}
							key={field.name}
						/>
					)}
					{field.type === "pointer_select" && (
						<Select
							onChange={(value) =>
								setFieldValue(
									field.name,
									{
										__type: "Pointer",
										className:
											field?.options?.pointer_class,
										objectId: value.value
									},
									true
								)
							}
							value={getPointerValue(
								values[field.name],
								field.select_options || []
							)}
							options={field.select_options}
							key={field.name}
						/>
					)}
					{field.type === "color" && (
						<ColorPicker
							onChange={(value) =>
								setFieldValue(field.name, value, true)
							}
							value={values[field.name]}
							key={field.name}
							label={field.label}
							isOverlay={true}
							isHorizontal={isHorizontal}
						/>
					)}
					{field.type === "texteditor" && (
						<TextEditor
							name={field.name}
							// label={}
							id={field.id}
							onChange={(value) =>
								setFieldValue(field.name, value, true)
							}
							values={values}
							handleBlur={handleBlur}
							placeholder={field.placeholder}
							isHorizontal={isHorizontal}
							setSecondaryContent={setSecondaryContent}
						/>
					)}
					{field.type === "persons_select" && (
						<PersonSelect
							name={field.name}
							label={field.label}
							onChange={(value) =>
								setFieldValue(field.name, value, true)
							}
							values={values}
							placeholder={field.placeholder}
							isHorizontal={isHorizontal}
						/>
					)}
					{(field.type === "download" ||
						field.type === "downloads") && (
						<FileSelect
							name={field.name}
							onChange={(value) =>
								setFieldValue(field.name, value, true)
							}
							values={values}
							setSecondaryContent={setSecondaryContent}
						/>
					)}
					{(field.type === "week" ||
						field.type === "date" ||
						field.type === "month" ||
						field.type === "time" ||
						field.type === "datetime-local" ||
						field.type === "datetime") && (
						<>
							<DatePickerField
								onChange={(value: string) =>
									setFieldValue(field.name, value, true)
								}
								value={values[field.name]}
								type={field.type}
							/>
						</>
					)}
					{!isHorizontal && <br />}
					{getFieldMeta(field.name).touched &&
					getFieldMeta(field.name).error ? (
						<div className={"error_message"}>
							{typeof getFieldMeta(field.name).error ===
								"object" &&
							getFieldMeta(field.name).error !== null
								? Object.keys(
										getFieldMeta(field.name).error
									).map((key) => {
										return (
											<div key={key}>
												{key}:{" "}
												{
													getFieldMeta(field.name)
														.error[key]
												}
											</div>
										);
									})
								: getFieldMeta(field.name).error}
						</div>
					) : null}
				</div>
			);
		})}
	</>
);

export default RenderFields;

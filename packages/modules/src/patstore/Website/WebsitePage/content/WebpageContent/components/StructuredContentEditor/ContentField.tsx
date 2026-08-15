"use client";

import {
	WebpageStructuredFieldSchema,
	WebpageStructuredLinkValue,
	WebpageStructuredSchema
} from "@repo/types";
import { PatstoreSelectImages, TextInput } from "@repo/ui";
import { FC } from "react";
import {
	getCollectionFieldSchema,
	getCollectionItems,
	isFieldNode
} from "../../utils/contentValues";
import ContentFileField from "./ContentFileField";
import ContentRichtextField from "./ContentRichtextField";

type ContentFieldProps = {
	fieldKey: string;
	path: string;
	schema: WebpageStructuredFieldSchema;
	value: unknown;
	onChange: (path: string, value: unknown) => void;
	onCollectionAdd: (path: string, itemSchema: WebpageStructuredSchema) => void;
	onCollectionRemove: (
		path: string,
		itemSchema: WebpageStructuredSchema,
		index: number
	) => void;
	values: Map<string, unknown>;
};

const ContentField: FC<ContentFieldProps> = ({
	path,
	schema,
	value,
	onChange,
	onCollectionAdd,
	onCollectionRemove
}) => {
	switch (schema.type) {
		case "text":
			return (
				<TextInput
					id={path}
					defaultValue={(value as string) || ""}
					onChange={(nextValue) => onChange(path, nextValue)}
				/>
			);
		case "richtext":
			return (
				<ContentRichtextField
					value={(value as string) || ""}
					onChange={(nextValue) => onChange(path, nextValue)}
				/>
			);
		case "image":
			return (
				<PatstoreSelectImages
					image={(value as string) || ""}
					onChange={(nextValue) => onChange(path, nextValue)}
					maxFileCount={1}
				/>
			);
		case "file":
			return (
				<ContentFileField
					value={(value as string) || ""}
					onChange={(nextValue) => onChange(path, nextValue)}
				/>
			);
		case "link": {
			const linkValue = (value as WebpageStructuredLinkValue) || {
				text: "",
				href: ""
			};

			return (
				<div className="structured-content-editor__link-fields">
					<div className="structured-content-editor__subfield-row">
						<label
							className="structured-content-editor__subfield-label"
							htmlFor={`${path}.text`}
						>
							Text
						</label>
						<div className="structured-content-editor__subfield-control">
							<TextInput
								id={`${path}.text`}
								defaultValue={linkValue.text}
								onChange={(nextValue) =>
									onChange(path, {
										...linkValue,
										text: nextValue
									})
								}
							/>
						</div>
					</div>
					<div className="structured-content-editor__subfield-row">
						<label
							className="structured-content-editor__subfield-label"
							htmlFor={`${path}.href`}
						>
							Link
						</label>
						<div className="structured-content-editor__subfield-control">
							<TextInput
								id={`${path}.href`}
								defaultValue={linkValue.href}
								onChange={(nextValue) =>
									onChange(path, {
										...linkValue,
										href: nextValue
									})
								}
							/>
						</div>
					</div>
				</div>
			);
		}
		case "collection": {
			const itemSchema = getCollectionFieldSchema(schema);
			if (!itemSchema) {
				return null;
			}

			const items = getCollectionItems(value);

			const updateItemField = (
				index: number,
				fieldKey: string,
				fieldValue: unknown
			) => {
				const nextItems = items.map((item) => ({ ...item }));
				nextItems[index] = {
					...(nextItems[index] ?? {}),
					[fieldKey]: fieldValue
				};
				onChange(path, nextItems);
			};

			return (
				<div className="structured-content-editor__collection">
					<div className="structured-content-editor__collection-header">
						<h4>{schema.label}</h4>
						<button
							className="full_button sm primary"
							type="button"
							onClick={() => onCollectionAdd(path, itemSchema)}
						>
							Eintrag hinzufügen
						</button>
					</div>
					{items.length === 0 ? (
						<p className="structured-content-editor__empty">
							Noch keine Einträge vorhanden.
						</p>
					) : (
						<div className="structured-content-editor__collection-items">
							{items.map((item, index) => (
								<div
									key={`${path}.${index}`}
									className="structured-content-editor__collection-item"
								>
									<div className="structured-content-editor__collection-item-header">
										<span>Eintrag {index + 1}</span>
										<button
											className="full_button sm"
											type="button"
											onClick={() =>
												onCollectionRemove(
													path,
													itemSchema,
													index
												)
											}
										>
											Entfernen
										</button>
									</div>
									{Object.entries(itemSchema).map(
										([fieldKey, fieldNode]) => {
											if (
												!isFieldNode(fieldNode) ||
												fieldNode.type === "collection"
											) {
												return null;
											}

											const fieldPath = `${path}.${index}.${fieldKey}`;

											return (
												<div
													key={fieldPath}
													className="structured-content-editor__field-row"
												>
													<label
														className="structured-content-editor__field-label"
														htmlFor={fieldPath}
													>
														{fieldNode.label}
													</label>
													<div className="structured-content-editor__field-control">
														<ContentField
															fieldKey={fieldKey}
															path={fieldPath}
															schema={fieldNode}
															value={
																item[fieldKey]
															}
															onChange={(
																_nestedPath,
																nextValue
															) =>
																updateItemField(
																	index,
																	fieldKey,
																	nextValue
																)
															}
															onCollectionAdd={
																onCollectionAdd
															}
															onCollectionRemove={
																onCollectionRemove
															}
															values={new Map()}
														/>
													</div>
												</div>
											);
										}
									)}
								</div>
							))}
						</div>
					)}
				</div>
			);
		}
		default:
			return null;
	}
};

export default ContentField;

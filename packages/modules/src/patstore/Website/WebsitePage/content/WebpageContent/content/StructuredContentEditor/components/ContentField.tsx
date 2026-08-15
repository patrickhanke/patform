"use client";

import { Button, Card, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import {
	WebpageStructuredFieldSchema,
	WebpageStructuredLinkValue,
	WebpageStructuredSchema
} from "@repo/types";
import { IconButton, PatstoreSelectImages, TextInput } from "@repo/ui";
import { FC } from "react";
import {
	getCollectionFieldSchema,
	getCollectionItems,
	isFieldNode
} from "../utils/contentValues";
import ContentFieldRow from "./ContentFieldRow";
import ContentFileField from "./ContentFileField";
import ContentRichtextField from "./ContentRichtextField";

type ContentFieldProps = {
	fieldKey: string;
	path: string;
	schema: WebpageStructuredFieldSchema;
	value: unknown;
	onChange: (path: string, value: unknown) => void;
	onCollectionAdd: (
		path: string,
		itemSchema: WebpageStructuredSchema
	) => void;
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
					width="100%"
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
				<Stack gap={3} w="full">
					<ContentFieldRow
						id={`${path}.text`}
						label="Text"
						labelWidth="80px"
					>
						<TextInput
							id={`${path}.text`}
							defaultValue={linkValue.text}
							onChange={(nextValue) =>
								onChange(path, {
									...linkValue,
									text: nextValue
								})
							}
							width="100%"
						/>
					</ContentFieldRow>
					<ContentFieldRow
						id={`${path}.href`}
						label="Link"
						labelWidth="80px"
					>
						<TextInput
							id={`${path}.href`}
							defaultValue={linkValue.href}
							onChange={(nextValue) =>
								onChange(path, {
									...linkValue,
									href: nextValue
								})
							}
							width="100%"
						/>
					</ContentFieldRow>
				</Stack>
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
				<Stack
					gap={3}
					p={3}
					w="full"
					borderWidth="1px"
					borderStyle="dashed"
					borderColor="border"
					rounded="lg"
				>
					<HStack justify="space-between" gap={3}>
						<Heading as="h4" size="sm" fontWeight="semibold">
							{schema.label}
						</Heading>
						<IconButton
							type="button"
							onClick={() => onCollectionAdd(path, itemSchema)}
							text="Eintrag hinzufügen"
							icon="plus"
						></IconButton>
					</HStack>
					{items.length === 0 ? (
						<Text color="fg.muted" fontSize="sm">
							Noch keine Einträge vorhanden.
						</Text>
					) : (
						<Stack gap={3}>
							{items.map((item, index) => (
								<Card.Root
									key={`${path}.${index}`}
									variant="outline"
									bg="bg"
									rounded="lg"
								>
									<Card.Header pb={3}>
										<HStack justify="space-between">
											<Text fontWeight="semibold">
												Eintrag {index + 1}
											</Text>
											<Button
												type="button"
												size="xs"
												variant="outline"
												onClick={() =>
													onCollectionRemove(
														path,
														itemSchema,
														index
													)
												}
											>
												Entfernen
											</Button>
										</HStack>
									</Card.Header>
									<Card.Body pt={0}>
										<Stack gap={4}>
											{Object.entries(itemSchema).map(
												([fieldKey, fieldNode]) => {
													if (
														!isFieldNode(
															fieldNode
														) ||
														fieldNode.type ===
															"collection"
													) {
														return null;
													}

													const fieldPath = `${path}.${index}.${fieldKey}`;

													return (
														<ContentFieldRow
															key={fieldPath}
															id={fieldPath}
															label={
																fieldNode.label
															}
														>
															<ContentField
																fieldKey={
																	fieldKey
																}
																path={fieldPath}
																schema={
																	fieldNode
																}
																value={
																	item[
																		fieldKey
																	]
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
																values={
																	new Map()
																}
															/>
														</ContentFieldRow>
													);
												}
											)}
										</Stack>
									</Card.Body>
								</Card.Root>
							))}
						</Stack>
					)}
				</Stack>
			);
		}
		default:
			return null;
	}
};

export default ContentField;

"use client";

import { Card, Heading, Stack } from "@chakra-ui/react";
import { WebpageStructuredSchema } from "@repo/types";
import { FC } from "react";
import { isContainerNode, isFieldNode } from "../utils/contentValues";
import ContentField from "./ContentField";
import ContentFieldRow from "./ContentFieldRow";

type ContentSectionProps = {
	schema: WebpageStructuredSchema;
	prefix?: string;
	values: Map<string, unknown>;
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
};

const buildPath = (prefix: string | undefined, key: string) =>
	prefix ? `${prefix}.${key}` : key;

const ContentSection: FC<ContentSectionProps> = ({
	schema,
	prefix = "",
	values,
	onChange,
	onCollectionAdd,
	onCollectionRemove
}) => (
	<Stack gap={prefix ? 4 : 6} w="full">
		{Object.entries(schema).map(([key, node]) => {
			const path = buildPath(prefix, key);

			if (isContainerNode(node)) {
				return (
					<Card.Root
						key={path}
						as="section"
						variant="outline"
						// bg={node.type === "header" ? "bg" : "bg.subtle"}
						rounded="lg"
					>
						<Card.Header pb={3}>
							<Heading as="h3" size="md" fontWeight="semibold">
								{node.label}
							</Heading>
						</Card.Header>
						<Card.Body pt={0}>
							<ContentSection
								schema={node.content}
								prefix={path}
								values={values}
								onChange={onChange}
								onCollectionAdd={onCollectionAdd}
								onCollectionRemove={onCollectionRemove}
							/>
						</Card.Body>
					</Card.Root>
				);
			}

			if (!isFieldNode(node)) {
				return null;
			}

			if (node.type === "collection") {
				return (
					<ContentField
						key={path}
						fieldKey={key}
						path={path}
						schema={node}
						value={values.get(path)}
						onChange={onChange}
						onCollectionAdd={onCollectionAdd}
						onCollectionRemove={onCollectionRemove}
						values={values}
					/>
				);
			}

			return (
				<ContentFieldRow key={path} id={path} label={node.label}>
					<ContentField
						fieldKey={key}
						path={path}
						schema={node}
						value={values.get(path)}
						onChange={onChange}
						onCollectionAdd={onCollectionAdd}
						onCollectionRemove={onCollectionRemove}
						values={values}
					/>
				</ContentFieldRow>
			);
		})}
	</Stack>
);

export default ContentSection;

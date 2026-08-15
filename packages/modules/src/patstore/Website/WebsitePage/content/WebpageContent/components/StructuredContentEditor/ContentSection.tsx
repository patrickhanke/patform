"use client";

import { WebpageStructuredSchema } from "@repo/types";
import { FC } from "react";
import { isContainerNode, isFieldNode } from "../../utils/contentValues";
import ContentField from "./ContentField";

type ContentSectionProps = {
	schema: WebpageStructuredSchema;
	prefix?: string;
	values: Map<string, unknown>;
	onChange: (path: string, value: unknown) => void;
	onCollectionAdd: (path: string, itemSchema: WebpageStructuredSchema) => void;
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
	<>
		{Object.entries(schema).map(([key, node]) => {
			const path = buildPath(prefix, key);

			if (isContainerNode(node)) {
				return (
					<section
						key={path}
						className={`structured-content-editor__group structured-content-editor__group--${node.type}`}
					>
						<h3 className="structured-content-editor__group-title">
							{node.label}
						</h3>
						<div className="structured-content-editor__group-content">
							<ContentSection
								schema={node.content}
								prefix={path}
								values={values}
								onChange={onChange}
								onCollectionAdd={onCollectionAdd}
								onCollectionRemove={onCollectionRemove}
							/>
						</div>
					</section>
				);
			}

			if (!isFieldNode(node)) {
				return null;
			}

			return (
				<div
					key={path}
					className={`structured-content-editor__field-row${
						node.type === "collection"
							? " structured-content-editor__field-row--collection"
							: ""
					}`}
				>
					{node.type !== "collection" && (
						<label
							className="structured-content-editor__field-label"
							htmlFor={path}
						>
							{node.label}
						</label>
					)}
					<div className="structured-content-editor__field-control">
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
					</div>
				</div>
			);
		})}
	</>
);

export default ContentSection;

"use client";

import { Stack } from "@chakra-ui/react";
import { WebpageStructuredNodeMap } from "@repo/types";
import { FC, useCallback, useMemo } from "react";
import {
	addCollectionItem,
	entriesToMap,
	removeCollectionItem,
	serializeValues
} from "../../utils/contentValues";
import ContentSection from "./components/ContentSection";
import { StructuredContentEditorProps } from "./types";

const StructuredContentEditor: FC<StructuredContentEditorProps> = ({
	schema,
	savedValues,
	onSave,
	language
}) => {
	const pathPrefix = language ?? "";
	const valuesMap = useMemo(() => entriesToMap(savedValues), [savedValues]);

	const persistValues = useCallback(
		(nextMap: Map<string, unknown>) => {
			onSave(serializeValues(schema, nextMap, pathPrefix));
		},
		[onSave, pathPrefix, schema]
	);

	const updateValue = useCallback(
		(path: string, value: unknown) => {
			const next = new Map(valuesMap);
			next.set(path, value);
			persistValues(next);
		},
		[valuesMap, persistValues]
	);

	const addCollectionItemHandler = useCallback(
		(path: string, itemSchema: WebpageStructuredNodeMap) => {
			persistValues(addCollectionItem(path, itemSchema, valuesMap));
		},
		[valuesMap, persistValues]
	);

	const removeCollectionItemHandler = useCallback(
		(
			path: string,
			itemSchema: WebpageStructuredNodeMap,
			removeIndex: number
		) => {
			persistValues(
				removeCollectionItem(path, itemSchema, valuesMap, removeIndex)
			);
		},
		[valuesMap, persistValues]
	);

	return (
		<Stack gap={6}>
			<ContentSection
				schema={schema}
				prefix={pathPrefix}
				values={valuesMap}
				onChange={updateValue}
				onCollectionAdd={addCollectionItemHandler}
				onCollectionRemove={removeCollectionItemHandler}
			/>
		</Stack>
	);
};

export default StructuredContentEditor;

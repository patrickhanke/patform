"use client";

import {
	WebpageStructuredSchema,
	WebpageStructuredValueEntry
} from "@repo/types";
import { FormActionBar } from "@repo/ui";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
	addCollectionItem,
	entriesToMap,
	removeCollectionItem,
	serializeValues,
	valuesAreEqual
} from "../../utils/contentValues";
import ContentSection from "./ContentSection";
import "./styles.scss";

type StructuredContentEditorProps = {
	schema: WebpageStructuredSchema;
	savedValues: WebpageStructuredValueEntry[];
	onSave: (values: WebpageStructuredValueEntry[]) => Promise<void>;
};

const createValuesMap = (savedValues: WebpageStructuredValueEntry[]) =>
	entriesToMap(savedValues);

const StructuredContentEditor: FC<StructuredContentEditorProps> = ({
	schema,
	savedValues,
	onSave
}) => {
	const [valuesMap, setValuesMap] = useState(() =>
		createValuesMap(savedValues)
	);
	const [revision, setRevision] = useState(0);
	const [actionBarOpen, setActionBarOpen] = useState(false);
	const [saving, setSaving] = useState(false);

	const serializedValues = useMemo(
		() => serializeValues(schema, valuesMap),
		[schema, valuesMap]
	);

	const isDirty = useMemo(
		() => !valuesAreEqual(serializedValues, savedValues),
		[serializedValues, savedValues]
	);

	useEffect(() => {
		setValuesMap(createValuesMap(savedValues));
		setRevision((current) => current + 1);
	}, [savedValues]);

	useEffect(() => {
		setActionBarOpen(isDirty);
	}, [isDirty]);

	const updateValue = useCallback((path: string, value: unknown) => {
		setValuesMap((current) => {
			const next = new Map(current);
			next.set(path, value);
			return next;
		});
	}, []);

	const addCollectionItemHandler = useCallback(
		(path: string, itemSchema: WebpageStructuredSchema) => {
			setValuesMap((current) =>
				addCollectionItem(path, itemSchema, current)
			);
			setRevision((current) => current + 1);
		},
		[]
	);

	const removeCollectionItemHandler = useCallback(
		(
			path: string,
			itemSchema: WebpageStructuredSchema,
			removeIndex: number
		) => {
			setValuesMap((current) =>
				removeCollectionItem(path, itemSchema, current, removeIndex)
			);
			setRevision((current) => current + 1);
		},
		[]
	);

	const revertHandler = useCallback(() => {
		setValuesMap(createValuesMap(savedValues));
		setRevision((current) => current + 1);
		setActionBarOpen(false);
	}, [savedValues]);

	const saveHandler = useCallback(async () => {
		setSaving(true);
		try {
			await onSave(serializedValues);
			setActionBarOpen(false);
		} finally {
			setSaving(false);
		}
	}, [onSave, serializedValues]);

	return (
		<div className="structured-content-editor">
			<ContentSection
				key={revision}
				schema={schema}
				values={valuesMap}
				onChange={updateValue}
				onCollectionAdd={addCollectionItemHandler}
				onCollectionRemove={removeCollectionItemHandler}
			/>
			<FormActionBar
				open={actionBarOpen}
				setOpen={setActionBarOpen}
				handleSubmit={saveHandler}
				resetForm={revertHandler}
			/>
			{saving && (
				<p className="structured-content-editor__saving">
					Speichern...
				</p>
			)}
		</div>
	);
};

export default StructuredContentEditor;

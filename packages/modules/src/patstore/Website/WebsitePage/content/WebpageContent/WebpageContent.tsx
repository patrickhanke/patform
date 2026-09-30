"use client";

import {
	LanguageValue,
	WebpageClass,
	WebpageStructuredNodeMap,
	WebpageStructuredSchema,
	WebpageStructuredSchemaKey,
	WebpageStructuredValueEntry
} from "@repo/types";
import { usePageData } from "@repo/ui";
import { FC, useCallback, useMemo } from "react";
import { StructuredContentEditor } from "./content";
import { entryMatchesSchemaKey } from "./utils/contentValues";

const isStructuredPageData = (
	pageData: unknown
): pageData is WebpageStructuredValueEntry[] =>
	Array.isArray(pageData) &&
	pageData.every(
		(entry) =>
			entry &&
			typeof entry === "object" &&
			"path" in entry &&
			"value" in entry
	);

const isStructuredSchema = (
	pageContent: unknown
): pageContent is WebpageStructuredSchema =>
	typeof pageContent === "object" &&
	pageContent !== null &&
	!Array.isArray(pageContent);

const isNodeMap = (value: unknown): value is WebpageStructuredNodeMap =>
	typeof value === "object" && value !== null && !Array.isArray(value);

const normalizePageContent = (
	pageContent: WebpageClass["page_content"] | undefined
): WebpageStructuredSchema | undefined => {
	if (!pageContent) {
		return undefined;
	}

	if (typeof pageContent === "string") {
		try {
			const parsed = JSON.parse(pageContent) as unknown;
			return isStructuredSchema(parsed) ? parsed : undefined;
		} catch {
			return undefined;
		}
	}

	return isStructuredSchema(pageContent) ? pageContent : undefined;
};

const normalizePageData = (
	pageData: WebpageClass["page_data"] | undefined
): WebpageStructuredValueEntry[] => {
	if (!pageData || !isStructuredPageData(pageData)) {
		return [];
	}

	return pageData;
};

const WebpageContent: FC<{
	webpage: WebpageClass;
	language?: LanguageValue;
}> = ({ webpage, language }) => {
	const schemaKey: WebpageStructuredSchemaKey = language ?? "default";
	const { data: webpageData, setData } = usePageData<Partial<WebpageClass>>(
		{
			initialData: {
				page_data: webpage.page_data || [],
				page_content: webpage.page_content || {}
			},
			objectId: webpage.objectId
		},
		{
			className: "Webpage",
			updateObject: (data) => data,
			message: "Seiteninhalte wurden aktualisiert"
		}
	);

	const schema = useMemo<WebpageStructuredSchema | undefined>(
		() => normalizePageContent(webpageData?.page_content),
		[webpageData?.page_content]
	);

	const languageSchema = useMemo(() => {
		const slice = schema?.[schemaKey];
		return isNodeMap(slice) ? slice : undefined;
	}, [schema, schemaKey]);

	const savedValues = useMemo(
		() => normalizePageData(webpageData?.page_data),
		[webpageData?.page_data]
	);

	const saveHandler = useCallback(
		(values: WebpageStructuredValueEntry[]) => {
			const current = normalizePageData(webpageData?.page_data);
			const preserved = current.filter(
				(entry) => !entryMatchesSchemaKey(entry.path, schemaKey)
			);
			setData("page_data", [...preserved, ...values]);
		},
		[schemaKey, setData, webpageData?.page_data]
	);

	if (languageSchema === undefined) {
		return (
			<section>
				<p>Keine Seiteninhalte gefunden.</p>
			</section>
		);
	}

	return (
		<StructuredContentEditor
			key={`${webpage.objectId}-${schemaKey}-${webpage.updatedAt}`}
			schema={languageSchema}
			savedValues={savedValues}
			language={language}
			onSave={saveHandler}
		/>
	);
};

export default WebpageContent;

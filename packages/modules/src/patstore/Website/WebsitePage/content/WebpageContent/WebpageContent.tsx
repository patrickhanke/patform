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
import { toLocaleKey } from "@repo/provider";
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

/**
 * Module languages may be short codes (`de`, `en`) or the previous English
 * code `en-EN`. `page_content` is keyed by locale (`de-DE`, `en-GB`) plus `default`.
 */
const resolveSchemaKey = (
	schema: WebpageStructuredSchema | undefined,
	language?: string
): WebpageStructuredSchemaKey | undefined => {
	if (!schema) {
		return undefined;
	}

	const hasMap = (key: string) =>
		isNodeMap(schema[key as WebpageStructuredSchemaKey]);

	if (!language) {
		return hasMap("default") ? "default" : undefined;
	}

	const locale = toLocaleKey(language);
	const candidates =
		locale === "de-DE"
			? ["de-DE", "de"]
			: locale === "en-GB"
				? ["en-GB", "en-EN", "en"]
				: [locale];

	const matchedCandidate = candidates.find((key) => hasMap(key));
	if (matchedCandidate) {
		return matchedCandidate as WebpageStructuredSchemaKey;
	}

	const normalized = locale.toLowerCase();
	const match = Object.keys(schema).find((key) => {
		if (key === "default") {
			return false;
		}
		const lower = key.toLowerCase();
		return lower === normalized || lower.startsWith(`${normalized.slice(0, 2)}-`);
	});

	if (match && hasMap(match)) {
		return match as WebpageStructuredSchemaKey;
	}

	return hasMap("default") ? "default" : undefined;
};

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
	language?: LanguageValue | string;
}> = ({ webpage, language }) => {
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

	const schemaKey = useMemo(
		() => resolveSchemaKey(schema, language),
		[language, schema]
	);

	const languageSchema = useMemo(() => {
		if (!schemaKey) {
			return undefined;
		}
		const slice = schema?.[schemaKey];
		return isNodeMap(slice) ? slice : undefined;
	}, [schema, schemaKey]);

	const savedValues = useMemo(
		() => normalizePageData(webpageData?.page_data),
		[webpageData?.page_data]
	);

	/**
	 * Prefixed paths (`de-DE.home-news.eyebrow`) belong to that locale.
	 * This page stores overrides without a prefix (`home-news.eyebrow`).
	 * Keep that shape until a locale actually has prefixed entries.
	 */
	const valuePrefix =
		schemaKey &&
		schemaKey !== "default" &&
		savedValues.some((entry) => entryMatchesSchemaKey(entry.path, schemaKey))
			? schemaKey
			: "";

	const saveHandler = useCallback(
		(values: WebpageStructuredValueEntry[]) => {
			const current = normalizePageData(webpageData?.page_data);
			const preserved = valuePrefix
				? current.filter(
						(entry) =>
							!schemaKey ||
							!entryMatchesSchemaKey(entry.path, schemaKey)
					)
				: current.filter(
						(entry) =>
							!values.some((value) => value.path === entry.path)
					);
			setData("page_data", [...preserved, ...values]);
		},
		[schemaKey, setData, valuePrefix, webpageData?.page_data]
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
			key={`${webpage.objectId}-${schemaKey}-${valuePrefix}-${webpage.updatedAt}`}
			schema={languageSchema}
			savedValues={savedValues}
			language={valuePrefix || undefined}
			onSave={saveHandler}
		/>
	);
};

export default WebpageContent;

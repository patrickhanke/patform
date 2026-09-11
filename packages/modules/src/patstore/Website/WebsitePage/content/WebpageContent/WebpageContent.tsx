"use client";

import {
	WebpageClass,
	WebpageStructuredSchema,
	WebpageStructuredValueEntry
} from "@repo/types";
import { FC, useCallback, useMemo } from "react";
import { StructuredContentEditor } from "./content";
import { usePageData } from "@repo/ui";

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

const WebpageContent: FC<{ webpage: WebpageClass }> = ({ webpage }) => {
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

	const savedValues = useMemo(
		() => normalizePageData(webpageData?.page_data),
		[webpageData?.page_data]
	);

	const saveHandler = useCallback(
		(values: WebpageStructuredValueEntry[]) => {
			setData("page_data", values);
		},
		[setData]
	);

	if (schema === undefined) {
		return (
			<section>
				<p>Keine Seiteninhalte gefunden.</p>
			</section>
		);
	}
	return (
		<StructuredContentEditor
			key={`${webpage.objectId}-${webpage.updatedAt}`}
			schema={schema}
			savedValues={savedValues}
			onSave={saveHandler}
		/>
	);
};

export default WebpageContent;

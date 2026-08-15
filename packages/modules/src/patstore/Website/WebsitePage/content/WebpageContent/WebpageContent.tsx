"use client";

import { useDataHandler, useGetData } from "@repo/provider";
import {
	WebpageClass,
	WebpageStructuredSchema,
	WebpageStructuredValueEntry
} from "@repo/types";
import { FC, useCallback, useMemo, useState } from "react";
import { StructuredContentEditor } from "./content";

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

const WebpageContent: FC<{ websiteId: string }> = ({ websiteId }) => {
	const { updateData } = useDataHandler();
	const [savedValues, setSavedValues] = useState<
		WebpageStructuredValueEntry[]
	>([]);

	const { data: webpageData, refetch } = useGetData({
		objectName: "Webpage",
		id: websiteId,
		fields: ["page_content", "page_data"]
	});

	const webPage = webpageData as WebpageClass | undefined;

	const schema = useMemo<WebpageStructuredSchema | undefined>(
		() => normalizePageContent(webPage?.page_content),
		[webPage?.page_content]
	);

	const initialSavedValues = useMemo(
		() => normalizePageData(webPage?.page_data),
		[webPage?.page_data]
	);

	const saveHandler = useCallback(
		async (values: WebpageStructuredValueEntry[]) => {
			await updateData({
				className: "Webpage",
				objectId: websiteId,
				updateObject: {
					page_data: values
				}
			});
			setSavedValues(values);
			await refetch();
		},
		[refetch, updateData, websiteId]
	);

	if (!webPage) {
		return null;
	}
	if (schema === undefined) {
		return (
			<section>
				<p>Keine Seiteninhalte gefunden.</p>
			</section>
		);
	}
	return (
		<StructuredContentEditor
			key={`${websiteId}-${webPage.updatedAt}`}
			schema={schema}
			savedValues={
				savedValues.length > 0 ? savedValues : initialSavedValues
			}
			onSave={saveHandler}
		/>
	);
};

export default WebpageContent;

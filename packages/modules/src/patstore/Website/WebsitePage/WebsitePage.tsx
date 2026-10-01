"use client";

import { LanguageValue, PageState, WebpageClass } from "@repo/types";
import { Page } from "@repo/ui";
import { useMemo, useState } from "react";
import { WebpageSettings, WebpageContent } from "./content";
import page_states from "./constants/page_states";
import { languages_short, useFindData } from "@repo/provider";

const WebsitePage = ({
	webpageId,
	moduleId,
	languages = [],
	defaultLanguage
}: {
	webpageId: string;
	moduleId: string;
	languages?: LanguageValue[];
	defaultLanguage: LanguageValue;
}) => {
	const [pageState, setPageState] = useState<PageState>(
		page_states[0] as PageState
	);
	const [activeLang, setActiveLang] =
		useState<LanguageValue>(defaultLanguage);
	const hasMultipleLanguages = languages.length > 1;

	const { data: pageData, refetch } = useFindData<WebpageClass>({
		objectName: "Webpage",
		filters: [
			{
				key: "objectId",
				operator: "equalTo",
				value: webpageId
			}
		],
		fields: [
			"objectId",
			"path",
			"title",
			"subtitle",
			"categories",
			"image",
			"documents",
			"page_content",
			"page_data",
			"active",
			"content"
		],
		skipQuery: !webpageId || !moduleId,
		moduleId: moduleId
	});

	const webpage = pageData?.[0];

	const activeWebpageTitle = useMemo(() => {
		const title = webpage?.title || "";
		const category = pageState.label;
		const language = hasMultipleLanguages
			? languages_short.find((language) => language.value === activeLang)
					?.label || ""
			: "";

		return `${title} - ${category} ${language ? `(${language})` : ""}`;
	}, [activeLang, hasMultipleLanguages, pageState.label, webpage?.title]);

	if (!webpage) {
		return null;
	}

	return (
		<Page
			title={activeWebpageTitle}
			description="Bearbeitung der Inhalte der Webseite"
			pageHeaderButtons={[]}
			pageStates={[...page_states]}
			pageState={pageState}
			setPageState={setPageState}
			languages={languages || []}
			activeLang={activeLang}
			setActiveLang={setActiveLang}
			refetch={refetch}
		>
			{pageState.value === "settings" && (
				<WebpageSettings webpage={webpage} />
			)}
			{pageState.value === "content" && (
				<WebpageContent
					webpage={webpage}
					language={hasMultipleLanguages ? activeLang : undefined}
				/>
			)}
		</Page>
	);
};

export default WebsitePage;

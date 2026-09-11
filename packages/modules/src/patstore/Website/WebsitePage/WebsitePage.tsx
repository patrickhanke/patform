"use client";

import { LanguageValue, PageState, WebpageClass } from "@repo/types";
import { Page } from "@repo/ui";
import { useMemo, useState } from "react";
import { WebpageSettings, WebpageContent } from "./content";
import page_states from "./constants/page_states";
import { languages_short, useFindData } from "@repo/provider";

const WebsitePage = ({
	path,
	moduleId,
	languages,
	defaultLanguage
}: {
	path: string;
	moduleId: string;
	languages: LanguageValue[];
	defaultLanguage: LanguageValue;
}) => {
	const [pageState, setPageState] = useState<PageState>(
		page_states[0] as PageState
	);
	const [activeLang, setActiveLang] =
		useState<LanguageValue>(defaultLanguage);

	const { data: pageData, refetch } = useFindData<WebpageClass>({
		objectName: "Webpage",
		filters: [
			{
				key: "path",
				operator: "equalTo",
				value: path
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
			"lang",
			"page_content",
			"page_data",
			"active",
			"content"
		],
		skipQuery: !path || !moduleId,
		moduleId: moduleId
	});

	console.log(pageData);

	const activeWebpage = useMemo(() => {
		return pageData?.find((page) => page.lang === activeLang);
	}, [pageData, activeLang]);

	console.log(activeLang);
	console.log(activeWebpage);
	const activeWebpageTitle = useMemo(() => {
		const title = activeWebpage?.title || "";
		const category = pageState.label;
		const language =
			languages.length > 1
				? languages_short.find(
						(language) => language.value === activeLang
					)?.label || ""
				: "";

		return `${title} - ${category} ${language ? `(${language})` : ""}`;
	}, [activeWebpage]);

	if (!activeWebpage) {
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
				<WebpageSettings webpage={activeWebpage} />
			)}
			{pageState.value === "content" && (
				<WebpageContent webpage={activeWebpage} />
			)}
		</Page>
	);
};

export default WebsitePage;

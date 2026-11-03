"use client";

import { FC } from "react";
import { PatstoreSelectImages, Select, usePageData } from "@repo/ui";
import { ChampionshipPageModel, ChampionshipTabProps } from "@repo/modules";
import { selectString } from "@repo/provider";

const Media: FC<ChampionshipTabProps> = ({ related }) => {
	const { data: page, setData } = usePageData<ChampionshipPageModel>();
	if (!page) return null;

	const articleIds = new Set(
		related.articles.map((article) => article.objectId)
	);
	const articleId = page.categories.find((id) => articleIds.has(id)) || "";
	const articleOptions = related.articles.map((article) => ({
		value: article.objectId,
		label: article.date
			? `${article.title} - ${new Date(article.date).toLocaleDateString("de-DE")}`
			: article.title
	}));

	return (
		<div className="flex col a-st gap-md">
			<div className="flex col a-st gap-sm">
				<h2>Artikel</h2>
				<Select
					id="championship-article"
					label="Bericht auswählen"
					isClearable
					options={articleOptions}
					value={
						articleOptions.find(
							(option) => option.value === articleId
						) || null
					}
					onChange={(option) => {
						const nextId = selectString(option);
						const rest = page.categories.filter(
							(id) => !articleIds.has(id)
						);
						setData(
							"categories",
							nextId ? [...rest, nextId] : rest
						);
					}}
				/>
			</div>
			<div className="flex col a-st gap-sm">
				<h2>Galerie</h2>
				<PatstoreSelectImages
					image={page.gallery}
					maxFileCount={24}
					onChange={(image) => {
						const value = image as unknown as string | string[];
						setData(
							"gallery",
							Array.isArray(value) ? value : value ? [value] : []
						);
					}}
				/>
			</div>
		</div>
	);
};

export default Media;

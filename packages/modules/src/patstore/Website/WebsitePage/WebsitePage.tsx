"use client";

import { useQuery } from "@apollo/client";
import {
	generateGraphQLQuery_4_1,
	PatstoreAppContext,
	useDataHandler
} from "@repo/provider";
import { WebpageClass, WebpageContent } from "@repo/types";
import {
	CreateButton,
	Divider,
	DnDDisplay,
	InfoBox,
	Page,
	PatstoreSelectImages,
	sortItemsByPosition,
	TextInput
} from "@repo/ui";
import { useEffect, useState, useContext, useCallback } from "react";
import initial_content_element from "./constants/initial_content_element";
import { v4 } from "uuid";
import { cloneDeep } from "lodash-es";
import { EditContentField } from "./content/EditContentField";
import "./styles.scss";
import WebsitePageCategories from "./components/WebsitePageCategories";
import WebsitePageDocuments from "./components/WebsitePageDocuments";

const WebsitePage = ({ params }: { params: { webpage_id: string } }) => {
	const websiteId = params.webpage_id;

	const { updateData } = useDataHandler();
	const { user, currentModule } = useContext(PatstoreAppContext);

	const { data: pageData, refetch } = useQuery(
		generateGraphQLQuery_4_1({
			type: "get",
			objectName: "Webpage",
			queryName: "webpage",
			fields: [
				"objectId",
				"path",
				"data",
				"title",
				"subtitle",
				"categories",
				"image",
				"documents"
			]
		}),
		{ variables: { id: websiteId } }
	);

	const [content, setContent] = useState<WebpageContent[]>([]);

	useEffect(() => {
		if (pageData) {
			setContent(pageData.objects.getWebpage.data);
		}
	}, [pageData]);

	const removeContentHandler = useCallback(
		async (contentId: string) => {
			await updateData({
				className: "Webpage",
				objectId: websiteId,
				updateObject: {
					data: content.filter((item) => item.id !== contentId)
				}
			});
			await refetch();
		},
		[content, refetch, updateData, websiteId]
	);

	if (!pageData) {
		return null;
	}

	const webPage: WebpageClass = pageData.objects.getWebpage;

	return (
		<Page
			title={`${webPage.title} - Inhalte`}
			description="Bearbeitung der Webseiten Inhalte"
			pageHeaderButtons={[]}
		>
			<div className="flex row a-fs j-sb gap-sm w-100">
				<div className="w-66">
					<CreateButton
						text="Inhaltselement hinzufügen"
						size="small"
						onClick={async () => {
							const contentCopy = cloneDeep(content);
							contentCopy.push({
								...initial_content_element,
								position: contentCopy.length + 1,
								id: v4() as string
							});

							await updateData({
								className: "Webpage",
								objectId: websiteId,
								updateObject: {
									data: contentCopy
								}
							});
							await refetch();
							return setContent(contentCopy);
						}}
					/>
					<DnDDisplay<WebpageContent[]>
						key={JSON.stringify(content)}
						items={
							(sortItemsByPosition(
								content
							) as WebpageContent[]) || []
						}
						ItemComponent={({ item, id }) => (
							<EditContentField
								initialField={item as WebpageContent}
								content={content}
								pageId={websiteId}
								refetch={refetch}
								key={id}
								removeContentHandler={removeContentHandler}
							/>
						)}
						onChange={(items) => {
							updateData({
								className: "Webpage",
								objectId: websiteId,
								updateObject: {
									content: items.map((item, index) => ({
										...item,
										position: index + 1
									}))
								}
							});
							refetch();
						}}
						// subField={{ id: moduleId, field: "categories" }}
					/>
				</div>
				<div className="head_container flex col a-st j-sb gap-sm w-33">
					<h3>Inhalte</h3>
					<div>
						<label>Pfad der Seite</label>
						<TextInput
							id="name"
							width={"100%"}
							type="text"
							defaultValue={webPage.path}
							onChange={async (value) => {
								await updateData({
									className: "Webpage",
									objectId: websiteId,
									updateObject: {
										path: value
									}
								});
								await refetch();
							}}
							disabled={!user?.is_superuser}
							placeholder="Name der Seite"
						/>
						<InfoBox text="Änderungen am Pfad können dazu führen, dass die Inhalte auf der Webseite nicht mehr angezeigt werden." />
						<Divider size="small" />
						<label>Titel der Seite</label>
						<TextInput
							id="text"
							width={"100%"}
							type="text"
							defaultValue={webPage.title}
							onChange={async (value) => {
								await updateData({
									className: "Webpage",
									objectId: websiteId,
									updateObject: {
										title: value
									}
								});
								await refetch();
							}}
							placeholder="Titel der Seite"
						/>
					</div>
					<Divider size="small" />
					<div>
						<label>Untertitel der Seite</label>
						<TextInput
							id="name"
							width={"100%"}
							type="textarea"
							isTextArea
							defaultValue={webPage.subtitle}
							onChange={async (value) => {
								await updateData({
									className: "Webpage",
									objectId: websiteId,
									updateObject: {
										subtitle: value
									}
								});
								await refetch();
							}}
							placeholder="Untertitel der Seite"
						/>
					</div>
					<Divider size="small" />
					<div>
						<label>Titelbild</label>
						<PatstoreSelectImages
							image={webPage.image}
							onChange={async (value) => {
								await updateData({
									className: "Webpage",
									objectId: websiteId,
									updateObject: {
										image: value
									}
								});
								await refetch();
							}}
							maxFileCount={1}
						/>
					</div>
					<Divider size="small" />
					<div>
						<label>Dokumente</label>
						<WebsitePageDocuments
							documents={webPage.documents}
							onChange={async (value) => {
								await updateData({
									className: "Webpage",
									objectId: websiteId,
									updateObject: {
										documents: value
									}
								});
								await refetch();
							}}
							isEditable
						/>
					</div>
					<Divider size="small" />
					<div>
						<h3>Kategorien</h3>
						<div className="flex col gap-sm">
							{pageData &&
								currentModule.categories.length > 0 &&
								currentModule.categories.map(
									(moduleCategory) => (
										<WebsitePageCategories
											key={moduleCategory.id}
											categories={webPage.categories}
											category={moduleCategory}
											isEditable
											onChange={async (categories) => {
												await updateData({
													className: "Webpage",
													objectId: websiteId,
													updateObject: {
														categories: categories
													}
												});
												await refetch();
											}}
										/>
									)
								)}
						</div>
					</div>
				</div>
			</div>
		</Page>
	);
};

export default WebsitePage;

"use client";

import { PatstoreAppContext, useDataHandler, useGetData } from "@repo/provider";
import { Field, WebpageClass } from "@repo/types";
import { Form } from "@repo/ui";
import { FormikValues } from "formik";
import { FC, useCallback, useContext, useMemo } from "react";
import WebsitePageCategories from "../../components/WebsitePageCategories";

type WebpageSettingsProps = {
	websiteId: string;
};

const WebpageSettings: FC<WebpageSettingsProps> = ({ websiteId }) => {
	const { updateData } = useDataHandler();
	const { user, currentModule } = useContext(PatstoreAppContext);

	const { data: pageData, refetch } = useGetData({
		objectName: "Webpage",
		id: websiteId,
		fields: [
			"objectId",
			"path",
			"title",
			"subtitle",
			"categories",
			"image",
			"documents"
		]
	});

	const fields = useMemo(
		() =>
			[
				{
					id: "path",
					name: "path",
					label: "Pfad der Seite",
					type: "input",
					placeholder: "Name der Seite",
					disabled: !user?.is_superuser,
					description:
						"Änderungen am Pfad können dazu führen, dass die Inhalte auf der Webseite nicht mehr angezeigt werden."
				},
				{
					id: "title",
					name: "title",
					label: "Titel der Seite",
					type: "input",
					placeholder: "Titel der Seite"
				},
				{
					id: "subtitle",
					name: "subtitle",
					label: "Untertitel der Seite",
					type: "textarea",
					placeholder: "Untertitel der Seite"
				},
				{
					id: "image",
					name: "image",
					label: "Titelbild",
					type: "image_select",
					options: {
						return_type: "string",
						max_file_count: 1
					}
				},
				{
					id: "documents",
					name: "documents",
					label: "Dokumente",
					type: "downloads"
				}
			] as Field[],
		[user?.is_superuser]
	);

	const webPage = pageData as WebpageClass | undefined;

	const formData = useMemo(
		() =>
			webPage
				? {
						path: webPage.path,
						title: webPage.title,
						subtitle: webPage.subtitle,
						image: webPage.image,
						documents: webPage.documents
					}
				: undefined,
		[webPage]
	);

	const formSubmitHandler = useCallback(
		async (values: FormikValues) => {
			await updateData({
				className: "Webpage",
				objectId: websiteId,
				updateObject: values
			});
			await refetch();
		},
		[refetch, updateData, websiteId]
	);

	if (!webPage || !formData) {
		return null;
	}

	return (
		<>
			<Form
				fields={fields}
				data={formData}
				formSubmitHandler={formSubmitHandler}
				showRequired={false}
			/>
			{currentModule.categories.length > 0 && (
				<div>
					<h3>Kategorien</h3>
					<div className="flex col gap-sm">
						{currentModule.categories.map((moduleCategory) => (
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
						))}
					</div>
				</div>
			)}
		</>
	);
};

export default WebpageSettings;

"use client";

import { PatstoreAppContext } from "@repo/provider";
import { Field, WebpageClass } from "@repo/types";
import { Form, usePageData } from "@repo/ui";
import { FC, useContext, useMemo } from "react";
import WebsitePageCategories from "../../components/WebsitePageCategories";

type WebpageSettingsProps = {
	webpage: WebpageClass;
};

const WebpageSettings: FC<WebpageSettingsProps> = ({ webpage }) => {
	const { user, currentModule } = useContext(PatstoreAppContext);
	const { data, setData } = usePageData(
		{
			initialData: {
				path: webpage.path,
				title: webpage.title,
				image: webpage.image,
				documents: webpage.documents,
				categories: webpage.categories
			},
			objectId: webpage.objectId
		},
		{
			className: "Webpage",
			updateObject: (data) => data,
			message: "Einstellungen der Seite wurden aktualisiert"
		}
	);

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

	return (
		<>
			<Form
				fields={fields}
				data={data ?? undefined}
				formSubmitHandler={(formData) => {
					Object.keys(formData).forEach((key) => {
						setData(key, formData[key]);
					});
				}}
				useWithDebounce
				enableReinitialize
				showRequired={false}
			/>
			{currentModule.categories.length > 0 && (
				<div>
					<h3>Kategorien</h3>
					<div className="flex col gap-sm">
						{currentModule.categories.map((moduleCategory) => (
							<WebsitePageCategories
								key={moduleCategory.id}
								categories={data?.categories || []}
								category={moduleCategory}
								isEditable
								onChange={async (categories) => {
									setData("categories", categories);
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

import { useQuery } from "@apollo/client";
import { generateGraphQLQuery, useDataHandler } from "@repo/provider";
import { PatstoreUser, WebpageContent } from "@repo/types";
import {
	CreateButton,
	Divider,
	DnDDisplay,
	sortItemsByPosition,
	TextInput
} from "@repo/ui";
import { useEffect, useState } from "react";
import initial_content_element from "./constants/initial_content_element";
import { v4 } from "uuid";
import { cloneDeep } from "lodash-es";
import { EditContentField } from "./content/EditContentField";
import "./styles.scss";
const Page = ({
	websiteId,
	user
}: {
	websiteId: string;
	user: PatstoreUser;
}) => {
	const { updateData } = useDataHandler();

	const { data: pageData, refetch } = useQuery(
		generateGraphQLQuery({
			type: "get",
			objectName: "Webpage",
			fields: ["objectId", "name", "content", "title", "subtitle"]
		}),
		{ variables: { id: websiteId } }
	);

	const [content, setContent] = useState<WebpageContent[]>([]);

	useEffect(() => {
		if (pageData) {
			console.log("udcontent");

			setContent(pageData.objects.getWebpage.content);
		}
	}, [pageData]);

	return (
		<div>
			<h3>Inhalte</h3>
			<div className="head_container flex row al-fs j-sb gap-sm w-100">
				<div className="w-50">
					<label>Titel der Seite</label>
					<TextInput
						id="text"
						width={"240px"}
						type="text"
						defaultValue={pageData?.objects.getWebpage.title}
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
					<label>Name der Seite</label>
					<TextInput
						id="name"
						width={"240px"}
						type="text"
						defaultValue={pageData?.objects.getWebpage.name}
						onChange={async (value) => {
							await updateData({
								className: "Webpage",
								objectId: websiteId,
								updateObject: {
									name: value
								}
							});
							await refetch();
						}}
						disabled={!user?.is_superuser}
						placeholder="Name der Seite"
					/>
				</div>
				<div className="w-50">
					<label>Untertitel der Seite</label>
					<TextInput
						id="name"
						width={"360px"}
						type="textarea"
						isTextArea
						defaultValue={pageData?.objects.getWebpage.subtitle}
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
			</div>
			<Divider size="medium" showLine />
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
							content: contentCopy
						}
					});
					await refetch();
					return setContent(contentCopy);
				}}
			/>
			<DnDDisplay<WebpageContent[]>
				key={JSON.stringify(content)}
				items={(sortItemsByPosition(content) as WebpageContent[]) || []}
				ItemComponent={({ item, id }) => (
					<EditContentField
						initialField={item as WebpageContent}
						content={content}
						pageId={websiteId}
						refetch={refetch}
						key={id}
					/>
				)}
				objectClass="Module"
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
	);
};

export default Page;

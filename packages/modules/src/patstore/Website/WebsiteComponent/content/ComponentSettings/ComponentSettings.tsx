"use client";

import { PatstoreAppContext } from "@repo/provider";
import { Field } from "@repo/types";
import { Form } from "@repo/ui";
import { FC, useContext, useMemo } from "react";
import { usePageData } from "@repo/ui";

type ComponentSettingsProps = {
	objectId: string;
	contentId: string;
	title: string;
	active: boolean;
	type: string;
};

type ComponentSettingsData = {
	title: string;
	content_id: string;
	active: boolean;
};

const ComponentSettings: FC<ComponentSettingsProps> = ({
	objectId,
	contentId,
	title,
	active
}) => {
	const { data, setData } = usePageData<ComponentSettingsData>(
		{ initialData: { title, content_id: contentId, active }, objectId },
		{
			className: "Content",
			updateObject: (data) => ({
				title: data.title,
				content_id: data.content_id,
				active: data.active
			}),
			message: "Einstellungen gespeichert"
		}
	);
	const { user } = useContext(PatstoreAppContext);

	const fields = useMemo(
		() =>
			[
				{
					id: "title",
					name: "title",
					label: "Titel (Interner Titel)",
					type: "input",
					placeholder: "Titel"
				},
				{
					id: "content_id",
					name: "content_id",
					label: "Inhalt",
					type: "input",
					placeholder: "ID",
					disabled: user.is_superuser ? false : true
				},
				{
					id: "active",
					name: "active",
					label: "Aktiv",
					type: "toggle",
					placeholder: "Aktiv"
				}
			] as Field[],
		[user?.is_superuser]
	);

	return (
		<div className="content_element">
			<Form
				fields={fields}
				data={data ?? undefined}
				formSubmitHandler={(value) => {
					console.log(value);
					if (typeof value === "object") {
						Object.entries(value).forEach(([key, value]) => {
							setData(key, value);
						});
					}
				}}
				showRequired={false}
				isHorizontal={true}
				useWithDebounce
			/>
		</div>
	);
};

export default ComponentSettings;

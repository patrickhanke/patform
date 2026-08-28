import { Divider, Editor, usePageData } from "@repo/ui";
import { FC } from "react";
import { WebpageComponentText } from "@repo/types";
import { EditTextProps } from "./types";

const createInitialTextData = (
	initialData?: EditTextProps["initialData"]
): WebpageComponentText => {
	if (
		initialData &&
		typeof initialData === "object" &&
		"html" in initialData &&
		typeof initialData.html === "string"
	) {
		return { html: initialData.html };
	}

	return { html: "" };
};

const EditText: FC<EditTextProps> = ({ initialData, objectId }) => {
	const { data: text, setData } = usePageData<WebpageComponentText>(
		{ initialData: createInitialTextData(initialData), objectId },
		{
			className: "Content",
			updateObject: (data) => ({ data }),
			message: "Inhalt gespeichert"
		}
	);

	if (!text) return null;

	return (
		<div className="content_element">
			<h3>Text</h3>
			<Divider size="medium" showLine={false} />
			<Editor
				content={text.html}
				onChange={(value) => setData("html", value)}
				placeholder="Text eingeben…"
			/>
		</div>
	);
};

export default EditText;

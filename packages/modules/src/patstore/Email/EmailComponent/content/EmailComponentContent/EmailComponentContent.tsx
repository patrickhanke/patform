import { ContentEditor } from "@repo/ui";
import { FC } from "react";
import { usePageData } from "@repo/ui";
import { EmailContentComponent } from "@repo/types";

const EmailComponentContent: FC<{
	contentId: string;
	contentData: EmailContentComponent;
}> = ({ contentId, contentData }) => {
	const { data, setData } = usePageData<EmailContentComponent>(
		{
			initialData: {
				content: contentData?.content || []
			},
			objectId: contentId
		},
		{
			className: "Content",
			updateObject: (content) => ({ data: content }),
			message: "Inhalt wurde aktualisiert"
		}
	);

	return (
		<div>
			<ContentEditor
				content={data?.content || []}
				onChange={(content) => setData("content", content)}
			/>
		</div>
	);
};

export default EmailComponentContent;

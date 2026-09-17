"use client";

import { ContentPreview, Page, PageHeaderButton } from "@repo/ui";
import { ContentClass, EmailContentComponent } from "@repo/types";
import { useAppContext, useGetData } from "@repo/provider";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import siteStates from "./constants/siteStates";
import { EmailComponentContent, EmailComponentSettings } from "./content";

const EmailComponent = () => {
	const { template_id: contentId } = useParams<{ template_id: string }>();
	const [siteState, setSiteState] = useState<(typeof siteStates)[number]>(
		siteStates[0] as { value: string; label: string }
	);
	const [previewOpen, setPreviewOpen] = useState(false);

	const {
		data: content,
		refetch,
		loading
	} = useGetData<ContentClass>({
		objectName: "Content",
		fields: [
			"objectId",
			"active",
			"createdAt",
			"updatedAt",
			"title",
			"data"
		],
		id: contentId
	});

	const pageHeaderButtons: PageHeaderButton[] = useMemo(() => {
		if (siteState.value === "content") {
			return [
				{
					text: "Vorschau anzeigen",
					onClick: () => {
						setPreviewOpen(true);
					},
					icon: "save",
					disabled: loading
				}
			];
		}

		return [];
	}, [siteState, loading]);

	return (
		<Page
			title={content ? content?.title : "Lädt ..."}
			description="Hier können Komponenten erstellt werden, die in E-Mails verwendet werden können."
			emptyContent={true}
			pageStates={siteStates}
			pageState={siteState}
			setPageState={setSiteState}
			refetch={refetch}
			pageHeaderButtons={pageHeaderButtons}
		>
			{siteState.value === "overview" && (
				<EmailComponentSettings
					componentId={contentId}
					active={content?.active || false}
					title={content?.title || ""}
				/>
			)}

			{siteState.value === "content" && (
				<EmailComponentContent
					contentId={contentId}
					contentData={content?.data as EmailContentComponent}
				/>
			)}
			<ContentPreview
				content={content?.data?.content || []}
				isOpen={previewOpen}
				setIsOpen={setPreviewOpen}
			/>
		</Page>
	);
};

export default EmailComponent;

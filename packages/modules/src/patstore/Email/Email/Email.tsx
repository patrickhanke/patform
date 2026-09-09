"use client";

import siteStates from "./constants/siteStates";
import { ContentPreview, Page, PageHeaderButton } from "@repo/ui";
import { useMemo, useState } from "react";
import { useAppContext, useGetData } from "@repo/provider";
import TestEmail from "./components/TestEmail";
import BulkEmailSender from "./components/BulkEmailSender";
import RecipientEmailSender from "./components/RecipientEmailSender";
import {
	EmailContent,
	EmailAttachments,
	EmailRecipients,
	EmailSettings,
	EmailOverview
} from "./content";
import EmailImport from "./components/EmailImport";
import useEmailRecipients from "./hooks/useEmailRecipients";
import { useParams } from "next/navigation";
import { resolveRecipientListId } from "./functions/resolveRecipientListId";
import { EmailTemplate } from "@repo/types";

const Email = () => {
	const { email_id: emailId } = useParams<{ email_id: string }>();
	const { project } = useAppContext();

	const {
		data: email,
		refetch,
		loading
	} = useGetData<EmailTemplate>({
		objectName: "Email",
		fields: [
			"objectId",
			"date",
			"createdAt",
			"updatedAt",
			"title",
			"description",
			"fields",
			"categories",
			"settings",
			"state",
			"content",
			"attachments",
			"recipients",
			"settings",
			"sendAt"
		],
		id: emailId
	});

	const recipientListId = useMemo(
		() => resolveRecipientListId(email?.settings?.recipient_list),
		[email]
	);

	const {
		recipients,
		suppressedRecipients,
		loading: recipientsLoading
	} = useEmailRecipients(recipientListId);

	const [siteState, setSiteState] = useState<(typeof siteStates)[number]>(
		siteStates[0] as { value: string; label: string }
	);
	const [previewOpen, setPreviewOpen] = useState<boolean>(false);
	const [testEmailOpen, setTestEmailOpen] = useState<boolean>(false);
	const [bulkEmailOpen, setBulkEmailOpen] = useState<boolean>(false);
	const [recipientEmailOpen, setRecipientEmailOpen] =
		useState<boolean>(false);
	const [importModalOpen, setImportModalOpen] = useState<boolean>(false);

	const emailContent = useMemo(() => {
		return email?.content || [];
	}, [email]);

	const pageHeaderButtons: PageHeaderButton[] = useMemo(() => {
		if (siteState.value === "overview") {
			return [
				{
					text: "E-Mail an Empfänger versenden",
					onClick: () => {
						setRecipientEmailOpen(true);
					},
					disabled:
						loading ||
						recipientsLoading ||
						email?.state !== "draft" ||
						!email.settings.recipient_list ||
						email?.content?.length === 0
				},
				{
					text: "E-Mail an Liste versenden",
					onClick: () => {
						setBulkEmailOpen(true);
					},
					disabled:
						loading ||
						recipientsLoading ||
						email?.state !== "draft" ||
						!email.settings.recipient_list ||
						email?.content?.length === 0
				}
			];
		}
		if (siteState.value === "content") {
			return [
				{
					text: "Importieren",
					onClick: () => {
						setImportModalOpen(true);
					},
					icon: "save",
					disabled: loading
				},
				{
					text: "Test E-Mail senden",
					onClick: () => {
						setTestEmailOpen(true);
					},
					icon: "save",
					disabled: loading
				},
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
	}, [siteState, email, emailContent, loading, recipientsLoading]);

	if (!email) {
		return <div>Lädt ...</div>;
	}

	return (
		<Page
			title={email ? email?.title : "Lädt ..."}
			emptyContent={true}
			refetch={refetch}
			pageStates={siteStates}
			pageState={siteState}
			setPageState={setSiteState}
			pageHeaderButtons={pageHeaderButtons}
		>
			{!email ? (
				<p>E-Mail nicht gefunden</p>
			) : (
				<>
					{siteState.value === "overview" && (
						<div className="flex col a-st gap-sm">
							<EmailOverview email={email} />
							<EmailSettings
								email={email}
								recipients={recipients}
								suppressedRecipients={suppressedRecipients}
								settings={email?.settings}
								recipientsLoading={recipientsLoading}
							/>
						</div>
					)}
					{siteState.value === "recipients" && (
						<EmailRecipients emailTemplateId={email.objectId} />
					)}
					{siteState.value === "content" && (
						<EmailContent
							emailId={emailId}
							emailContent={emailContent}
							refetch={refetch}
						/>
					)}
					{siteState.value === "attachments" && (
						<EmailAttachments
							emailId={emailId}
							refetchEmail={refetch}
						/>
					)}
				</>
			)}

			<ContentPreview
				content={emailContent}
				isOpen={previewOpen}
				setIsOpen={setPreviewOpen}
			/>
			<TestEmail
				testEmail={testEmailOpen}
				setTestEmail={setTestEmailOpen}
				emailContent={emailContent}
				listId={recipientListId}
			/>
			<BulkEmailSender
				isOpen={bulkEmailOpen}
				setIsOpen={setBulkEmailOpen}
				emailContent={emailContent}
				emailId={emailId}
				recipients={recipients}
				onSendSuccess={async () => {
					await refetch();
				}}
			/>
			<RecipientEmailSender
				recipientEmailOpen={recipientEmailOpen}
				setRecipientOpen={setRecipientEmailOpen}
				emailContent={emailContent}
				emailId={emailId}
			/>

			<EmailImport
				emailId={emailId}
				projectId={project.objectId}
				importModalOpen={importModalOpen}
				setImportModalOpen={setImportModalOpen}
				refetch={refetch}
			/>
		</Page>
	);
};

export default Email;

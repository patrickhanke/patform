"use client";

import siteStates from "./constants/siteStates";
import {
	ContentBlock,
	ContentPreview,
	Modal,
	Page,
	PageHeaderButton
} from "@repo/ui";
import { useEffect, useMemo, useState } from "react";
import { Params } from "@repo/types";
import { useAppContext, useDataHandler, useGetData } from "@repo/provider";
import TestEmail from "./components/TestEmail";
import BulkEmailSender from "./components/BulkEmailSender";
import RecipientEmailSender from "./components/RecipientEmailSender";
import {
	EmailContent,
	EmailData,
	EmailAttachments,
	EmailRecipients,
	EmailSettings,
	EmailOverview
} from "./content";
import { isEqual } from "lodash-es";
import EmailImport from "./components/EmailImport";

const Email = ({ params }: { params: Params }) => {
	const { deleteData } = useDataHandler();
	const { project } = useAppContext();
	const emailId = params.email_id;

	const { data: email, refetch } = useGetData({
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
			"settings"
		],
		id: emailId
	});
	const [siteState, setSiteState] = useState<(typeof siteStates)[number]>(
		siteStates[0] as { value: string; label: string }
	);
	const [selectedDataRows, setSelectedDataRows] = useState<string[]>([]);
	const [dataDeleteModal, setDataDeleteModal] = useState<boolean>(false);
	const [loading, setLoading] = useState(false);
	const { updateData } = useDataHandler();
	const [emailContent, setEmailContent] = useState<ContentBlock[]>(
		email?.content || []
	);
	const [previewOpen, setPreviewOpen] = useState<boolean>(false);
	const [testEmailOpen, setTestEmailOpen] = useState<boolean>(false);
	const [bulkEmailOpen, setBulkEmailOpen] = useState<boolean>(false);
	const [recipientEmailOpen, setRecipientEmailOpen] =
		useState<boolean>(false);
	const [importModalOpen, setImportModalOpen] = useState<boolean>(false);
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
						email?.state !== "draft" ||
						email?.recipients?.length === 0 ||
						email?.content?.length === 0
				},
				{
					text: "E-Mail an Liste versenden",
					onClick: () => {
						setBulkEmailOpen(true);
					},
					disabled:
						loading ||
						email?.state !== "draft" ||
						email?.recipients?.length === 0 ||
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
				},
				{
					text: "Inhalte speichern",
					onClick: async () => {
						await updateData({
							className: "Email",
							objectId: emailId,
							updateObject: {
								content: emailContent
							},
							feedback: "Inhalte erfolgreich aktualisiert"
						});
						await refetch();
					},
					icon: "save",
					disabled:
						isEqual(emailContent, email?.content || []) || loading
				}
			];
		}

		return [];
	}, [siteState, selectedDataRows, email, emailContent, loading, project]);

	useEffect(() => {
		if (email && emailContent?.length === 0) {
			setEmailContent(email.content);
		}
	}, [email]);

	console.log("email", email);

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
						<EmailOverview email={email} />
					)}
					{siteState.value === "data" && (
						<EmailData
							emailId={emailId}
							selectedDataRows={selectedDataRows}
							setSelectedDataRows={setSelectedDataRows}
						/>
					)}
					{siteState.value === "recipients" && (
						<EmailRecipients email={email} />
					)}
					{siteState.value === "content" && (
						<EmailContent
							emailContent={emailContent}
							setEmailContent={setEmailContent}
						/>
					)}
					{siteState.value === "attachments" && (
						<EmailAttachments emailId={emailId} email={email} />
					)}
					{siteState.value === "settings" && (
						<EmailSettings emailId={emailId} />
					)}
				</>
			)}
			<Modal
				isOpen={dataDeleteModal}
				cancelButtonHandler={() => setDataDeleteModal(false)}
				buttonDisabled={[loading, loading]}
				confirmButtonHandler={async () => {
					setLoading(true);
					await Promise.all(
						selectedDataRows.map(async (objectId) => {
							await deleteData({
								className: "Data",
								objectId
							});
						})
					);
					await refetch();
					setLoading(false);
					setDataDeleteModal(false);
				}}
				header={"Datensätze löschen"}
			>
				<p>
					Sind sich Sicher, dass sie die Datensätze löschen möchten?
				</p>
			</Modal>
			<ContentPreview
				content={emailContent}
				isOpen={previewOpen}
				setIsOpen={setPreviewOpen}
			/>
			<TestEmail
				testEmail={testEmailOpen}
				setTestEmail={setTestEmailOpen}
				emailContent={emailContent}
				listId={email?.settings?.recipient_list}
			/>
			<BulkEmailSender
				isOpen={bulkEmailOpen}
				setIsOpen={setBulkEmailOpen}
				emailContent={emailContent}
				emailId={emailId}
				listId={email?.settings?.recipient_list}
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

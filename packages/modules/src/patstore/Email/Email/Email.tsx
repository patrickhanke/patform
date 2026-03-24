"use client";

import siteStates from "./constants/siteStates";
import {
	ContentBlock,
	ContentPreview,
	Modal,
	Page,
	PageHeaderButton
} from "@repo/ui";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Params } from "@repo/types";
import {
	useAppContext,
	useDataHandler,
	useGetData,
	axiosclient
} from "@repo/provider";
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
import { EmailRecipient, EmailRescipientResponse } from "./types";
import { AxiosResponse } from "axios";

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
	const [recipients, setRecipients] = useState<EmailRecipient[]>([]);
	const [suppressedRecipients, setSuppressedRecipients] = useState<
		EmailRecipient[]
	>([]);

	const findRecipients = useCallback(async () => {
		if (!email) return;
		if (!email.settings?.recipient_list) return;
		const recipientListId = email.settings.recipient_list;
		const response: AxiosResponse<EmailRescipientResponse> =
			await axiosclient().post("functions/get_list_recipients", {
				list_id: recipientListId
			});

		setRecipients(response.data.result.recipients || []);
		setSuppressedRecipients(
			response.data.result.suppressedRecipients || []
		);
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
		if (
			email &&
			email.settings?.recipient_list &&
			recipients.length === 0
		) {
			findRecipients();
		}
	}, [email]);

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
						<EmailOverview
							email={email}
							recipients={recipients}
							suppressedRecipients={suppressedRecipients}
							findRecipients={findRecipients}
						/>
					)}
					{siteState.value === "data" && (
						<EmailData
							emailId={emailId}
							selectedDataRows={selectedDataRows}
							setSelectedDataRows={setSelectedDataRows}
						/>
					)}
					{siteState.value === "recipients" && (
						<EmailRecipients
							email={email}
							recipients={recipients}
							emailRecipients={email.recipients}
						/>
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
						<EmailSettings
							emailId={emailId}
							findRecipients={findRecipients}
						/>
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
				recipients={recipients}
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

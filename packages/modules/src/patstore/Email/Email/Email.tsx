"use client";

import siteStates from "./constants/siteStates";
import { Modal, Page, PageHeaderButton } from "@repo/ui";
import { useMemo, useState } from "react";
import { Params } from "@repo/types";
import { useDataHandler, useGetData } from "@repo/provider";
import TestEmail from "./components/TestEmail";
import { EmailContent, EmailData } from "./content";

const Email = ({ params }: { params: Params }) => {
	const { deleteData } = useDataHandler();
	const [testEmail, setTestEmail] = useState<boolean>(false);

	const emailId = params.email_id;

	const { data: email, refetch } = useGetData({
		objectName: "Email",
		fields: [
			"objectId",
			"title",
			"description",
			"fields",
			"categories",
			"settings"
		],
		id: emailId
	});
	const [siteState, setSiteState] = useState<(typeof siteStates)[number]>(
		siteStates[0] as { value: string; label: string }
	);
	const [createField, setCreateField] = useState(false);
	const [selectedDataRows, setSelectedDataRows] = useState<string[]>([]);
	const [dataDeleteModal, setDataDeleteModal] = useState<boolean>(false);
	const [loading, setLoading] = useState(false);

	const pageHeaderButtons: PageHeaderButton[] = useMemo(() => {
		if (siteState.value === "fields") {
			return [
				{
					text: "Feld hinzufügen",
					onClick: () => setCreateField(true),
					is_add_button: true,
					disabled: email?.settings?.static_form === true || false
				}
			];
		}
		if (siteState.value === "data") {
			return [
				{
					text: "Daten löschen",
					onClick: () => {
						setDataDeleteModal(true);
					},
					icon: "delete",
					disabled: selectedDataRows.length === 0
				}
			];
		}
		if (siteState.value === "settings") {
			return [
				{
					text: "Test E-Mail senden",
					onClick: () => {
						setTestEmail(true);
					}
				}
			];
		}
		return [];
	}, [siteState, selectedDataRows, email]);

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
					{siteState.value === "data" && (
						<EmailData
							emailId={emailId}
							selectedDataRows={selectedDataRows}
							setSelectedDataRows={setSelectedDataRows}
						/>
					)}
					{siteState.value === "content" && (
						<EmailContent emailId={emailId} />
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
			<TestEmail
				testEmail={testEmail}
				setTestEmail={setTestEmail}
				emailId={emailId}
			/>
		</Page>
	);
};

export default Email;

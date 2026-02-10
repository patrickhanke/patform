"use client";

import { useGetForm } from "./hooks/useGetForm";
import siteStates from "./constants/siteStates";
import { Page, PageHeaderButton } from "@repo/ui";
import { useMemo, useState } from "react";
import FormData from "./content/FormData";
import FormSettings from "./content/FormSettings";
import FormFields from "./content/FormFields";
import { Params } from "@repo/types";
import TestEmail from "./components/TestEmail";

const Form = ({ params }: { params: Params }) => {
	const [testEmail, setTestEmail] = useState<boolean>(false);

	const formId = params.form_id;
	const { form, refetch } = useGetForm({ formId });
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
					disabled: form?.settings?.static_form === true || false
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
	}, [siteState, selectedDataRows, form]);

	if (!form) {
		return <div>Lädt ...</div>;
	}

	return (
		<Page
			title={form ? form?.title : "Lädt ..."}
			emptyContent={true}
			refetch={refetch}
			pageStates={siteStates}
			pageState={siteState}
			setPageState={setSiteState}
			pageHeaderButtons={pageHeaderButtons}
		>
			{!form ? (
				<p>Formular nicht gefunden</p>
			) : (
				<>
					{siteState.value === "data" && (
						<FormData
							formTitle={form?.title}
							formId={formId}
							selectedDataRows={selectedDataRows}
							setSelectedDataRows={setSelectedDataRows}
							dataDeleteModal={dataDeleteModal}
							setDataDeleteModal={setDataDeleteModal}
							loading={loading}
							setLoading={setLoading}
						/>
					)}
					{siteState.value === "settings" && (
						<FormSettings formId={formId} />
					)}
					{siteState.value === "fields" && (
						<FormFields
							formId={formId}
							createField={createField}
							setCreateField={setCreateField}
						/>
					)}
				</>
			)}

			<TestEmail
				testEmail={testEmail}
				setTestEmail={setTestEmail}
				formId={formId}
			/>
		</Page>
	);
};

export default Form;

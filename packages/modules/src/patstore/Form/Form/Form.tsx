"use client";

import { useGetForm } from "./hooks/useGetForm";
import siteStates from "./constants/siteStates";
import { Modal, Page, PageHeaderButton } from "@repo/ui";
import { useMemo, useState } from "react";
import FormData from "./content/FormData";
import FormSettings from "./content/FormSettings";
import FormFields from "./content/FormFields";
import { Params } from "@repo/types";
import { useDataHandler } from "@repo/provider";

const Form = ({ params }: { params: Params }) => {
	const { deleteData } = useDataHandler();

	const formId = params.form_id;
	const { form, refetch } = useGetForm({ formId });
	const [siteState, setSiteState] = useState<(typeof siteStates)[number]>(
		siteStates[0] as { value: string; label: string }
	);
	const [createField, setCreateField] = useState(false);
	const [selectedDataRows, setSelectedDataRows] = useState<string[]>([]);
	const [dataDeleteModal, setDataDeleteModal] = useState<boolean>(false);
	const [loading, setLoading] = useState(false);

	console.log(selectedDataRows);

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
		return [];
	}, [siteState, selectedDataRows, form]);

	if (!form) {
		return <div>Lädt ...</div>;
	}

	return (
		<Page
			title={form ? form?.name : "Lädt ..."}
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
							formId={formId}
							selectedDataRows={selectedDataRows}
							setSelectedDataRows={setSelectedDataRows}
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
		</Page>
	);
};

export default Form;

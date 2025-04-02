"use client";

import { useContext, useState } from "react";
import {
	DataTransfer,
	generateQuery,
	Modal,
	Page,
	Table,
	useCreateColumns
} from "@repo/ui";
import { PersonClass } from "@repo/types";
import { PatstoreAppContext } from "@repo/provider";
import useFindPerson from "./hooks/useFindPerson";
import deleteModalInitialValues from "./constants/deleteModalInitialValues";
import CreatePerson from "./components/CreatePerson";

const PersonsOverview = () => {
	const { currentModule } = useContext(PatstoreAppContext);
	const [filters] = useState([]);
	const { persons, refetch } = useFindPerson({
		moduleId: currentModule.objectId,
		filters
	});
	const [deleteModal, setDeleteModal] = useState(deleteModalInitialValues);

	const columns = useCreateColumns<PersonClass>({
		data: [
			{ id: "portrait", type: "edit_image", label: "Portrait" },
			{ id: "name", type: "edit_string", label: "Name" }
		],
		fields: currentModule.fields,
		className: "Person",
		refetch,
		categories: currentModule?.categories
	});

	return (
		<Page
			title={currentModule.name}
			pageHeaderContent={<CreatePerson refetch={refetch} />}
			emptyContent={true}
		>
			{process.env.NODE_ENV === "development" && (
				<DataTransfer
					sourceClassName="Uebungsleiter"
					targetClassName="Person"
					moduleId={currentModule.objectId}
					url="https://pg-app-mvx9tbt2yit00ef2pzlktzg3k81djj.scalabl.cloud/graphql/"
					masterKey="POcP3f5vEluCLVT1txftBPf5XGTIPYSki6UR7VRH"
					appId="E24kTRGCLBzXhUOQvwFNekgPpoMPeHRNITT67YiR"
					query={generateQuery({
						objectName: "Uebungsleiter",
						fields: ["username", "email", "portrait"]
					})}
					propertyMapping={{
						username: "name",
						email: "email",
						portrait: "portrait"
					}}
				/>
			)}
			<Table columns={columns} data={persons || []} />
			<Modal
				isOpen={deleteModal.isOpen}
				cancelButtonHandler={() =>
					setDeleteModal(deleteModalInitialValues)
				}
				confirmButtonHandler={() => {
					deleteModal.confirmButtonHandler();
					setDeleteModal(deleteModalInitialValues);
				}}
				header={deleteModal.header}
			>
				<p>Sind sich Sicher, dass sie die Person löschen möchten?</p>
			</Modal>
		</Page>
	);
};

export default PersonsOverview;

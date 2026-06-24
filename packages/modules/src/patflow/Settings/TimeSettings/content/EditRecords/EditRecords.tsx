import { useFindData } from "@repo/provider";
import { FC, useContext, useState } from "react";
import { EditRecordsProps } from "./types";
import CreateRecord from "./content/CreateRecord";
import useRecordsTableColumns from "./hooks/useRecordsTableColumns";
import { Modal, Table } from "@repo/ui";
import { PatflowAppContext } from "@repo/provider";
import { Worker } from "@repo/types";
import SelectUser from "./components/SelectUser";

type RecordFlowMode = "create" | "edit" | null;

const EditRecords: FC<EditRecordsProps> = ({
	createRecord,
	setCreateRecord,
	editRecord,
	setEditRecord,
	projectId
}) => {
	const { year } = useContext(PatflowAppContext);
	const { data, loading, refetch } = useFindData({
		objectName: "Record",
		fields: [
			"objectId",
			"year",
			"user {objectId first_name last_name}",
			"default_times",
			"createdAt",
			"start_date",
			"end_date",
			"time_settings"
		],
		filters: [{ key: "year", value: year, operator: "equalTo" }]
	});
	const [selectedUser, setSelectedUser] = useState<Worker | undefined>(
		undefined
	);
	const [recordFlowMode, setRecordFlowMode] = useState<RecordFlowMode>(null);

	const columns = useRecordsTableColumns();
	const userSelectOpen = createRecord || editRecord;
	const isEditUserSelect = editRecord && !createRecord;

	const closeUserSelect = () => {
		setCreateRecord(false);
		setEditRecord(false);
		setSelectedUser(undefined);
	};

	const closeRecordFlow = () => {
		setRecordFlowMode(null);
		setSelectedUser(undefined);
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<div className="site_content">
				<div className="content_element no_padding">
					<Table data={data || []} columns={columns} />
				</div>
			</div>
			{!!selectedUser && recordFlowMode && (
				<CreateRecord
					createRecord={!!recordFlowMode}
					setCreateRecord={(open) => {
						if (!open) closeRecordFlow();
					}}
					mode={recordFlowMode}
					userId={selectedUser.objectId}
					timeSettings={selectedUser.time_settings}
					refetch={refetch}
					projectId={projectId}
					person={{
						label: `${selectedUser.first_name} ${selectedUser.last_name}`,
						portrait: selectedUser.portrait
					}}
				/>
			)}
			<Modal
				isOpen={userSelectOpen}
				cancelButtonHandler={closeUserSelect}
				confirmButtonHandler={() => {
					if (isEditUserSelect) {
						setEditRecord(false);
						setRecordFlowMode("edit");
					} else {
						setCreateRecord(false);
						setRecordFlowMode("create");
					}
				}}
				header={
					isEditUserSelect
						? "Nutzer für Record-Bearbeitung auswählen"
						: "Nutzer für Record auswählen"
				}
				buttonDisabled={[false, !selectedUser]}
			>
				<SelectUser
					selectedUser={selectedUser}
					setSelectedUser={(worker) => setSelectedUser(worker)}
				/>
			</Modal>
		</>
	);
};

export default EditRecords;

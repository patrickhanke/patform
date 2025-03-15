import { find_record } from "@queries";
import { useQuery } from "@apollo/client";
import React, { FC, useContext, useState } from "react";
import { EditRecordsProps } from "./types";
import CreateRecord from "./content/CreateRecord";
import useRecordsTableColumns from "./hooks/useRecordsTableColumns";
import { Modal, Table } from "@repo/ui";
import { AppContext } from "@provider";
import { Worker } from "@types";
import SelectUser from "./components/SelectUser";

const EditRecords: FC<EditRecordsProps> = ({
  createRecord,
  setCreateRecord,
  projectId,
}) => {
  const { year } = useContext(AppContext);
  const { data, loading, refetch } = useQuery(find_record, {
    variables: { params: { year: { _eq: year } } },
  });
  const [selectedUser, setSelectedUser] = useState<Worker | undefined>(
    undefined,
  );
  const [editRecordData, setEditRecordData] = useState(false);

  const columns = useRecordsTableColumns({ refetch, projectId });

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log(selectedUser);

  return (
    <>
      <div className="site_content">
        <div className="content_element no_padding">
          <Table data={data.objects.findRecord.results} columns={columns} />
        </div>
      </div>
      {!!selectedUser && (
        <CreateRecord
          createRecord={editRecordData}
          setCreateRecord={setEditRecordData}
          userId={selectedUser?.objectId}
          timeSettings={selectedUser?.time_settings}
          refetch={refetch}
          projectId={projectId}
          person={{
            label: `${selectedUser?.first_name} ${selectedUser?.family_name}`,
            portrait: selectedUser.portrait,
          }}
        />
      )}
      <Modal
        isOpen={createRecord}
        cancelButtonHandler={() => setCreateRecord(false)}
        confirmButtonHandler={() => {
          setCreateRecord(false);
          setEditRecordData(true);
        }}
        header="Nutzer für Record auswählen"
        buttonDisabled={[false, !selectedUser]}
      >
        <SelectUser
          selectedUser={selectedUser}
          setSelectedUser={(values) => {
            if (values.length === 0) {
              return;
            } else if (values[0]) {
              setSelectedUser(values[0].user);
            }
          }}
        />
      </Modal>
    </>
  );
};

export default EditRecords;

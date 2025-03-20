import { find_record } from "@repo/provider";
import { useQuery } from "@apollo/client";
import React from "react";
import { StaffMemberTimesProps } from "./types";
import CreateRecord from "./content/CreateRecord";
import useRecordsTableColumns from "./hooks/useRecordsTableColumns";
import { Table } from "@repo/ui";

const StaffMemberTimes = ({
  userId,
  timeSettings,
  createRecord,
  setCreateRecord,
  projectId,
}: StaffMemberTimesProps) => {
  const { data, loading, refetch } = useQuery(find_record, {
    variables: { params: { user: { _eq: userId } } },
  });
  const columns = useRecordsTableColumns({ refetch, projectId });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="site_content">
        <div className="content_element no_padding">
          <Table data={data.objects.findRecord.results} columns={columns} />
        </div>
      </div>
      <CreateRecord
        createRecord={createRecord}
        setCreateRecord={setCreateRecord}
        userId={userId}
        timeSettings={timeSettings}
        refetch={refetch}
        projectId={projectId}
      />
    </>
  );
};

export default StaffMemberTimes;

"use client";

import { Page, Table, useCreateColumns } from "@repo/ui";
import { useContext, useState } from "react";
import useFindForm from "./hooks/useFindForm";
import { FormClass } from "@repo/types";
import { PatstoreAppContext } from "@repo/provider";
import createForm from "./constants/createForm";

const FormsOverview = () => {
  const { currentModule } = useContext(PatstoreAppContext);
  const [filters] = useState([]);
  const { forms, refetch } = useFindForm({
    moduleId: currentModule.objectId,
    filters,
  });

  const columns = useCreateColumns<FormClass>({
    data: [
      { id: "name", type: "edit_string", label: "Name" },
      { id: "objectId", type: "string", label: "ID" },
      { id: "description", type: "edit_textfield", label: "Text" },
    ],
    fields: currentModule.fields,
    className: "Field",
    refetch,
    categories: currentModule?.categories,
    editLink: "forms",
  });

  return (
    <Page
      title={currentModule.name}
      emptyContent={true}
      createClass={createForm}
      refetch={refetch}
    >
      <Table columns={columns} data={forms || []} />
    </Page>
  );
};

export default FormsOverview;

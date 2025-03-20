"use client";

import { useContext, useState } from "react";
import { Modal, Page, Table, useCreateColumns } from "@repo/ui";
import { NewsClass } from "@repo/types";
import { PatstoreAppContext } from "@repo/provider";
import deleteModalInitialValues from "./constants/deleteModalInitialValues";
import useFindNews from "./hooks/useFindNews";
import createClass from "./constants/createClass";
import CreateNews from "./components/CreateNews";

const NewsOverview = () => {
  const { currentModule } = useContext(PatstoreAppContext);
  const [filters] = useState([]);
  const { news, refetch } = useFindNews({
    moduleId: currentModule.objectId,
    filters,
  });
  const [deleteModal, setDeleteModal] = useState(deleteModalInitialValues);

  const columns = useCreateColumns<NewsClass>({
    data: [
      { id: "image", type: "image", label: "Bild" },
      { id: "title", type: "edit_string", label: "Titel" },
      { id: "text", type: "edit_texteditor", label: "Text" },
    ],
    fields: currentModule.fields,
    className: "News",
    refetch,
    categories: currentModule?.categories,
  });

  return (
    <Page
      title={currentModule.name}
      pageHeaderContent={<CreateNews refetch={refetch} />}
      emptyContent={true}
      createClass={createClass}
      refetch={refetch}
    >
      <Table columns={columns} data={news || []} />
      <Modal
        isOpen={deleteModal.isOpen}
        cancelButtonHandler={() => setDeleteModal(deleteModalInitialValues)}
        confirmButtonHandler={() => {
          deleteModal.confirmButtonHandler();
          setDeleteModal(deleteModalInitialValues);
        }}
        header={deleteModal.header}
      >
        <p>Sind sich Sicher, dass sie die News löschen möchten?</p>
      </Modal>
    </Page>
  );
};

export default NewsOverview;

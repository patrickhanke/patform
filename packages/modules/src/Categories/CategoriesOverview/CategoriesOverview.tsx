"use client";

import { useContext, useMemo, useState } from "react";
import { Modal, Page, Table, useCreateColumns } from "@repo/ui";
import { CategoryClass } from "@repo/types";
import { AppContext } from "@repo/provider";
import deleteModalInitialValues from "./constants/deleteModalInitialValues";
import useFindCategory from "./hooks/useFindCategory";
import CreateCategory from "./components/CreateCategory";

const Categories = () => {
  const { currentModule } = useContext(AppContext);
  const pageStates = useMemo(
    () => currentModule?.settings?.categories,
    [currentModule],
  );
  const [activeState, setActiveState] = useState(pageStates[0]);
  const { categories, refetch } = useFindCategory({
    moduleId: currentModule.objectId,
    filters: activeState.value
      ? [
          {
            key: "category_id",
            value: activeState.id,
            operator: "_eq",
            id: activeState.id,
          },
        ]
      : [],
  });
  const [deleteModal, setDeleteModal] = useState(deleteModalInitialValues);

  const columns = useCreateColumns<CategoryClass>({
    data: [
      { id: "image", type: "edit_image", label: "Bild" },
      { id: "name", type: "edit_string", label: "Name" },
      { id: "description", type: "edit_textfield", label: "Beschreibung" },
    ],
    fields: currentModule.fields,
    className: "Category",
    refetch,
    categories: currentModule?.categories,
  });

  return (
    <Page
      title={currentModule.name}
      pageHeaderContent={
        <CreateCategory
          refetch={refetch}
          typeId={activeState.id}
          typeLabel={activeState.label}
        />
      }
      emptyContent={true}
      pageStates={pageStates}
      activeState={activeState}
      navOnClick={setActiveState}
    >
      <Table columns={columns} data={categories || []} />
      <Modal
        isOpen={deleteModal.isOpen}
        cancelButtonHandler={() => setDeleteModal(deleteModalInitialValues)}
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

export default Categories;

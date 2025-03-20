import React, { useCallback, useMemo, useState } from "react";
import useFindObjectsDocuments from "./hooks/useFindObjectDocuments";
import { ColumnDef } from "@tanstack/react-table";
import { getDateStringsFromIso, useDataHandler } from "@repo/provider";
import CreateDocument from "./components/CreateDocument";
import { FileDisplay, IconButton, Select, SiteHeader, Table } from "@repo/ui";
import { Document } from "@repo/types";

const ProperyDocuments = ({ id }: { id: string }) => {
  const [type, setType] = useState({
    value: "all",
    id: "all",
    label: "Alle",
  });
  const { data, refetch } = useFindObjectsDocuments({ id, type: type.value });
  const [createDocument, setCreateDocument] = useState(false);
  const { createData } = useDataHandler();

  const siteHeaderContent = useMemo(() => {
    return (
      <Select
        options={[
          { value: "all", id: "all", label: "Alle" },
          { value: "object", id: "object", label: "Objekt" },
          { value: "task", id: "task", label: "Aufgabe" },
        ]}
        value={type}
        onChange={(value) => setType(value)}
      />
    );
  }, [type]);

  const columns: ColumnDef<Document>[] = useMemo(
    () => [
      {
        accessorFn: (row) => <FileDisplay document={row} />,
        header: () => <span>Vorschau</span>,
        id: "preview",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorKey: "name",
        header: () => <span>Name</span>,
        id: "name",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => getDateStringsFromIso(row.createdAt).date,
        header: () => <span>Erstellt</span>,
        id: "created_at",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) =>
          `${row.created_by.first_name} ${row.created_by.family_name}`,
        header: () => <span>Erstellt von</span>,
        id: "created_by",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => row?.task?.title || "-",
        header: () => <span>Aufgabe</span>,
        id: "task",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => (
          <IconButton icon="download" isBlank isLink link={row.file.url} />
        ),
        header: () => <span>Download</span>,
        id: "edit",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
    ],
    [],
  );

  const addDocumentHandler = useCallback(
    async (content: { user: string; file: Document["file"]; name: string }) => {
      await createData({
        className: "Document",
        updateObject: {
          file: { __type: "File", ...content.file },
          name: content.name,
          type: "object",
          created_by: {
            __type: "Pointer",
            className: "_User",
            objectId: content.user,
          },
          property: {
            __type: "Pointer",
            className: "Property",
            objectId: id,
          },
        },
      });
      refetch();
    },
    [data],
  );

  return (
    <>
      <div className="site_content">
        {data && <Table data={data} columns={columns} />}
      </div>
      <CreateDocument
        open={createDocument}
        setOpen={setCreateDocument}
        createDocumentHandler={addDocumentHandler}
      />
    </>
  );
};

export default ProperyDocuments;

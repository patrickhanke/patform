"use client";

import { useContext, useState } from "react";
import {
  Page,
  RenderFilters,
  Separator,
  Table,
  useCreateColumns,
} from "@repo/ui";
import { PatstoreAppContext } from "@repo/provider";
import useFindDownload from "./hooks/useFindDownload";
import { DownloadClass, Filter } from "@repo/types";
import createDownload from "./constants/createDownload";

const DownloadsOverview = () => {
  const { currentModule } = useContext(PatstoreAppContext);

  const [filters, setFilters] = useState<Filter[]>([]);
  const { downloads, refetch } = useFindDownload({
    moduleId: currentModule.objectId,
    filters,
  });

  const columns = useCreateColumns<DownloadClass>({
    data: [
      { id: "image", type: "edit_image", label: "Bild" },
      { id: "title", type: "edit_string", label: "Titel" },
      { id: "info", type: "edit_textfield", label: "Text" },
      { id: "file", type: "file", label: "Datei" },
    ],
    fields: currentModule.fields,
    className: "Download",
    refetch,
    categories: currentModule?.categories,
  });

  return (
    <Page
      title={currentModule.name}
      emptyContent={true}
      createClass={createDownload}
      refetch={refetch}
    >
      <RenderFilters
        categories={currentModule.categories}
        filters={filters}
        setFilters={setFilters}
        initialFilters={[]}
        fields={[
          {
            type: "input",
            key: "title",
            operator: "_text",
            placeholder: "Status...",
          },
        ]}
      />
      <Separator size="xs" noLine />
      <Table columns={columns} data={downloads || []} />
    </Page>
  );
};

export default DownloadsOverview;

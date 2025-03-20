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
import { Filter, GroupClass } from "@repo/types";
import useFindGroup from "./hooks/useFindGroup";
import createGroup from "./constants/createGroup";

const GroupOverview = () => {
  const { currentModule } = useContext(PatstoreAppContext);

  const [filters, setFilters] = useState<Filter[]>([]);
  const { groups, refetch } = useFindGroup({
    moduleId: currentModule.objectId,
    filters,
  });

  const columns = useCreateColumns<GroupClass>({
    data: [
      { id: "image", type: "edit_image", label: "Bild" },
      { id: "title", type: "edit_string", label: "Titel" },
      { id: "times", type: "edit_times", label: "Zeiten" },
      { id: "persons", type: "edit_persons", label: "Übungsleiter" },
      { id: "state", type: "edit_string", label: "Status" },
    ],
    fields: currentModule.fields,
    className: "Group",
    refetch,
    categories: currentModule?.categories,
  });

  return (
    <Page
      title={currentModule.name}
      emptyContent={true}
      createClass={createGroup}
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
      <Table columns={columns} data={groups || []} />
    </Page>
  );
};

export default GroupOverview;

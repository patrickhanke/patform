import { generateGraphQLQuery } from "@repo/provider";
import { useQuery } from "@apollo/client";
import { WebsitePagesProps } from "./types";
import { Table, useCreateColumns } from "@repo/ui";
import { PageClass } from "@repo/types";

const WebsitePages = ({ moduleId }: WebsitePagesProps) => {
  const { data: pageData, refetch } = useQuery(
    generateGraphQLQuery({
      type: "find",
      objectName: "Webpage",
      fields: ["title", "objectId", "name", "title", "subtitle"],
    }),
    { variables: { where: { module: moduleId } } }
  );

  const columns = useCreateColumns<PageClass>({
    data: [
      { id: "name", type: "edit_string", label: "Name" },
      { id: "title", type: "edit_string", label: "Titel" },
      { id: "subtitle", type: "edit_textfield", label: "Untertitel" },
    ],
    fields: undefined,
    className: "Webpage",
    refetch,
    categories: [],
  });

  if (pageData) {
    const pages = pageData?.objects.findWebpage.results;
    console.log(pages);

    return <Table data={pages} columns={columns} />;
  }

  return null;
};

export default WebsitePages;

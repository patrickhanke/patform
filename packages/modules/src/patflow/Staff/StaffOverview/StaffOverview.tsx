"use client";

import { useQuery } from "@apollo/client";
import React from "react";
import useTableColumns from "./hooks/useTableColumns";
import { FIND_ALL_STAFF } from "@repo/provider";
import { Page, SiteHeader } from "@repo/ui";
import { Table } from "@repo/ui";

const StaffOverview = () => {
  const columns = useTableColumns();
  const { data } = useQuery(FIND_ALL_STAFF, {
    notifyOnNetworkStatusChange: true,
  });

  return (
    <Page
      title="Mitarbeiter"
      description="Informationen und Einstellungen zu den Mitarbeitern"
    >
      <div className="content_element no_padding">
        <Table
          columns={columns}
          data={data?.objects?.find_User?.results || []}
        />
      </div>
    </Page>
  );
};

export default StaffOverview;

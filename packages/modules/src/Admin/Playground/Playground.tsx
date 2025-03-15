"use client";

import React, { useContext } from "react";
import { AppContext } from "@repo/provider";
import { AdminPage } from "@repo/modules";

const Playground = ({ params }: { params: { project_id: string } }) => {
  const { getCurrentProject } = useContext(AppContext);
  return (
    <AdminPage
      title={`${getCurrentProject(params.project_id)?.name} - Playground`}
      emptyContent={true}
    >
      <p>Playground</p>
    </AdminPage>
  );
};

export default Playground;

"use client";

import React, { useContext, useMemo, useState } from "react";
import { Page } from "@repo/ui";
import { PageState } from "@repo/types";
import page_states from "./constants/page_states";
import ServiceSettings from "./content/ServiceSettings";
import Services from "./content/Services";
import Tours from "./content/Tours";
import { UserContext } from "@provider";

const ToursOverview = () => {
  const { projectId } = useContext(UserContext);
  const [createService, setCreateService] = useState<boolean>(false);
  const [pageState, setPageState] = useState<PageState>(
    page_states[0] as PageState,
  );
  const [headerContent, setPageHeaderContent] =
    useState<React.ReactNode | null>(null);

  const pageHeaderButtons = useMemo(() => {
    if (pageState.value === "settings") {
      return [
        {
          text: "Service erstellen",
          onClick: () => setCreateService(true),
        },
      ];
    }
  }, [pageState]);

  const pageHeaderContent = useMemo(() => {
    if (pageState.value === "tours" && headerContent) {
      return headerContent;
    }
  }, [pageState, headerContent]);

  console.log(pageHeaderContent);

  return (
    <Page
      title="Touren"
      pageState={pageState}
      pageStates={page_states}
      setPageState={setPageState}
      pageHeaderButtons={pageHeaderButtons}
      pageHeaderContent={pageHeaderContent}
    >
      {pageState.value === "services" && <Services projectId={projectId} />}
      {pageState.value === "settings" && (
        <ServiceSettings
          projectId={projectId}
          createService={createService}
          setCreateService={setCreateService}
        />
      )}
      {pageState.value === "tours" && (
        <Tours
          projectId={projectId}
          setPageHeaderContent={setPageHeaderContent}
        />
      )}
    </Page>
  );
};

export default ToursOverview;

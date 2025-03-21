"use client";

import { PageHeader } from "./content/PageHeader";
import { AdminPageProps } from "./types";
import "./styles.scss";
import { PageNavigation } from "./content/PageNavigation";

const AdminPage = ({
  title,
  children,
  pageHeaderContent,
  pageHeaderButtons,
  pageStates = [],
  createClass,
  activeState,
  navOnClick,
  refetch,
  emptyContent = false,
  projectId,
}: AdminPageProps) => {
  return (
    <>
      <PageHeader
        title={title}
        pageHeaderContent={pageHeaderContent}
        pageHeaderButtons={pageHeaderButtons}
        emptyContent={emptyContent}
        createClass={createClass}
        refetch={refetch}
        projectId={projectId}
      />
      {navOnClick && activeState && (
        <PageNavigation
          siteStates={pageStates}
          activeState={activeState}
          onClick={navOnClick}
        />
      )}
      <div className="page-content">{children}</div>
    </>
  );
};

export default AdminPage;

"use client";

import {
  generateGraphQLQuery,
  paramsHandler,
  ProjectLoader,
  useDataHandler,
} from "@repo/provider";
import { DnDDisplay, sortItemsByPosition } from "@repo/ui";
import { Module } from "@repo/types";
import { useQuery } from "@apollo/client";
import AppModule from "./content/AppModule";
import { useCallback, useMemo, useState } from "react";
import { AdminPage } from "@repo/modules";
import { SelectModule } from "./types";
import CreateModule from "./components/CreateModule";
import site_states from "./constants/site_states";
import AppUsers from "./content/AppUsers";
import ProjectSettings from "./content/ProjectSettings";

const Project = ({ params }: { params: { project_id: string } }) => {
  const { data: projectData, loading: projectLoading } = useQuery(
    generateGraphQLQuery({
      type: "get",
      objectName: "Project",
      fields: ["objectId", "name", "createdAt", "logo"],
    }),
    {
      variables: { id: params.project_id },
    }
  );
  const [createModule, setCreateModule] = useState(false);
  const [createUser, setCreateUser] = useState(false);
  const [addUser, setAddUser] = useState(false);

  const [siteState, setSiteState] = useState(
    site_states[0] as (typeof site_states)[number]
  );
  const { createData, updateData } = useDataHandler();
  const { data, loading, refetch } = useQuery(
    generateGraphQLQuery({
      type: "find",
      objectName: "Module",
      fields: ["objectId", "name", "createdAt", "icon", "path"],
    }),
    {
      variables: {
        params: paramsHandler({
          filters: [
            {
              key: "project",
              value: params.project_id,
              operator: "_eq",
              id: "projectId",
            },
          ],
        }),
      },
    }
  );

  const pageHeaderButtons = useMemo(() => {
    if (siteState.value === "modules")
      return [
        {
          text: "Neues Modul",
          onClick: () => setCreateModule(true),
        },
      ];
    if (siteState.value === "users")
      return [
        {
          text: "Neuer Benutzer",
          onClick: () => setCreateUser(true),
          is_add_button: true,
        },
        {
          text: "Benutzer hinzufügen",
          onClick: () => setAddUser(true),
        },
      ];
  }, [params.project_id, siteState]);

  const createModuleHandler = useCallback(
    async (module: SelectModule["fields"]) => {
      await createData({
        className: "Module",
        updateObject: {
          ...module,
          position: data?.objects.findModule.results.length + 1,
          project: {
            __type: "Pointer",
            className: "Project",
            objectId: params.project_id,
          },
        },
        afterSaveHandler: async (objectId) => {
          await updateData({
            className: "Project",
            objectId: params.project_id,
            updateObject: {
              modules: {
                __op: "AddRelation",
                objects: [
                  { __type: "Relation", className: "Module", objectId },
                ],
              },
            },
          });
        },
      });
      await refetch();
      setCreateModule(false);
    },
    [data]
  );

  if (!data && !projectData) return <ProjectLoader loading={true} />;

  const modules = data?.objects.findModule.results;

  return (
    <AdminPage
      title={`${projectData?.objects.getProject?.name} - ${siteState.label}`}
      pageHeaderButtons={pageHeaderButtons}
      pageStates={site_states}
      activeState={siteState}
      navOnClick={setSiteState}
    >
      {siteState?.value === "modules" && (
        <>
          <DnDDisplay
            items={
              sortItemsByPosition(modules).map((module: Module) => ({
                ...module,
                id: module?.objectId,
              })) || []
            }
            ItemComponent={({ item }) => (
              <AppModule id={item.id} projectId={params.project_id} />
            )}
            objectClass="Module"
          />
          <CreateModule
            createModule={createModule}
            setCreateModule={setCreateModule}
            createModuleHandler={createModuleHandler}
            modules={modules}
          />
        </>
      )}
      {siteState?.value === "users" && (
        <>
          <AppUsers
            projectId={params.project_id}
            createUser={createUser}
            setCreateUser={setCreateUser}
            addUser={addUser}
            setAddUser={setAddUser}
          />
        </>
      )}
      {siteState?.value === "settings" && (
        <>
          <ProjectSettings projectId={params.project_id} />
        </>
      )}
    </AdminPage>
  );
};

export default Project;

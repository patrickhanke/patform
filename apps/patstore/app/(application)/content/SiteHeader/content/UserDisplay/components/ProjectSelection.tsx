import { generateGraphQLQuery_4_1, useAppContext } from "@repo/provider";
import React, { FC, useCallback, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { ProjectSelectionProps } from "../types";
import { ElementSelectInterface, SelectElement, SlideIn } from "@repo/ui";
import { PatstoreProject } from "@repo/types";
import { useRouter } from "next/navigation";


const ProjectSelection: FC<ProjectSelectionProps> = ({
  projects,
  selectProject,
  setSelectProject,
}) => {
	const router = useRouter();

  const { project, loadProject } = useAppContext();
  const [selectedProject, setSelectedProject] = useState<SelectElement[]>([
    { value: project.objectId, label: project.name },
  ]);
  const { data } = useQuery(
    generateGraphQLQuery_4_1({
      type: "find",
      objectName: "Project",
      queryName: "projects",
      fields: ["name", "objectId", "id"],
    }),
    {
      variables: {
        params: {
          id: {
            in: projects,
          },
        },
      },
    },
  );

  const projectSelectHandler = useCallback(() => {
    if (
      selectedProject &&
      selectedProject[0] &&
      selectedProject[0].value !== project.objectId
    ) {
      loadProject(selectedProject[0].value);
    }
    setSelectProject(false);
  }, [selectedProject, project]);

  const disabled = useCallback(() => {
    if (!selectedProject || !selectedProject[0]) {
      return true;
    }
    if (selectedProject[0].value === project.objectId) {
      return true;
    }
    return false;
  }, [selectedProject, project]);

const selectElements = useMemo(() => {
  if (data) {
    return data?.projects.edges.map((edge: { node: PatstoreProject }) => ({
      value: edge.node.objectId,
      label: edge.node.name,
    }));

  }
  return []
}, [data, selectProject]);

  return (
    <SlideIn
      header="Projektauswahl"
      isOpen={selectProject}
      cancel={() => setSelectProject(false)}
      confirm={() => {
        router.push("/");
        projectSelectHandler()
      }}
      preventClickOutside
      disabled={[false, disabled()]}
      errors={[]}
    >
      <label>{projects.length > 1 ? "Projekte" : "Projekt"}</label>
      {selectElements?.length > 0 && <ElementSelectInterface
        elements={selectElements}
        onSelect={(value) => setSelectedProject(value)}
        selectedElements={selectedProject}
        max={1}
      /> }
    </SlideIn>
  );
};

export default ProjectSelection;

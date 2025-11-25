import { generateGraphQLQuery, useAppContext } from "@repo/provider";
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
    generateGraphQLQuery({
      type: "find",
      objectName: "Project",
      fields: ["name", "objectId"],
    }),
    {
      variables: {
        params: {
          objectId: {
            _in: projects,
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
  return data?.objects.findProject.results.map((project: PatstoreProject) => ({
    value: project.objectId,
    label: project.name,
  }));
}, [data, selectProject]);

console.log(selectElements)
console.log(data)

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
      {selectElements.length > 0 && <ElementSelectInterface
        elements={selectElements}
        onSelect={(value) => setSelectedProject(value)}
        selectedElements={selectedProject}
        max={1}
      /> }
    </SlideIn>
  );
};

export default ProjectSelection;

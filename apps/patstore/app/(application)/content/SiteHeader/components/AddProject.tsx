import { FC, useCallback, useMemo, useState } from "react";
import { Field, Form, SlideIn } from "@repo/ui";
import { PatstoreProject } from "@repo/types";
import { useDataHandler } from "@repo/provider";
import { AddProjectProps } from "../../SiteHeader copy/types";

const AddProject: FC<AddProjectProps> = ({ addProject, setAddProject }) => {
  const { createData } = useDataHandler();
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<
    Omit<PatstoreProject, "objectId" | "modules">
  >({
    name: "",
    description: "",
    content: [],
    logo: "",
    settings: {},
  });

  const formFields = useMemo(
    () => [
      {
        label: `Name`,
        id: "name",
        name: "name",
        type: "input",
        value: project.name,
        placeholder: "Projektname",
      } as Field,
      {
        label: `Beschreibung`,
        id: "description",
        name: "description",
        type: "textarea",
        value: project.description,
        dataType: "string",
        placeholder: "Projektbeschreibung",
      },
      {
        label: "Logo",
        type: "image",
        name: "logo",
        dataType: "string",
        value: project.logo,
        options: {
          return_type: "string",
        },
      },
    ],
    [project]
  );

  const createProjectHandler = useCallback(async () => {
    setLoading(true);

    if (project.name) {
      await createData({
        className: "Project",
        updateObject: project,
      });
    }

    setLoading(false);
    setAddProject(false);
    window.location.reload();
  }, [project]);

  return (
    <SlideIn
      header="Neues Projekt erstellen"
      isOpen={addProject}
      cancel={() => setAddProject(false)}
      confirm={() => createProjectHandler()}
      disabled={[loading, !project.name || loading]}
    >
      <Form
        fields={formFields as Field[]}
        data={project}
        formSubmitHandler={(data) => {
          setProject(data as PatstoreProject);
        }}
      />
    </SlideIn>
  );
};

export default AddProject;

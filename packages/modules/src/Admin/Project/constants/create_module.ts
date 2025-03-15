import { PageCreateClassObject } from "@repo/ui";

const create_module: (pojectId: string) => PageCreateClassObject = (
  projectId: string,
) => ({
  className: "Module",
  text: "Neuen Nutzer erstellen",
  initialData: {
    username: "",
    email: "",
    password: "",
    project: { __type: "Pointer", className: "Project", objectId: projectId },
  },
  fields: [
    {
      id: "username",
      position: 1,
      name: "username",
      type: "input",
      label: "Name",
      validation: { required: "Pflichtfeld", min_length: 5, max_length: 36 },
    },
    {
      id: "email",
      position: 2,
      name: "email",
      type: "input",
      label: "E-Mail",
      validation: { required: "Pflichtfeld", type: "email" },
    },
    {
      id: "password",
      position: 3,
      name: "password",
      type: "password",
      label: "Passwort",
      validation: { required: "Pflichtfeld", min_length: 4, max_length: 36 },
    },
    {
      id: "portait",
      position: 3,
      name: "portrait",
      type: "image",
      label: "Bild",
      options: {
        return_type: "string",
        max_file_count: 1,
      },
    },
  ],
});

export default create_module;

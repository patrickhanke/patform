import type { PlopTypes } from "@turbo/gen";

// Learn more about Turborepo Generators at https://turbo.build/repo/docs/core-concepts/monorepos/code-generation

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  // A simple generator to add a new React component to the internal UI library
  // const folderArray = [
  //   {
  //     name: "EmailHandler",
  //     path: "email",
  //   }
  // ]
  // folderArray.forEach((folder) => {
  //   plop.setGenerator("app-routing", {
  //     description: "Adds new Routes",
  //     prompts: [],
  //     actions: [
  //       {
  //         type: "add",
  //         path: `app/(application)/${folder.name}/page.tsx`,
  //         templateFile: "templates/component.hbs",
  //       },
  //     ],
  //   });
  // });
}

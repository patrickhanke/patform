import { ModuleOptionsField } from "../types";
import { generateUuid } from "@repo/provider";

export const module_option_fields: ModuleOptionsField = {
  "/website": {
    path: "/website",
    name: "Webseite",
    icon: "website",
    settings: {
      categories: [],
    },
    fields: [],
    position: 1,
    categories: [],
    connected_class: "Webpage",
  },
  "/articles": {
    path: "/articles",
    name: "Beiträge",
    icon: "article",
    settings: {
      categories: [],
    },
    fields: [],
    position: 2,
    categories: [],
    connected_class: "Article",
  },
  "/events": {
    path: "/events",
    name: "Events",
    icon: "events",
    settings: {
      categories: [],
    },
    fields: [],
    position: 3,
    categories: [],
    connected_class: "Event",
  },
  "/news": {
    path: "/news",
    name: "News",
    icon: "news",
    settings: {
      categories: [],
    },
    fields: [],
    position: 4,
    categories: [],
    connected_class: "News",
  },
  "/categories": {
    path: "/categories",
    name: "Kategorien",
    icon: "categories",
    settings: {
      categories: [],
    },
    fields: [],
    position: 5,
    categories: [],
    connected_class: "Category",
  },
  "/persons": {
    path: "/persons",
    name: "Personen",
    icon: "persons",
    settings: {
      categories: [],
    },
    fields: [],
    position: 6,
    categories: [],
    connected_class: "Person",
  },
  "/images": {
    path: "/images",
    name: "Bilder",
    icon: "images",
    settings: {
      categories: [],
    },
    fields: [],
    position: 7,
    categories: [],
    connected_class: "Image",
  },
  "/training-group": {
    path: "/training-group",
    name: "Trainingsgruppe",
    icon: "group",
    settings: {
      categories: [],
    },
    fields: [
      {
        id: generateUuid(),
        label: "Startalter",
        type: "number",
        name: "data.start_age",
        validation: {},
        position: 1,
        options: {
          number_start_value: 1,
          number_end_value: 100,
        },
      },
      {
        id: generateUuid(),
        label: "Endalter",
        type: "number",
        name: "data.end_age",
        validation: {},
        position: 1,
        options: {
          number_start_value: 1,
          number_end_value: 100,
        },
      },
    ],
    position: 2,
    categories: [],
    connected_class: "Group",
  },
  "/downloads": {
    path: "/downloads",
    name: "Downloads",
    icon: "downloads",
    settings: {
      categories: [],
    },
    fields: [],
    position: 9,
    categories: [],
    connected_class: "Download",
  },
  "/forms": {
    path: "/forms",
    name: "Formulare",
    icon: "forms",
    settings: {
      categories: [],
    },
    fields: [],
    position: 10,
    categories: [],
    connected_class: "Form",
  },
  "/users": {
    path: "/users",
    name: "Nutzer",
    icon: "users",
    settings: {
      categories: [],
    },
    fields: [],
    position: 10,
    categories: [],
    connected_class: "_User",
  },
};

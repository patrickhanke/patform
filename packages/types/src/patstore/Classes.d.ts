import { FormDataElement } from "@repo/ui";
import { CategoryClass } from "./Category";
import { PatstoreUser } from "./User";

export type ClassCategories = string[];

export type ClassState = {
  value: string | number | object;
  label: string;
  color: string;
};

export type ClassProperties = {
  objectId: string;
  createdAt: string;
  updatedAt: string;
  data?: FormDataElement;
  module: Module;
  categories: ClassCategories;
  label: string;
  created_by: PatstoreUser;
  updated_by: PatstoreUser;
};

export type Classes =
  | ImageClass
  | NewsClass
  | PersonClass
  | CategoryClass
  | EventClass
  | ArticleClass
  | GroupClass
  | CategoryClass
  | AppointmentClass
  | TemplateClass
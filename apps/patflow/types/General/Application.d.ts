import { ApolloQueryResult } from "@apollo/client";
import { UserTypes } from ".";
import { PropertyTypes, TaskTypes } from "../content";

export type Params = {
  object_id: string;
  user_id: string;
  code: string;
};

export type ErrorMessage = {
  id: string;
  key: string;
  message: string;
};

export type ApolloRefetch = () => Promise<ApolloQueryResult<any>>;

export type Document = {
  objectId: string;
  createdAt: string;
  file: {
    url;
    name;
  };
  created_by: UserTypes.User;
  task: TaskTypes.Task;
  object: PropertyTypes.Property;
  name: string;
  type: "task" | "object";
};

export type Pointer<T> = {
  __type: "Pointer";
  className: T;
  objectId: string;
};

export type FilterOperator =
  | "_eq"
  | "_ne"
  | "_lt"
  | "_lte"
  | "_gt"
  | "_gte"
  | "_in"
  | "_nin";

export type Filter = {
  key: string;
  value: string | Array<string | number> | number | boolean;
  operator: FilterOperator;
  id: string;
};

export type StateColors =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "green"
  | "blue"
  | "yellow";

export type DatabaseFile = { name: string; url: string };

export type Pointer = { __type: string; className: string; objectId: string };

export type Relation = { __op: string; objects: Array<Pointer> };

export type UploadedFile = {
  file: {
    readonly name: string;
    readonly size: number;
    readonly type: string;
    slice: (start?: number, end?: number) => Blob;
  };
};

export type Image = string; // filePath to Image

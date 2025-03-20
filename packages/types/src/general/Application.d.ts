import { ApolloQueryResult } from "@apollo/client";
export type Params = {
  object_id: string;
  form_id: string;
  code: string;
};

export type PageState = {
  value: string;
  label: string;
  disbaled?: boolean;
};

export type FilterOperator =
  | "_eq"
  | "_ne"
  | "_lt"
  | "_lte"
  | "_gt"
  | "_gte"
  | "_in"
  | "_nin"
  | "_regex";

export type Filter = {
  key: string;
  value: string | Array<string | number> | number | boolean;
  operator: FilterOperator;
  id: string;
};

export type ErrorMessage = {
  id: string;
  key: string;
  message: string;
};

export type SiteState = {
  value: string;
  label: string;
};

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

export type Image = string; // filePath to Image

export type ApolloRefetch = () => Promise<ApolloQueryResult<any>>;

export type NotificationData = {
  type: "ticket" | "task" | "absence";
  id: string;
  action:
    | "task_created"
    | "ticket_created"
    | "task_assigned"
    | "ticket_image_added"
    | "task_image_added"
    | "ticket_comment_added"
    | "task_comment_added"
    | "absence_submitted";
};

export type Notification = {
  title: string;
  body: string;
  image: Image;
  timestamp: string;
  id: string;
  read: boolean;
  data?: NotificationData;
};

export type Response = {
  success: boolean;
  message: string;
  type: string;
  [key: string]: any;
};

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

export type StateColors =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "green"
  | "blue"
  | "yellow";

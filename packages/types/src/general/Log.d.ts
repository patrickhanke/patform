import Module from "module";
import { PatflowProject, PatflowUser } from "../patflow";
import { ModuleClass, PatstoreProject, PatstoreUser } from "../patstore";

export type LogClass = ModuleClass | "Cloud Code";
export type LogType = "info" | "warn" | "error";
export type LogData = {
  [key: string]: any;
};
export type LogMessage = string;
export type LogProject = {
  objectId: string;
  name: string;
};

export type Log = {
  objectId: string;
  type: LogType;
  operation: "create" | "update" | "delete" | "other";
  message: LogMessage;
  class: LogClass;
  data: LogData;
  service: string;
  object_id: string;
  project: PatstoreProject | PatflowProject | null;
  module: Module | null;
  user: PatstoreUser | PatflowUser | null;
};
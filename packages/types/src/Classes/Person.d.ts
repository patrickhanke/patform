import { ClassProperties } from "./Classes";

export type PersonClass = ClassProperties & {
  name: string;
  portrait: string;
};

export type PersonPointer = {
  __type: "Pointer";
  objectId: string;
  className: "Person";
};

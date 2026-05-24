import { DateTypes, UserTypes } from "@/types/General";
import { DateObject, Task, User } from "@repo/types";

export type Property = {
  objectId: string;
  updatedAt: string;
  name: string;
  settings: object;
  created_by: UserTypes.User;
  createdAt: string;
  services: { [key: string]: PropertyServices };
  assigned_staff: string[];
  archived: boolean;
};

export type PropertyService = {
  id: string;
  name: string;
  assigned_staff: string[];
  substitutes: {
    [key: number]: string[];
  };
  service_id: string;
  active: boolean;
  days: string[];
  type: "interval" | "dates";
  dates: `${string}-${string}`[];
  interval: {
    number: number;
    unit: string;
    start_date: string;
    end_date: string;
  };
  settings: {
    continue: boolean;
    repeat: boolean;
  };
};

export type PropertySelect = {
  value: string;
  id: string;
  label: string;
};

export type Service = Task & {
  is_service: true;
};

export type CreateService = Pick<
  Service,
  "name" | "description" | "images" | "is_active" | "assigned_staff"
>;

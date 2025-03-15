import { ApolloRefetch, PropertyService } from "@types";
import { Dispatch, SetStateAction } from "react";
import { AddEditServiceState } from "../../types";

export type AddEditServiceProps = {
  title: string;
  addEditService: AddEditServiceState;
  setAddEditService: Dispatch<SetStateAction<AddEditServiceState | null>>;
  propertyId: string;
  serviceId;
  refetch: ApolloRefetch;
};

export type ServiceDaySelectProps = {
  days: string[];
  onChange: (T: typeof day_elements) => void;
};

export type ServiceIntervalSelectProps = {
  service: PropertyService;
  onChange: (T: typeof day_elements) => void;
};

export type ServiceSettingsProps = {
  service: PropertyService;
  onChange: (T: service) => void;
  showDeleteButton: boolean;
  setDelete: Dispatch<SetStateAction<boolean>>;
};

export type ButtonStates = [
  {
    label: "Frequenz";
    value: "interval";
  },
  {
    label: "Tag";
    value: "day";
    disabled: boolean;
  },
  {
    label: "Einstellungen";
    value: "settings";
  },
];

export type TwoDigitString = `${string}`;
export type DateFormatDDMM = `${TwoDigitString}-${TwoDigitString}`;

export type SelectServiceDateProps = {
  date: DateFormatDDMM;
  onChange: (date: DateFormatDDMM) => void;
  onDelete: () => void;
};

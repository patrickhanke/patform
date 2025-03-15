import { TestTypes, GeneralTypes, TestContent } from "@types";
import { FilterElement } from "./Filter.d";

export type Filter = {
  id: string;
  label: string;
  value: string;
  type: "question" | "factor" | "scale" | undefined;
  dataType: QuestionTypes;
  typeId: string | undefined;
  typeLabel: string | undefined;
  select_options: { value: string; label: string }[] | null;
  operators: {
    condition: { value: string | boolean; label: string } | undefined;
    value?: string | number | boolean;
  };
  dataset?: TestContent.Dataset;
};

export type FilterElement = {
  label: string;
  color?: string;
  value: string | number | boolean | object | undefined;
  dataType: string;
  type: "factor" | "scale" | "question";
};

export type FilterComponent = {
  filterSelectOptions: FilterSelectOption[];
  filters: Filter[];
  setFilters: (filters: Filter[]) => void;
  groupTest: boolean;
  datasetOptions: {
    value: string;
    label: string;
    participants: TestTypes.Participant[];
  }[];
};

export type UpdateFilterProps = {
  id: Filter["id"];
  values: Partial<
    Pick<
      Filter,
      | "dataType"
      | "type"
      | "typeId"
      | "typeLabel"
      | "operators"
      | "operators.condition"
      | "operators.value"
      | "dataset"
    >
  >;
};

export type RenderFilterComponent = {
  filterSelectOptions: FilterComponent["filterSelectOptions"];
  filter: Filter;
  updateFilterHandler: (
    id: UpdateFilterProps["id"],
    values: UpdateFilterProps["values"],
  ) => void;
  deleteFilterHandler: (id: Filter["id"]) => void;
  groupTest: boolean;
  datasetOptions: {
    value: string;
    label: string;
    participants: GeneralTypes.ParticipantTypes.Participant[];
  }[];
};

export const checkForQuestion = (element) => {
  if (element.data.type) {
    return true;
  }
  return false;
};

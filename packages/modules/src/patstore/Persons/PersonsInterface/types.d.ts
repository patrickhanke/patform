import { PersonClass } from "@repo/types";

export type ChangeHandler = (type: "add" | "remove", ID: string) => void;

export type FilterArray = Filter[];

export type PersonsInterfaceComponent = {
  persons: PersonClass["objectId"][];
  onChange: (value: string[]) => void;
  nextDate?: string;
};

export type DisplayPersonInterfaceComponent = {
  person: PersonClass;
  isSelected: boolean;
  onChange: ChangeHandler;
  nextDate?: PersonsInterfaceComponent["nextDate"];
  showAvailability?: boolean;
};

export type UseFindPersonsHook = ({
  moduleId: string,
  filters: FilterArray,
}) => {
  loading: boolean;
  filteredData?: PersonClass[];
  persons: PersonClass[];
  refetch: () => void;
};

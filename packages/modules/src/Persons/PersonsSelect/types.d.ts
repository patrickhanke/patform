import { MultiValue } from "react-select";

export type PersonOption = {
  value: string;
  label: string;
  portrait: string;
};

export type PersonSelectProps = {
  persons: string[];
  isMulti: boolean;
  onChange: (
    values:
      | MultiValue<PersonOption | undefined>
      | SingleValue<PersonOption | undefined>
  ) => void;
};

export type UseFindPersonsHook = ({
  moduleId: string,
  filters: FilterArray,
}) => {
  loading: boolean;
  persons?: Person[];
  refetch: () => void;
};

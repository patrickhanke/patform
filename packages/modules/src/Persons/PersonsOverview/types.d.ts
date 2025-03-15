import { Filter, Person } from "@repo/types";

export type PersonsOverviewProps = {
  projectId: string;
};

export type FilterArray = Filter[];

export type UseFindPersonsHook = ({
  moduleId: string,
  filters: FilterArray,
}) => {
  loading: boolean;
  persons?: Person[];
  refetch: () => void;
};

export type DeleteModalProps = {
  isOpen: boolean;
  confirmButtonHandler: () => void;
  header: string;
};

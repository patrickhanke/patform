import { Filter, GroupClass } from "@repo/types";

export type PersonsOverviewProps = {
  projectId: string;
};

export type FilterArray = Filter[];

export type UseFindGroupHook = ({ moduleId: string, filters: FilterArray }) => {
  loading: boolean;
  groups?: GroupClass[];
  refetch: () => void;
};

export type DeleteModalProps = {
  isOpen: boolean;
  confirmButtonHandler: () => void;
  header: string;
};

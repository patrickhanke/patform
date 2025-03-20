import { Filter, Person } from "@repo/types";

export type PersonsOverviewProps = {
  projectId: string;
};

export type FilterArray = Filter[];

export type UseFindCategoryHook = ({
  moduleId: string,
  filters: FilterArray,
}) => {
  loading: boolean;
  categories?: Person[];
  refetch: () => void;
};

export type DeleteModalProps = {
  isOpen: boolean;
  confirmButtonHandler: () => void;
  header: string;
};

export type CreateCategoryProps = {
  refetch: () => void;
  typeId: string;
  typeLabel: string;
};

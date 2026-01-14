import { Filter } from "@repo/types";

export type UserFindFormHook = (T: { moduleId: string; filters: Filter[] }) => {
  loading: boolean;
  forms?: Array<FormClass>;
  refetch: () => void;
};

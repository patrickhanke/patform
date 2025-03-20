import { ApplicationTypes } from "@repo/types";

export type ViewState = {
  value: "extended" | "compact";
  label: string;
  is_icon: boolean;
};

export type TaskSection = {
  label:
    | "Ab nächster Woche"
    | "Diese Woche"
    | "Überfällig"
    | "Keine Zeitangabe";
  value: "this_week" | "next_week" | "overdue" | "no_date";
  date: string;
  data: DataTypes.Task[];
}[];

export type SiteType = "active" | "closed" | "archived" | "executed";

export type TaskPageState = "active" | "archived" | "completed" | "executed";

export type TasksComponent = {
  id?: string;
  className?: string;
  pageState: TaskPageState;
};

export type useGetTasksHook = {
  id?: string;
  className?: string;
  filters: ApplicationTypes.Filter[];
  siteType: TasksComponent["siteType"];
};

export type SiteHeaderContentComponent = {
  id?: string;
  filters: ApplicationTypes.Filter[];
  setFilters: React.Dispatch<React.SetStateAction<ApplicationTypes.Filter[]>>;
  initialFilters: () => ApplicationTypes.Filter[];
};

export type useInitialFiltersHook = {
  siteType: TasksComponent["siteType"];
};

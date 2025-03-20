import { DateTypes, Task } from "@repo/types";
import date_category_options from "./constants/date_category_options";

export type DateSelectProps = {
  initialValue: Task["times"] | undefined;
  dataHandler: (value: DateTypes.DateObjectWithNextDates) => void;
  setShowSlideIn: React.Dispatch<React.SetStateAction<boolean>>;
  loading?: boolean;
};

export type DateSelectExternalStateProps = {
  date: DateTypes.DateObjectWithNextDates | undefined;
  dataHandler: (value: DateTypes.DateObjectWithNextDates) => void;
};

export type DateCategoriesProps = {
  value: (typeof date_category_options)[number];
  onChange: (value: (typeof date_category_options)[number]) => void;
};

export type SingleDateSelectInterfaceProps = {
  date: DateTypes.DateObjectWithNextDates;
  category: (typeof date_category_options)[number]["value"];
  onChange: (value: DateTypes.DateObjectWithNextDates) => void;
};

export type MultiDateSelectInterfaceProps = {
  date: DateTypes.DateObjectWithNextDates;
  category: (typeof date_category_options)[number]["value"];
  onChange: (value: DateTypes.DateObjectWithNextDates) => void;
};

export type IntervalDateSelectInterfaceProps = {
  date: DateTypes.DateObjectWithNextDates;
  category: (typeof date_category_options)[number]["value"];
  onChange: (value: DateTypes.DateObjectWithNextDates) => void;
};

export type IntervalInfoProps = {
  dates: string[];
};

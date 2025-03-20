import { ApolloRefetch, Holiday, HolidayTemplate } from "@repo/types";

export type EditHolidayTemplateProps = {
  template: HolidayTemplate;
  refetch: ApolloRefetch;
  holidays: Holiday[];
};

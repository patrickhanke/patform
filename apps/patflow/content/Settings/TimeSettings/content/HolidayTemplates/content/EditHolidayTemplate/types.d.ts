import { ApolloRefetch, Holiday, HolidayTemplate } from '@types';

export type EditHolidayTemplateProps = {
    template: HolidayTemplate,
    refetch: ApolloRefetch,
    holidays: Holiday[]
}
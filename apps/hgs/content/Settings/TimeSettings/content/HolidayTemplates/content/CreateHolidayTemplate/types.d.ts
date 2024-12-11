import { ApolloRefetch, Holiday, HolidayTemplate } from '@types';
import React from 'react';

export type CreateHolidayTemplateProps = {
    templates: HolidayTemplate[],
    createTemplate: boolean, 
    setCreateTemplate: React.Dispatch<React.SetStateAction<boolean>>,
    refetch: ApolloRefetch,
    holidays: Holiday[]
}

export type SurchargeDaySelectProps = {
    holidayTemplateChangeHandler: (path: string, value: HolidayTemplate[keyof HolidayTemplate]) => void,
    holidayTemplate: HolidayTemplate,
    holidays: Holiday[]
}
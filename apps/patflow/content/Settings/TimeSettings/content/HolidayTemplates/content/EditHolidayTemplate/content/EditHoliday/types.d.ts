import { ApolloRefetch, Holiday, HolidayTemplate } from '@types';
import React from 'react';

export type EditHolidayProps = {
    template: HolidayTemplate;
    editTemplate: boolean;
    setEditTemplate: React.Dispatch<React.SetStateAction<boolean>>;
    refetch: ApolloRefetch;
    holidays: Holiday[];
};

export type SurchargeDaySelectProps = {
    holidayTemplateChangeHandler: (
        path: string,
        value: HolidayTemplate[keyof HolidayTemplate]
    ) => void;
    holidayTemplate: HolidayTemplate;
    holidays: Holiday[];
};

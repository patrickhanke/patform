import { DateTypes, Task } from '@/types';
import date_category_options from './constants/date_category_options';

export type DateSelectProps = {
    initialValue: Task['times'] | undefined;
    dataHandler: (value: DateTypes.DateObjectWithNextDates) => void;
    setShowSlideIn: React.Dispatch<React.SetStateAction<boolean>>;
    loading?: boolean;
};

export type DateSelectExternalStateProps = {
    initialValue: DateTypes.DateObjectWithNextDates | undefined;
    dataHandler: (value: DateTypes.DateObjectWithNextDates) => void;
};

export type DateCategoriesProps = {
    initialValue: typeof date_category_options[number];
    onChange: (value: typeof date_category_options[number]) => void;
};

export type SingleDateSelectInterfaceProps = {
    initialValue: DateTypes.DateObjectWithNextDates;
    category: typeof date_category_options[number]['value'];
    onChange: (value: DateTypes.DateObjectWithNextDates) => void;
};

export type MultiDateSelectInterfaceProps = {
    initialValue: DateTypes.DateObjectWithNextDates;
    category: typeof date_category_options[number]['value'];
    onChange: (value: DateTypes.DateObjectWithNextDates) => void;
};

export type IntervalDateSelectInterfaceProps = {
    initialValue: DateTypes.DateObjectWithNextDates;
    category: typeof date_category_options[number]['value'];
    onChange: (value: DateTypes.DateObjectWithNextDates) => void;
};

export type IntervalInfoProps = {   
    dates: string[];
};
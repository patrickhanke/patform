import { PageState } from '@repo/types';
import { Field } from '../../Displays';

export type CreateClassProps<T> = {
    initialData?: {[key: keyof T]: any };
    fields: Array<Field>;
    text: string;
    className: string;
    refetch?: () => void;
};

export type PageHeaderButton = {
    text: string,
    onClick: () => void,
    is_add_button?: boolean,
    is_reset_button?: boolean,
    color?: string,
    disabled?: boolean,
}

export type PageHeaderButtons = PageHeaderButton[]

type PageHeaderContent =  React.JSX.Element;

export type PageCreateClassObject = CreateClassProps;

export type PageProps = {
    title?: string, 
    children: React.ReactNode,
    pageHeaderButtons?: PageHeaderButtons,
    pageHeaderContent?: PageHeaderContent, 
    pageStates?: PageState[],
    activeState?: PageState,
    navOnClick?: Dispatch<SetStateAction<PageState>>,
    refetch?: () => void,
    createClass?: PageCreateClassObject,
    emptyContent?: boolean,
};
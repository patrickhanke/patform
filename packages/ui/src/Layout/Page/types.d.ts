import { PageState } from '@repo/types';
import { Field } from '@repo/ui';

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

export type PageCreateClassObject = {
    className: string,
    text: string,
    fields: Field[], 
}

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
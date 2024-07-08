import { PageState } from '@repo/types';

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


export type PageProps = {
    children: React.ReactNode,
    title?: string, 
    pageHeaderButtons?: PageHeaderButtons,
    pageHeaderContent?: PageHeaderContent, 
    hasPageNavigation?: boolean,
    isSubHeader?: boolean,
    emptyContent?: boolean,
    pageStates?: PageState[],
    activeState?: PageState,
    navOnClick?: Dispatch<SetStateAction<PageState>>,
    refetch?: () => void,
    slideInHeader?: string,
	slideInContent?: React.FC,
	slideInIsOpen?: boolean,
	setSlideInIsOpen?: () => false
};
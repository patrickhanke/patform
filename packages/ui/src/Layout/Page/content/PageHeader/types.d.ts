import { PageState } from '@repo/types';
import { Dispatch, SetStateAction } from 'react';

export type PageNavigationProps = {
    pageState: PageState[],
    activeState: PageState,
    onClick: Dispatch<SetStateAction<PageState>>
}

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

export type PageHeaderComponent = {
    title?: string, 
    pageHeaderButtons?: PageHeaderButtons,
    pageHeaderContent?: PageHeaderContent, 
    hasSiteNavigation?: boolean,
    isSubHeader?: boolean,
    emptyContent?: boolean,
    refetch?: () => void
}

export type PageNavigationComponent = {
    items: PageHeaderComponent['navItems'],
    currentItem: PageHeaderComponent['navCurrentItem'],
    onClick: PageHeaderComponent['navOnClick']
}
import { ApplicationTypes } from '@repo/types';
import { Dispatch, SetStateAction } from 'react';

export type SiteState = {
    value: string,
    label: string,
    disabled?: boolean
}

export type PageNavigationProps = {
    siteStates,
    activeState: SiteState,
    onClick: Dispatch<SetStateAction<ApplicationTypes.SiteState>>
}

export type SiteHeaderButton = {
    text: string,
    onClick: () => void,
    is_add_button?: boolean,
    is_reset_button?: boolean,
    color?: string,
    disabled?: boolean,
}

export type SiteHeaderButtons = SiteHeaderButton[]

type SiteHeaderContent =  React.JSX.Element;

export type SiteHeaderComponent = {
    title?: string, 
    siteHeaderButtons?: SiteHeaderButtons,
    siteHeaderContent?: SiteHeaderContent, 
    hasSiteNavigation?: boolean,
    isSubHeader?: boolean,
    emptyContent?: boolean,
    refetch?: () => void
}

export type SiteNavigationComponent = {
    items: SiteHeaderComponent['navItems'],
    currentItem: SiteHeaderComponent['navCurrentItem'],
    onClick: SiteHeaderComponent['navOnClick']
}
import { ApplicationTypes } from '@repo/types';

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


export type PageProps = {
    children: React.ReactNode,
    title?: string, 
    siteHeaderButtons?: SiteHeaderButtons,
    siteHeaderContent?: SiteHeaderContent, 
    hasSiteNavigation?: boolean,
    isSubHeader?: boolean,
    emptyContent?: boolean,
    siteStates?: ApplicationTypes.SiteState[],
    activeState?: ApplicationTypes.SiteState,
    navOnClick?: Dispatch<SetStateAction<ApplicationTypes.SiteState>>,
    refetch?: () => void
};
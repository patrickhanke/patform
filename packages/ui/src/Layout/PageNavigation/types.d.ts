import { Dispatch, SetStateAction } from "react"

export type SiteState = {
    value: string
    label: string
}


export type PageNavigationProps = {
    siteStates,
    activeState: SiteState,
    onClick: Dispatch<SetStateAction<{ value: string; label: string; }>>
}
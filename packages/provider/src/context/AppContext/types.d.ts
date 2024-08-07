import { Project } from '@repo/types';

export type ContextValues = {
    pageTitle: sting,
    setPageTitle: Dispatch<SetStateAction<() => void>>,
    projects: Project[]
}



import { Module, Project } from '@repo/types';

export type ContextValues = {
    project: Project | undefined,
    loadProject: (projectId: string) => void
}

export type ProjectLoaderProps = {
    loading: boolean,
    error?: any,
    project?: Project | undefined
}

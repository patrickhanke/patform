import { Module, Project, Response } from '@repo/types';
import { Context } from 'react';

export type DataContextProps = Context<{
    feedbackHandler: (response: Response) => void,
    loadingHandler: (loadingValue: boolean) => void
}>



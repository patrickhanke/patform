import { Project } from './Project';

type GeneralTemplate = {
    objectId: string;
    name: string;
    project: Project;
}

export type HolidayTemplate = GeneralTemplate & {
    type: 'holiday';
    holidays: string[];
}
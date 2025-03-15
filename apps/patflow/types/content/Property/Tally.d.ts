import { UserTypes } from '@/types/General';
import { Property } from './Property';

export type Tally = {
    objectId: string;
    name: string;
    description: string;
    entries: Entry[];
    object: Property;
};

export type Entry = {
    id: string;
    value: number;
    user: UserTypes.Worker['objectId'];
    date: string;
    comment: string;
};

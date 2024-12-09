import { DateTypes, UserTypes } from '@/types/General';
import { User } from '@/types';

export type Property = {
    objectId: string, 
    name: string,
    settings: object,
    created_by: UserTypes.User
    createdAt: string
}

export type PropertyService = {
    objectId: string, 
    time: DateTypes.DateObject,
    name: string,
    interval: string,
    active: boolean,
    period: {
        start: string,
        end: string
    }
    worker: User
}

export type PropertySelect = {
    value: string,
    id: string,
    label: string
}
import { DateTypes, UserTypes } from '@/types/General';
import { DateObject, User } from '@types';

export type Property = {
    objectId: string, 
    name: string,
    settings: object,
    created_by: UserTypes.User
    createdAt: string
    services: {[key: string]: PropertyServices}
}

export type PropertyService = {
    id: string,
    serviceId: string, 
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

export type Service = {
    objectId: string,
    name: string,
    created_by: User,
    description: string,
    assigned_staff: string[],
    images: string[],
    is_active: boolean,
    dates: string[],
    time: DateObject,
    project: string,
    property: string
}

export type CreateService = Pick<Service, 'name' | 'description' | 'images' | 'is_active' | 'assigned_staff' >
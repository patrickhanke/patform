import { MapPlace } from '@repo/ui';
import { ClassProperties } from './Classes';

export type EventLocation = {
    type: 'address' | 'map' | 'online',
    address?: string,
    map?: MapPlace | null,	
    online?: string
}

export type EventDate = {
    label: string,
    start: string,
    end: string,
    location: EventLocation,
    full_day: boolean,
    id: string
}

export type EventClass = ClassProperties & {
    title: string,
    dates: EventDate[],
    location: string,
    description: string,
    image: string,
}
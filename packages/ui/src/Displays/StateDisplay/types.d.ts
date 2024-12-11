import { IconTypes } from '../Icon';
import { TypeSelection } from './types.d';
import { TaskTypes, AbsenceTypes, UserTypes, TicketTypes, DayTime } from '@types';

type Options<T> = 
    T extends 'Absence' ? typeof absence_state_options : 
    T extends 'Task' ? typeof task_state_options : 
    T extends 'AbsenceType' ? typeof absence_type_options : 
    T extends 'Role' ? UserTypes.UserRole : 
    T extends 'DayTime' ? typeof daytime_state_options : 
    T extends 'TicketState' ? typeof ticket_state_options : never;

export type TypeSelection = 'Absence' | 'Task' | 'AbsenceType' | 'Role' | 'TicketState' | 'Ticket' | 'DayTime';

export type State<T> = 
    T extends 'Absence' ?  AbsenceTypes.Absence['state'] : 
    T extends 'Task' ? TaskTypes.Task['state'] : 
    T extends 'AbsenceType' ? AbsenceTypes.Absence['type'] : 
    T extends 'Role' ? UserTypes.UserRole['type'] : 
    T extends 'TicketState' ? TicketTypes.Ticket['state'] :
    T extends 'DayTime' ? DayTime['state'] : never;

export type CustomOptions = {
    value: string, 
    label: string, 
    color?: string, 
    onClick: () => void,
    disabled?: boolean
}[];

export type UseGetState = <T extends TypeSelection>(type: T, state: State<T>, roles: UserTypes.UserRole[]) => ({
    stateObject: Options<T>[number],
    options: Options<T>
})

export type StateDisplayComponent<T> = T extends 'state' ? {
    type: TypeSelection,
    state: State<S>,
    label?: string,
    color?: string,
    icon?: IconTypes,
    displayInterface?: boolean,
    stateSelectHandler?: (state: State) => void,
    noBackground?: boolean,
    onClick?: () => void,
    customOptions?: CustomOptions;
    width?: number | string
} : {
    type?: TypeSelection,
    state?: State<S>,
    label: string,
    color: string,
    icon?: IconTypes,
    displayInterface?: boolean,
    stateSelectHandler?: (state: State) => void,
    noBackground?: boolean,
    onClick?: () => void,
    customOptions?: CustomOptions;
    width?: number | string
}
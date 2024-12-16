import { IconTypes } from '../Icon';
import { TypeSelection } from './types.d';
import { UserTypes } from '@types';

type Options<T> = 
    T extends 'Absence' ? typeof absence_state_options : 
    T extends 'Task' ? typeof task_state_options : 
    T extends 'AbsenceType' ? typeof absence_type_options : 
    T extends 'Role' ? UserTypes.UserRole : 
    T extends 'DayTime' ? typeof daytime_state_options : 
    T extends 'TicketState' ? typeof ticket_state_options : never;


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

export type State = {
    value: string | object | number, 
    id?: string,
    label: string,
    color?: string
}

export type StateDisplayBasic = {
    color?: string,
    icon?: IconTypes,
    displayInterface?: boolean,
    stateSelectHandler?: (state: State['value']) => void,
    noBackground?: boolean,
    onClick?: () => void,
    width?: number | string
}

export type StateDisplayLabel = 
    StateDisplayBasic & {
        type: 'label',
        state?: null,
        stateOptions?: null,
        label: string,
        customOptions?: CustomOptions
    }

export type StateDisplayOptions = 
    StateDisplayBasic & {
        type: 'state',
        label?: null,
        state: State['value'],
        stateOptions: State[],
        customOptions?: null
    } 

export type StateDisplayProps = (StateDisplayOptions | StateDisplayLabel)

export type UseGetState = (T: {state: State, states: State[]}) => {
    stateObject: State,
    options: State[]
}
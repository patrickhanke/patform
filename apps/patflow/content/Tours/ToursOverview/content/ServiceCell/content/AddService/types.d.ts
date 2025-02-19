import { ApolloRefetch, PropertyService } from "@types";
import { Dispatch, SetStateAction } from "react";

export type AddServiceProps = {
    title: string,
    addService: boolean,
    setAddService: Dispatch<SetStateAction<boolean>>,
    propertyId: string,
    serviceId,
    refetch: ApolloRefetch
}

export type ServiceDaySelectProps = {
    days: string[], 
    onChange: (T: typeof day_elements) => void
}

export type ServiceIntervalSelectProps = {
    service: PropertyService,
    onChange: (T: typeof day_elements) => void
}

export type ServiceSettingsProps = {
    service: PropertyService,
    onChange: (T:service) => void
}

export type ButtonStates = [
    {
        label: 'Frequenz',
        value: 'interval',
    },{
        label: 'Tag',
        value: 'day',
        disabled: boolean
    },{
        label: 'Einstellungen',
        value: 'settings',
    }
]

export type TwoDigitString = `${string}`;
export type DateFormatDDMM = `${TwoDigitString}-${TwoDigitString}`;


export type SelectServiceDateProps = {
    date: DateFormatDDMM,
    onChange: (date: DateFormatDDMM) => void,
    onDelete: () => void
}
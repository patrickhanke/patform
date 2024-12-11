import { Holiday, Surcharge } from '@types';
import { Dispatch, SetStateAction } from 'react';

export type  CreateSurchargeProps = {
    surcharge: Surcharge | null
    createSurcharge: boolean,
    setCreateSurcharge: Dispatch<SetStateAction<boolean>>,
    updateSurchargeHandler: (newSurcharge: Surcharge) => Promise<void>,
    setEditSurcharge: Dispatch<SetStateAction<Surcharge | null>>,
    holidays: Holiday[]
}

export type DaysToSelect = {
    label: string,
    value: string
}

export type SurchargeTimeEditProps = {
    surchargeChangeHandler: (path: string, value: Surcharge[keyof Surcharge]) => void,
    newSurcharge: Surcharge
}

export type SurchargeDayEditProps = {
    newSurcharge: Surcharge,
    holidays: Holiday[],
    surchargeChangeHandler: (path: string, value: Surcharge[keyof Surcharge]) => void
}

export type SurchargeDaySelectProps = {
    surchargeChangeHandler: (path: string, value: Surcharge[keyof Surcharge]) => void,
    newSurcharge: Surcharge,
    holidays: Holiday[]
}

export type SurchargeOvertimeEditProps = {
    surchargeChangeHandler: (path: string, value: Surcharge[keyof Surcharge]) => void,
    newSurcharge: Surcharge
}
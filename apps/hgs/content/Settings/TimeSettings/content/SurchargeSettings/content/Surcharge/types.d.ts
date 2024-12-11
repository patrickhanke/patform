import { Surcharge } from '@types';
import { Dispatch, SetStateAction } from 'react';

export type SurchargeComponentProps = {
    surcharge: Surcharge,
    updateSurchargeHandler: (surcharge: Surcharge) => Promise<void>,
    setEditSurcharge: Dispatch<SetStateAction<Surcharge | null>>,
    setDeleteSurcharge: Dispatch<SetStateAction<Surcharge | null>>

}
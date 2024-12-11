import { ApolloRefetch, Surcharge } from '@types';
import { Dispatch, SetStateAction } from 'react';

export type ArchiveSurchargeProps = {
    deleteSurcharge: Surcharge | null, 
    setDeleteSurcharge: Dispatch<SetStateAction<Surcharge | null>>, 
    refetch: ApolloRefetch
}
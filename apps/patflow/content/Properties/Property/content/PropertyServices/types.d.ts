import { Dispatch, SetStateAction } from 'react';

export type PropertyServicesProps = {
    objectId: string;
    addService: boolean;
    setAddService: Dispatch<SetStateAction<boolean>>;
};

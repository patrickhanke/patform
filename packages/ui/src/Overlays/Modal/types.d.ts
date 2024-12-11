import { ReactNode } from 'react';
import { ErrorMessage } from '@repo/types';

export type ModalProps = {
    children: ReactNode,
    header: string,
    isOpen: boolean,
    cancelButtonHandler: ()=> void,
    confirmButtonHandler: () => void,
    buttonDisabled?: boolean[],
    errors?: ErrorMessage[]
}
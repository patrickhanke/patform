import { ReactNode } from "react"

export type ModalComponent = {
    children: ReactNode,
    header: string,
    isOpen: boolean,
    cancelButtonHandler: ()=> void,
    confirmButtonHandler: () => void,
    buttonDisabled?: boolean[]
}
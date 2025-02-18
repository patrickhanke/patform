import { Dispatch, SetStateAction } from "react";

export type AddServiceProps = {
    addService: boolean;
    setAddService: Dispatch<SetStateAction<boolean>>;
}

export type ServiceDaySelectProps = {
    day: typeof day_elements[number], 
    onChange: (T: typeof day_elements) => void
}
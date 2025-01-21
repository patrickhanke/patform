import React from 'react';

export type SwitchButton = {
    value: string | number | boolean,
    label: string,
    disabled?: boolean,
    is_icon?: boolean
}

export type SwitchButtonProps = {
    buttonStates: Array<SwitchButton>,
    currentStates: SwitchButton,
    changeHandler: React.SetStateAction.Dispatch<SwitchButton>,
    underlineButtons?: boolean
}
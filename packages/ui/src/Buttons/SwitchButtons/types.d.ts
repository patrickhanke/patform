type ButtonState = {
    value: string,
    label: string,
    disabled?: boolean
};

export type SwitchButtonsProps = {
    buttonStates: Array<ButtonState & any>,
    currentStates: ButtonState,
    changeHandler: (T: ButtonState) => void,
    underlineButtons?: boolean
};
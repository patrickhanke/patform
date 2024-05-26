export type SwitchButtonsProps = {
    buttonStates: Array<{value: string, label: string, disabled?: boolean} & any>,
    currentStates: {value: string, label: string},
    changeHandler: (T: {value: string, label: string, disabled?: boolean}) => void,
    underlineButtons?: boolean
}
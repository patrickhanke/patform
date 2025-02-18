import React, { FC, useState } from 'react'
import { AddServiceProps } from './types'
import { Modal, SwitchButtons } from '@repo/ui'
import { set } from 'lodash';
import button_states from './constants/button_states';

const AddService: FC<AddServiceProps> = ({addService, setAddService}) => {
    const [addServiceState, setAddServiceState] = useState('')
    const [service, setService] = {

    }
    const [buttonState, setButtonsState] = useState<typeof button_states[number]>(button_states[0] as typeof button_states[number])
    return (
        <Modal
            header='Service hinzufügen'
            isOpen={addService} 
            cancelButtonHandler={() => setAddService(false)}
            confirmButtonHandler={() => setAddService(false)}
        >
            <div>
                <SwitchButtons
                    buttonStates={button_states}
                    changeHandler={setButtonsState}
                    currentStates={buttonState}
                    underlineButtons
                
                />
            </div>
        </Modal>
    )
}

export default AddService
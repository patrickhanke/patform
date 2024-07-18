import React from 'react'
import { SlideIn } from '@repo/ui'
import { AppModuleEditFieldsProps } from '../types'

const AppModuleEditFields = ({fields}: AppModuleEditFieldsProps) => {
    const [editFields, setEditFields] = React.useState(false)
  
    return (
    <div>
        <button onClick={() => setEditFields(true)}>
            Felder bearbeiten
        </button>
        <SlideIn
        cancel={() => setEditFields(false)}
        confirm={() => setEditFields(false)}
        isOpen={editFields}
        header='Felder bearbeiten'
        >
            <div>
                <p>
                    Felder bearbeiten
                </p>
            </div>

            </SlideIn>

    </div>
  )
}

export default AppModuleEditFields
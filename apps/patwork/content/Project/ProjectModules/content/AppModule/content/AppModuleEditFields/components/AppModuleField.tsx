import { IconButton } from '@repo/ui'

import '../styles.scss'
import { AppModuleFieldProps } from '../types'

const AppModuleField = ({field, setActiveField}: AppModuleFieldProps) => {

  return (
    <div className='app_module_field_container'>
        <div>
            <h3>
                {field.label}
            </h3>
        </div>
        <div className='button_container'>
            <IconButton
                icon='edit'
                onClick={() => setActiveField(field.id)}
            />
            <IconButton
                icon='delete'
                onClick={() => null}
            />
        </div>
    </div>
  )
}

export default AppModuleField
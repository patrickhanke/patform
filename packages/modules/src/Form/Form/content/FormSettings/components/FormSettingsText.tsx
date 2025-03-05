import { FC } from 'react'
import { Editor } from '@repo/ui'
import { FormSettingsTextProps } from '../types'

const FormSettingsText: FC<FormSettingsTextProps> = ({settings, updateSettings}) => {
    return (
        <div>
            <Editor
                content={settings.notification_text || ''}
                onChange={(value) => updateSettings({
                    ...settings,
                    notification_text: value
                })}
                placeholder='Benachrichtigungstext'
                label='Benachrichtigungstext'
                disabled={settings['response'] === false}
            />
        </div>
    )
}

export default FormSettingsText
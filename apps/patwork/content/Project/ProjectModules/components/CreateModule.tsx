import React, { useMemo, useState } from 'react'
import { CreateModuleProps, ModuleOptionsField, ModuleOptionsKeys, SelectModule } from '../types';
import { Modal, Select } from '@repo/ui';
import { module_option_fields } from '../constants/module_option_fields';
import { useDebounceValue } from 'usehooks-ts';

const CreateModule: React.FC<CreateModuleProps> = ({createModule, setCreateModule, createModuleHandler, modules = []}) => {
    const [selectedModule, setSelectedModule] = useState<SelectModule | null>(null);
    const [moduleName, setModuleName] = useDebounceValue<string>(selectedModule?.label || '', 2000);
    const modalSelectOptions : SelectModule[] = useMemo(() => (Object.keys(module_option_fields) as Array<keyof ModuleOptionsField>).map((moduleFieldKey) => ({
        value: moduleFieldKey,
        label: module_option_fields[moduleFieldKey].name,
        fields: module_option_fields[moduleFieldKey],
        disabled: modules.find((module) => module.path === module_option_fields[moduleFieldKey].path) ? true : false
    })), []);

    const [loading, setLoading] = useState(false);

     return (
        <Modal
            header='Neues Modul erstellen'
            isOpen={createModule}
            cancelButtonHandler={() => setCreateModule(false)}
            confirmButtonHandler={async () =>{ 
                setLoading(true)
                await createModuleHandler({
                    ...selectedModule?.fields,
                    name: moduleName
                })
                setLoading(false)
                setCreateModule(false)
            }}
            buttonDisabled={[loading, (!selectedModule || !moduleName || loading)]}
        >
            <div className='vertical_container'>
                <p>
                    Neues Modul erstellen
                </p>
                <Select
                    id='module_select'
                    value={selectedModule}
                    onChange={(value) => setSelectedModule(value)}
                    options={modalSelectOptions}
                    placeholder='Modul auswählen'
                />
                <input
                    defaultValue={selectedModule?.label}
                    onChange={(e) => setModuleName(e.target.value)}
                />
            </div>
        </Modal>
    )
}

export default CreateModule
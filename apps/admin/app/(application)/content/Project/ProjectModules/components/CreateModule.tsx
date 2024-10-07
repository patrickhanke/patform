import React, { useMemo, useState } from 'react'
import { CreateModuleProps, SelectModule } from '../types';
import { Modal, Select } from '@repo/ui';
import { module_option_fields } from '../constants/module_option_fields';
import { useDebounceValue } from 'usehooks-ts';

const CreateModule: React.FC<CreateModuleProps> = ({createModule, setCreateModule, createModuleHandler, modules}) => {
    console.log(modules);
    
    
    const [selectedModule, setSelectedModule] = useState<SelectModule | null>(null);
    const [moduleName, setModuleName] = useDebounceValue<string>(selectedModule?.label || '', 2000);
    const modalSelectOptions : SelectModule[] = useMemo(() => [
        {
            value: '/website', 
            label: 'Webseite',
            fields: module_option_fields['/website'],
            isDisabled: modules.find(module => module.path === '/website')
        },
        {
            value: '/events', 
            label: 'Events',
            fields: module_option_fields['/events'],
            isDisabled: modules.find(module => module.path === '/events')
        },
        {
            value: '/news', 
            label: 'News',
            fields: module_option_fields['/news'],
            isDisabled: modules.find(module => module.path === '/news')
        },
        {
            value: '/categories', 
            label: 'Kategorien',
            fields: module_option_fields['/categories'],
            isDisabled: modules.find(module => module.path === '/categories')
        },
        {
            value: '/persons', 
            label: 'Personen',
            fields: module_option_fields['/persons'],
            isDisabled: modules.find(module => module.path === '/persons')
        },
        {
            value: '/images', 
            label: 'Bilder',
            fields: module_option_fields['/images'],
            isDisabled: modules.find(module => module.path === '/images')
        },
    ], []);
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
const fieldTypes = [
    {
        value: 'input',
        label: 'Text'
    },
    {
        value: 'url',
        label: 'URL'
    },
    {
        value: 'number',
        label: 'Number'
    },
    {
        value: 'password',
        label: 'Password'
    },
    {
        value: 'textarea',
        label: 'Textarea'
    },
    {
        value: 'select',
        label: 'Select'
    }
] as const;

export default fieldTypes;
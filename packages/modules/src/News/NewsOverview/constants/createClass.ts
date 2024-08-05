import { PageCreateClassObject } from '@repo/ui';
const createClass: PageCreateClassObject = {
    className: 'News',
    text: 'Neue News erstellen',
    fields: [{
        id: 'title',
        position: 1,
        name: 'title',
        type: 'input',
        label: 'Name',
        validation: 'string_required'
    },
    {
        id: 'image',
        position: 2,
        name: 'image',
        type: 'image',
        label: 'Bild',
        options: {
            return_type: 'string',
            max_file_count: 1
        }
    }, 
    {
        id: 'text',
        position: 3,
        name: 'text',
        type: 'textarea',
        label: 'Beschreibung',
        validation: 'string_required'
}]}

export default createClass;
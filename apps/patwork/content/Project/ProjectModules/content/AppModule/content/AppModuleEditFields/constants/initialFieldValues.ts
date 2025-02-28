import { FieldTypes } from '@repo/ui';

const initialFieldValues = {
    name: 'neuesfeld' as string,
    type: 'input' as FieldTypes,
    label: 'Neues Feld',
    required: false,
    select_options: [],
    options: {
        number_start_value: 0 as number,
        number_end_value: 100 as number,
    }
};

export default initialFieldValues;
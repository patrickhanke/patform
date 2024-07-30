import {v4} from 'uuid';
import { FieldTypes } from '@repo/types';

const initialFieldValues = {
    name: 'neuesfeld' as string,
    type: 'input' as FieldTypes,
    label: 'Neues Feld',
    required: false,
    options: {
        number_start_value: 0 as number,
        number_end_value: 100 as number,
    }
};

export default initialFieldValues;
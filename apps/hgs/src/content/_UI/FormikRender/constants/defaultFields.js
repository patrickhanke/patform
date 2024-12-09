import { getIsoFromDate } from '@provider';
import * as Yup from 'yup';

const defaultFields = [
	{
		id: 'someId',
		label: 'someLabel',
		name: 'someName (Name für den Datenpunkt auf der Datenbank)',
		type: 'date',
		initialValue: getIsoFromDate(new Date()),
		fieldProps: undefined,
		dataType: 'date',
		validation: Yup.string().required('Pflichtfeld'),
		props: {showAsButton: true}
	},
	{
		id: 'someId',
		label: 'someLabel',
		name: 'someName (Name für den Datenpunkt auf der Datenbank)',
		initialValue: '',
		type: 'editor',
		placeholder: 'somePlaceHolder',
		dataType: 'string (can be Object)'
	},
	{
		id: 'someId',
		label: 'someLabel',
		name: 'someName (Name für den Datenpunkt auf der Datenbank)',
		initialValue: '',
		placeholder: 'Staffelleiter*in',
		fieldProps: undefined,
		dataType: 'string',
	},
	{
		id: 'someId',
		label: 'someLabel',
		name: 'someName (Name für den Datenpunkt auf der Datenbank)',
		type: 'file',
		initialValue: undefined,
		dataType: 'object (Can also be string)',
		fieldProps: {
			isMulti: true
		}
	}
];
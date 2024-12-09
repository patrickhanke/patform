import { Dispatch, SetStateAction } from 'react';

export type CalendarHeaderProps = {
    view: ViewState,
    setView: (value: ViewState) => void,
	intervalIndex: number,
	setIntervalIndex: Dispatch< SetStateAction<number>>
};


export type ViewState = {
	value: 'monthly' | 'quaterly', 
	label: string,
	is_icon: boolean
};

export type IntervalSelectOptions = {
	value: number, 
	label: string
}[]
import { ErrorDisplay } from '@/_UI';
import { ApplicationTypes } from '@/types';
import React, { useEffect, useRef } from 'react';

const TextInput = ({
	label, 
	type, 
	id, 
	onChange, 
	errors,
	defaultValue,
	isTextArea = false,
	width = 'auto',
	onBlur,
	min,
	max,
	placeholder
}: {
    label?: string, 
    type?: HTMLInputElement['type'], 
    id: string, 
	defaultValue?: string | number,
	onChange: (e: string) => void, 
	errors?: ApplicationTypes.ErrorMessage[],
	isTextArea?: boolean,
	width?: string,
	onBlur?: () => void,
	min?: number,
	max?: number,
	placeholder?: string
}) => {
	const inputRef = useRef(null as unknown as HTMLInputElement);
	const textareaRef = useRef(null as unknown as HTMLTextAreaElement);
	
	useEffect(() => {
		if (defaultValue === '' && inputRef.current && inputRef?.current?.value !== '') {
			inputRef.current.value = '';
		}
		if (defaultValue === '' && textareaRef.current && textareaRef?.current?.value !== '') {
			textareaRef.current.value = '';
		}
	}, [defaultValue]);
	
	return (
		<>
			{label && <label htmlFor={id}>
				{label}				
			</label>}
			{isTextArea ?
				<textarea
					ref={textareaRef}
					defaultValue={defaultValue}
					id={id}
					onChange={(e) => onChange(e.target.value)}
					style={{width}}
					onBlur={onBlur}
					placeholder={placeholder ? placeholder : ''}
				>
				</textarea> 
				:
				<input
					ref={inputRef}
					defaultValue={defaultValue}
					id={id}
					onChange={(e) => onChange(e.target.value)}
					type={type ? type : 'text'}
					style={{width}}
					onBlur={onBlur}
					min={min}
					max={max}
					placeholder={placeholder ? placeholder : ''}
				>
				</input>
			}
			<ErrorDisplay errors={errors} id={id} />
		</>
	);};
  


export default TextInput;
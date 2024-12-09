import React, { useEffect } from 'react';
import { FieldInputProps, useField } from 'formik';
import { IconButton } from '@/_UI/interfaces';
import { FieldBasic } from '@/types';

interface TimeInputFieldProps {
    field: FieldInputProps<number>;
    name: string;
}

const TimeInputField: React.FC<TimeInputFieldProps> = ({name, field}) => {
	const [_, meta, helpers] = useField(name);
	const [isPlus, setIsPlus] = React.useState<boolean>(true);
	const [hours, setHours] = React.useState<number>(Math.floor(field.value / 60));
	const [minutes, setMinutes] = React.useState<number>(Math.floor(field.value % 60));

	useEffect(() => {
		const totalMilliseconds = (hours * 60 + minutes) * 60000;
		helpers.setValue(isPlus ? totalMilliseconds : -totalMilliseconds);
	}, [hours, minutes, isPlus]);

	console.log('field', field);
	

	return (
		<div>
			<div className='button_container'>
				<div>
					{isPlus ?
						<IconButton
							color={'green'}
							noBorder
							icon='plus'
							onClick={() => setIsPlus(false)}
						/>
						:
						<IconButton
							color={'red'}
							noBorder
							icon='minus'
							onClick={() => setIsPlus(true)}
						/>
					}
				</div>
				<input
					type="number"
					id={`${name}-hours`}
					value={hours}
					onChange={e => setHours(parseInt(e.target.value, 10)) }
					placeholder="Hours"
					style={{width: '60px'}}
					min={0}
					max={999}
				/>
				<span>:</span>
				<input
					type="number"
					id={`${name}-minutes`}
					value={minutes}
					onChange={e => setMinutes(parseInt(e.target.value, 10))}
					placeholder="Minutes"
					style={{width: '48px'}}
					min={0}
					max={59}
				/>
			</div>
			{meta.touched && meta.error ? (
				<div className="error">{meta.error}</div>
			) : null}
		</div>
	);
};

export default TimeInputField;
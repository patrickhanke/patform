import { get } from 'lodash';
import React from 'react';
import styles from '../RenderFields.module.scss';
import Slider from 'rc-slider';
import { SliderComponent } from '@/types';
import 'rc-slider/assets/index.css';

const colors = {
	primary: '#6941c6',
	grey: '#999999'
}; 

const handle = {
	borderColor: colors.primary
};

const SliderField = ({field, values, getFieldMeta, setFieldValue}: SliderComponent) => {
	return (
		<>
			<div className={styles.slider_container}>
				<Slider 
					// name={field.name}
					value={get( values, field.name, '' )}
					step={field?.options?.steps || 1}
					min={field?.options?.number_start_value}
					max={field?.options?.number_end_value}
					onChange={(value: number) => setFieldValue(field.name, value)} 
					onBlur={(e: Event) => console.log(e)}
					key={field.name}
					styles={{
						handle: handle,
						track: {
							background: get( values, field.name, undefined ) ? '#6941c6' : '#999999'
						} 
					}}
					activeDotStyle={{
						borderColor: colors.primary
					}}
					
					// className={styles.slider}
				/>
				<div className={styles.slider_container_bottom}>
					{field?.options?.start_label ? 
						<p>
							{field.options.start_label}
						</p>
						: 
						<p>
							trifft nicht zu
						</p>
					}
					
					<p>Wert: {get( values, field.name, '-' ) } </p>
					{field?.options?.start_label ?  
						<p>
							{field.options.end_label}
						</p> 
						: 
						<p>
							trifft voll zu
						</p>
					}
				</div>				
			</div>
			{getFieldMeta(field.name).touched && getFieldMeta(field.name).error ? 
				<div className={styles.error_message}>{getFieldMeta(field.name).error}</div>
				: 
				null
			}
		</>
	);
};

export default SliderField;
import React from 'react';
import { SurchargeComponentProps } from './types';
import { IconButton } from '@/content/_UI';
import { getDateString } from '@/provider';
import clsx from 'clsx';
import styles from './Surcharge.module.scss';
import surcharge_types from '../CreateSurcharge/constants/surcharge_types';

const Surcharge: React.FC<SurchargeComponentProps> = ({surcharge, setEditSurcharge, setDeleteSurcharge}) => {
	return (
		<div className={clsx('content_element', styles.surcharge_container )}>
			<div className={styles.surcharge_content}>
				<div style={{width: '200px'}}>
					<h3>{surcharge.name}</h3>
				</div>
				<div className='button_container' style={{width: '120px'}}>
					<label className='button_container no_margin'>
						Typ:
					</label>
					<p>{surcharge_types.find(type => type.value === surcharge.type)?.label}</p>
				</div>
				<div className='button_container'>
					<label className='button_container no_margin'>
						Status:
					</label>
					<p>{surcharge.active ? 'Aktiv' : 'Inaktiv'}</p>
				</div>
				<div className='button_container'>
					<label>
						Startdatum: 
					</label>
					<p >{getDateString(new Date( surcharge.start_date)).date}</p>
				</div>
				<div className='button_container'>
					<label>
						Enddatum: 
					</label>
					<p>{surcharge.end_date ?  getDateString(new Date( surcharge.end_date)).date : '-'}</p>
				</div>
				<div className='button_container'>
					<IconButton
						icon='edit'
						onClick={() => {
							setEditSurcharge(surcharge);
						}}
					/>
					<IconButton
						icon='archive'
						onClick={() => {
							setDeleteSurcharge(surcharge);
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default Surcharge;
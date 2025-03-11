import { CreateButton, DatePicker, Select, SwitchButtons } from '@repo/ui'
import React, { FC, useCallback, useMemo } from 'react'
import { ServiceIntervalSelectProps } from '../types'
import styles from '../AddEditService.module.scss'
import { formatISO9075 } from 'date-fns'
import { cloneDeep, set } from 'lodash-es'
import SelectServiceDate from './SelectServiceDate'
import { PropertyService } from '@types'

const buttonStates = [
  {label: 'Intervall', value: 'interval'},
  {label: 'Festgelegtes Datum', value: 'dates'}
]

const ServiceIntervalSelect: FC<ServiceIntervalSelectProps> = ({service, onChange}) => {
  const intervalSelectOptions = useMemo(() => [
      {
        value: 'weeks',
        label: 'Wochen'
      },{
        value: 'months',
        label: 'Monate'
      }
    ], [])

    const dateTransformHandler = useCallback((key: 'start_date' | 'end_date' | 'interval.number' | 'interval.unit', value: string | number) => {
		const serviceCopy = {
			...service
		};

		if (key) {
			set(serviceCopy, `interval.${key}`, value);
		}

		onChange(serviceCopy);
	}, [service]);

  return (
    <div>
      <div className={styles.interval_container}>
        <SwitchButtons 
          buttonStates={buttonStates}
          changeHandler={(value: typeof buttonStates[number]) => {
            console.log(value);
            const settingsCopy = cloneDeep(service.settings);

            if (value.value === 'interval') {
                settingsCopy.repeat = false;
                settingsCopy.continue = true;
            }
            if (value.value === 'dates') {  
                settingsCopy.repeat = true;
                settingsCopy.continue = false;
            }

            onChange({
              ...service,
              type: value.value,
              settings: settingsCopy
            })
          }}
          currentStates={buttonStates.find(state => state.value === service.type) as typeof buttonStates[number]}
        />
			{ service.type === 'interval' && (
                <div>
                    <DatePicker
                        defaultValue={service.interval.start_date ? service.interval.start_date : ''}
                        onChange={value => dateTransformHandler('start_date', value)}
                        type='week'
                        label='Startwoche auswählen'
                        id='week'
                    />
                    <DatePicker
                        defaultValue={service.interval.end_date ? formatISO9075(new Date(service.interval.end_date), {representation: 'date'}) : ''}
                        onChange={value => dateTransformHandler('end_date', value)}
                        type='week'
                        label='Endwoche auswählen (optional)'
                        id='week'
                    />
                    <div>
                        <label>Intervall festlegen</label>
                        <div className='button_container'>
                            <input
                                type='number'
                                value={service.interval.number}
                                onChange={(e) =>{
                                    const serviceCopy = cloneDeep(service);
                                    set(serviceCopy, 'interval.number', Number(e.target.value));
                                    onChange(serviceCopy)
                                }}
                                style={{width: '54px', margin: '0 0.5px'}}
                            />
                            <Select
                                // label='Interval'
                                options={intervalSelectOptions}
                                value={service.interval.unit}
                                onChange={value => {
                                    const serviceCopy = cloneDeep(service);
                                    set(serviceCopy, 'interval.unit',value);
                                    onChange(serviceCopy)
                                }}
                                isClearable={false}
                            />
                        </div>
                    </div>
                </div>
            )}
            {service.type === 'dates' && (
                <div className={styles.date_container}>
                    {service.dates.map((date: PropertyService['dates'][number], index: number) => (
                        <SelectServiceDate
                            date={date}
                            onChange={(value) => {
                                const serviceCopy = cloneDeep(service);
                                serviceCopy.dates[index] = value;
                                onChange(serviceCopy)
                            }}
                            onDelete={() => {  
                                const serviceCopy = cloneDeep(service);
                                serviceCopy.dates.splice(index, 1);
                                onChange(serviceCopy)
                            }}
                        />
                    ))}
                <CreateButton
                    text='Neues Datum hinzufügen'
                    size='small'
                    onClick={() =>{ 
                        const serviceCopy = cloneDeep(service);
                        serviceCopy.dates.push('01-01');    
                        onChange(serviceCopy)
                    }}
                    disabled={service.dates.filter((val, i) => service.dates.includes(val, i + 1)).length > 0}
                />
                </div>
            )}
        </div>
    </div>
  )
}

export default ServiceIntervalSelect
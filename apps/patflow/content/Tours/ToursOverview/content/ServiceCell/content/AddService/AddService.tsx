import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { AddServiceProps, ButtonStates } from './types'
import { Divider, Modal, SwitchButtons } from '@repo/ui'
import ServiceDaySelect from './components/ServiceDaySelect';
import { ErrorMessage, PropertyService } from '@types';
import { generateGraphQLQuery, generateUuid, useDataHandler } from '@repo/provider';
import ServiceIntervalSelect from './components/ServiceTimeSelect.tsx ';
import styles from './AddService.module.scss';
import ServiceSettings from './components/ServiceSettings';
import { useQuery } from '@apollo/client';
import getButtonStates from './constants/button_states';
import { cloneDeep } from 'lodash';

const AddService: FC<AddServiceProps> = ({title, addService, setAddService, propertyId, serviceId, refetch}) => {
    const {updateData} = useDataHandler()
    const [loading, setLoading] = useState(false);
    const {data} = useQuery(generateGraphQLQuery({
        objectName: 'Property', 
        type: 'get',
        fields: ['services', 'objectId']
    }),
    {
        variables: {
            id: propertyId
        }
    })

    console.log({data});
    
    
    const [service, setService] = useState<PropertyService>( {
        id: generateUuid(),
        days: [],
        serviceId,
        active: true,
        type: 'interval',
        dates: [],
        interval: {
            number: 1,
            unit: 'weeks',
            start_date: '',
            end_date: ''
        },
        settings: {
            continue: true,
            repeat: false
        }
    })
    const button_states: ButtonStates = useMemo(() =>  getButtonStates(service.type), [service])
    const [errors, setErrors] = useState<ErrorMessage[]>([])
    console.log(button_states);
    
    const [buttonState, setButtonsState] = useState<typeof button_states[number]>(button_states[0] as typeof button_states[number])
    
    useEffect(() => {
        const errorArray: ErrorMessage[] = [];
        if (buttonState.value === 'day') {
            if (service.days.length === 0) {
                errorArray.push({message: 'Bitte wählen Sie mindestens einen Tag aus', id: 'no_day', key: 'no_day'})
            }
        }

        if (buttonState.value === 'interval' && service.type === 'interval') {
            if (!service.interval.start_date) {
                errorArray.push({message: 'Bitte wählen sie eine Startwoche für das Interval', id: 'no_interval', key: 'no_interval'})
            }
        }
        if (buttonState.value === 'interval' && service.type === 'dates') {
            if (service.dates.length === 0) {
                errorArray.push({message: 'Bitte wählen Sie mindestens ein Datum aus', id: 'no_days', key: 'no_days'})
            }
            if (service.dates.filter((val, i) => service.dates.includes(val, i + 1)).length > 0) {
                errorArray.push({message: 'Es dürfen keine doppelten Daten existieren', id: 'no_dublicates', key: 'no_dublicates'})
            }
        }

        setErrors(errorArray)

    }, [service, buttonState])

    console.log({service});

    const saveServiceHandler = useCallback(async () => {
        setLoading(true);
        if (data) {
            const property = data.objects.getProperty;
            console.log(property);
            const propertyServices = cloneDeep(property.services);
            const services = propertyServices || {};
            services[serviceId] = service;
            await updateData({
                className: 'Property',
                objectId: propertyId,
                updateObject: {
                    objectId: propertyId,
                    services: services
                },
                onError: () => {
                    setLoading(false);
                }
            })
        }
        await refetch();
        setLoading(false);
        setAddService(false)
    }, [service, data, serviceId, propertyId])
    

    return (
        <Modal
            header={title}
            isOpen={addService} 
            cancelButtonHandler={() => setAddService(false)}
            confirmButtonHandler={() => {
                if (buttonState.value === 'settings') {
                    saveServiceHandler()
                } else {
                    if (buttonState.value === 'interval' && service.type === 'interval') {
                        setButtonsState(button_states[1] )
                    } 
                    if (buttonState.value === 'interval' && service.type === 'dates') {
                        setButtonsState(button_states[2])
                    } 
                    if (buttonState.value === 'day') {
                        setButtonsState(button_states[2])
                    }
                }
            }}
            confirmButtonText={
                buttonState.value === 'settings' ? 'Speichern' : 'Weiter'
            }
            errors={errors}
            buttonDisabled={[loading, errors.length > 0 || loading]}
        >
            <div className={styles.switch_button_container}>
                <SwitchButtons
                    buttonStates={button_states}
                    changeHandler={setButtonsState}
                    currentStates={buttonState}
                    underlineButtons
                />
            </div>
                <Divider showLine={false} />
                <div className={styles.modal_content_container}>
                {buttonState.value === 'day' && (
                    <ServiceDaySelect 
                        days={service.days}
                        onChange={(days) => {
                            console.log(days);
                            
                            setService({...service, days: days})
                        }}
                    />
                )}
                {buttonState.value === 'interval' && (
                    <ServiceIntervalSelect 
                        service={service}
                        onChange={(service) => setService(service)}
                    />
                )}
                {buttonState.value === 'settings' && (
                    <ServiceSettings 
                        service={service}
                        onChange={(service) => {
                            setService(service)
                        }}
                    />
                )}
            </div>
        </Modal>
    )
}

export default AddService
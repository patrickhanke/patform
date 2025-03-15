'use client';

import React, { useState } from 'react';
import { interval_options } from './constants/interval_options';
import {
    ServiceTimeComponent,
    ServiceTimeData,
    ServiceTimeDataValue,
} from './types';
import { Select } from '@repo/ui';

const ServiceTime = ({ data, dataHandler }: ServiceTimeComponent) => {
    const [serviceTimeState, setServiceTimeState] = useState(data);

    const serviceTimeStateHandler = (
        key: keyof ServiceTimeData,
        value: ServiceTimeDataValue
    ) => {
        const serviceTimeStateCopy = { ...serviceTimeState };
        serviceTimeState[key] = value;
        dataHandler(serviceTimeStateCopy);
        setServiceTimeState(serviceTimeStateCopy);
    };

    return (
        <div>
            <Select
                onChange={value =>
                    serviceTimeStateHandler('interval', value.value)
                }
                options={interval_options}
                value={serviceTimeState.interval || ''}
            />
            {serviceTimeState.interval === 'individual'}
        </div>
    );
};

export default ServiceTime;

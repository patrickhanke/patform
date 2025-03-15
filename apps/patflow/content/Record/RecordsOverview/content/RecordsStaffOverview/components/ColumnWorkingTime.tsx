import React from 'react';
import { DayData } from '../types';
import { getDateString } from '@provider';
import { isArray } from 'lodash-es';

const ColumnWorkingTime = ({
    type,
    time,
}: {
    type: DayData['type'];
    time: DayData['time'];
}) => {
    if (type === 'work' && time && isArray(time)) {
        return (
            <div style={{}}>
                {time.map((timeValue, index) => {
                    if (!timeValue) {
                        return null;
                    }
                    return (
                        <>
                            <span key={getDateString(timeValue.start).time}>
                                {getDateString(timeValue.start).time} -{' '}
                                {getDateString(timeValue.end).time}{' '}
                            </span>
                            {index !== time.length - 1 && <span> / </span>}
                        </>
                    );
                })}
            </div>
        );
    }
    if (type === 'work' && time && !isArray(time)) {
        return (
            <div>
                {getDateString(time.start).time} -{' '}
                {getDateString(time.end).time}{' '}
            </div>
        );
    }
    return null;
};

export default ColumnWorkingTime;

import React, { useCallback } from 'react';
import { SurchargeDaySelectProps } from '../types';
import '../EditHoliday.scss';

const SurchargeDaySelect: React.FC<SurchargeDaySelectProps> = ({
    holidayTemplateChangeHandler,
    holidayTemplate,
    holidays = [],
}) => {
    const dayChangeHandler = useCallback(
        (day: string) => {
            if (holidayTemplate.holidays.includes(day)) {
                holidayTemplateChangeHandler(
                    'holidays',
                    holidayTemplate.holidays.filter(
                        dayToFind => dayToFind !== day
                    )
                );
            } else {
                holidayTemplateChangeHandler('holidays', [
                    ...holidayTemplate.holidays,
                    day,
                ]);
            }
        },
        [holidayTemplate]
    );

    return (
        <div className="create_surcharge_container">
            <h3>Feiertage</h3>
            {holidays.map(day => (
                <button
                    onClick={() => dayChangeHandler(day.id)}
                    className="day_select_container"
                    data-isselected={
                        holidayTemplate.holidays.findIndex(
                            dayToFind => dayToFind === day.id
                        ) !== -1
                    }
                    key={day.id}
                >
                    <span>{day.name}</span>
                </button>
            ))}
        </div>
    );
};

export default SurchargeDaySelect;
